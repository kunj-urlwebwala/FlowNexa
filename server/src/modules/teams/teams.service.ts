import { prisma } from "../../config/database";
import { hashPassword } from "../../shared/utils/hash.util";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError";

export class TeamsService {
  /**
   * List admin team members
   */
  async listTeamMembers() {
    const members = await prisma.adminUser.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        status: true,
        avatar: true,
        lastActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return members;
  }

  /**
   * Create a new team member
   */
  async createTeamMember(data: any) {
    const existingEmail = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username },
        ],
      },
    });

    if (existingEmail) {
      throw new ConflictError("Email or Username is already registered for an admin user");
    }

    const hashedPassword = await hashPassword(data.password);

    const member = await prisma.adminUser.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        name: data.name,
        role: data.role,
        avatar: data.avatar,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
      },
    });

    return member;
  }

  /**
   * Get team member details
   */
  async getTeamMemberById(id: string) {
    const member = await prisma.adminUser.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        status: true,
        avatar: true,
        lastActive: true,
        createdAt: true,
        activityLogs: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!member) {
      throw new NotFoundError("Team member not found");
    }

    return member;
  }

  /**
   * Update team member profile/role
   */
  async updateTeamMember(id: string, data: any) {
    const member = await prisma.adminUser.findFirst({
      where: { id, deletedAt: null },
    });

    if (!member) {
      throw new NotFoundError("Team member not found");
    }

    const updated = await prisma.adminUser.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
      },
    });

    return updated;
  }

  /**
   * Remove team member (soft-delete)
   */
  async deleteTeamMember(id: string) {
    const member = await prisma.adminUser.findFirst({
      where: { id, deletedAt: null },
    });

    if (!member) {
      throw new NotFoundError("Team member not found");
    }

    // Do not allow deleting the last Super Admin
    if (member.role === "SUPER_ADMIN") {
      const superAdminCount = await prisma.adminUser.count({
        where: { role: "SUPER_ADMIN", deletedAt: null },
      });
      if (superAdminCount <= 1) {
        throw new ConflictError("Cannot remove the last remaining Super Admin");
      }
    }

    await prisma.adminUser.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return null;
  }
}
export const teamsService = new TeamsService();
