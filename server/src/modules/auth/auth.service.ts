import { prisma } from "../../config/database";
import { hashPassword, verifyPassword } from "../../shared/utils/hash.util";
import { generateAccessToken, generateRefreshToken, TokenPayload, verifyRefreshToken } from "../../shared/utils/jwt.util";
import { AppError, AuthenticationError, ConflictError, NotFoundError } from "../../shared/errors/AppError";
import { AdminRole, AdminStatus } from "@prisma/client";
import { addEmailJob } from "../../jobs/queue";
import { generateWelcomeEmailHtml, generateWelcomeEmailSubject } from "../../shared/templates/welcome-email.template";
import { logger } from "../../config/logger";
import crypto from "crypto";
import { sendMail } from "../../shared/utils/email.util";
import { env } from "../../config/env";

export class AuthService {
  /**
   * Register a storefront user (customer)
   */
  async registerUser(data: any) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictError("Email already registered");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: "CUSTOMER",
      isAdmin: false,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Send welcome email (fire-and-forget, don't block response)
    try {
      await addEmailJob("send-welcome-email", {
        to: user.email,
        subject: generateWelcomeEmailSubject(),
        body: generateWelcomeEmailHtml({ customerName: user.name }),
      });
    } catch (error) {
      // Don't fail registration if email sending fails
      logger.error({ error, userId: user.id }, "Failed to schedule welcome email job (non-critical)");
    }

    return { user, accessToken, refreshToken };
  }

  /**
   * Login a storefront user
   */
  async loginUser(data: any) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || user.deletedAt) {
      throw new AuthenticationError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new AuthenticationError("User account is deactivated");
    }

    const isMatch = await verifyPassword(user.password, data.password);
    if (!isMatch) {
      throw new AuthenticationError("Invalid email or password");
    }

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: "CUSTOMER",
      isAdmin: false,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login an admin user
   */
  async loginAdmin(data: any) {
    const admin = await prisma.adminUser.findUnique({
      where: { email: data.email },
    });

    if (!admin || admin.deletedAt) {
      throw new AuthenticationError("Invalid email or password");
    }

    if (admin.status !== AdminStatus.ACTIVE) {
      throw new AuthenticationError(`Account status is ${admin.status.toLowerCase()}`);
    }

    const isMatch = await verifyPassword(admin.password, data.password);
    if (!isMatch) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Update last active
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastActive: new Date() },
    });

    const payload: TokenPayload = {
      userId: admin.id,
      email: admin.email,
      role: admin.role,
      username: admin.username,
      isAdmin: true,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        avatar: admin.avatar,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Forgot Password - Send reset link email
   */
  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user || user.deletedAt) {
      return { message: "If an account exists with this email, a reset link has been sent." };
    }

    // Generate a reset token (expires in 1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Hash the token before storing in database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Store hashed token and expiry in user record
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: resetTokenExpiry,
      },
    });

    // Send reset email
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}&userId=${user.id}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #84cc16;">Password Reset Request</h2>
        <p>Hi ${user.name},</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #84cc16; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #666; font-size: 12px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
        <br/>
        <p>Best regards,<br/>FlowNexa Team</p>
      </div>
    `;

    await sendMail(user.email, "Reset Your FlowNexa Password", html);

    logger.info({ userId: user.id }, "Password reset email sent");

    return { message: "If an account exists with this email, a reset link has been sent." };
  }

  /**
   * Reset Password - Set new password using token
   */
  async resetPassword(userId: string, token: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundError("Invalid reset request");
    }

    // Validate reset token exists
    if (!user.resetToken || !user.resetTokenExpiry) {
      throw new AppError("No reset request found. Please request a new password reset.", 400);
    }

    // Check if token has expired
    if (new Date() > user.resetTokenExpiry) {
      // Clear expired token
      await prisma.user.update({
        where: { id: userId },
        data: { resetToken: null, resetTokenExpiry: null },
      });
      throw new AppError("Reset token has expired. Please request a new password reset.", 400);
    }

    // Hash the provided token and compare with stored hash
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    if (hashedToken !== user.resetToken) {
      throw new AppError("Invalid reset token.", 400);
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    logger.info({ userId }, "Password reset successfully");

    return { message: "Password has been reset successfully. You can now login with your new password." };
  }

  /**
   * Refresh token
   */
  async refreshToken(token: string) {
    try {
      const decoded = verifyRefreshToken(token);

      if (decoded.isAdmin) {
        const admin = await prisma.adminUser.findUnique({
          where: { id: decoded.userId },
        });

        if (!admin || admin.status !== AdminStatus.ACTIVE || admin.deletedAt) {
          throw new AuthenticationError("Admin user no longer active");
        }

        const payload: TokenPayload = {
          userId: admin.id,
          email: admin.email,
          role: admin.role,
          username: admin.username,
          isAdmin: true,
        };

        return {
          accessToken: generateAccessToken(payload),
          refreshToken: generateRefreshToken(payload),
        };
      } else {
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });

        if (!user || !user.isActive || user.deletedAt) {
          throw new AuthenticationError("User no longer active");
        }

        const payload: TokenPayload = {
          userId: user.id,
          email: user.email,
          role: "CUSTOMER",
          isAdmin: false,
        };

        return {
          accessToken: generateAccessToken(payload),
          refreshToken: generateRefreshToken(payload),
        };
      }
    } catch (error) {
      throw new AuthenticationError("Invalid or expired refresh token");
    }
  }
}
export const authService = new AuthService();
