import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middleware/validate.middleware";
import { loginSchema, registerSchema, adminLoginSchema, refreshSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.dto";

const router = Router();

router.post("/register", validateRequest(registerSchema), authController.register);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/admin/login", validateRequest(adminLoginSchema), authController.adminLogin);
router.post("/refresh", validateRequest(refreshSchema), authController.refresh);
router.post("/logout", authController.logout);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), authController.resetPassword);

export default router;
