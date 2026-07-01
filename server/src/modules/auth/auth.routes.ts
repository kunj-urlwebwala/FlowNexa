import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middleware/validate.middleware";
import { loginSchema, registerSchema, adminLoginSchema, refreshSchema } from "./auth.dto";

const router = Router();

router.post("/register", validateRequest(registerSchema), authController.register);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/admin/login", validateRequest(adminLoginSchema), authController.adminLogin);
router.post("/refresh", validateRequest(refreshSchema), authController.refresh);
router.post("/logout", authController.logout);

export default router;
