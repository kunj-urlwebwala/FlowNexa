import { Router } from "express";
import { usersController } from "./users.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { listUsersSchema, updateUserSchema, getUserByIdSchema } from "./users.dto";
import { AdminRole } from "@prisma/client";

const router = Router();

// Apply auth protection on all routes
router.use(authMiddleware);

// Customer self-managed profile & address routes (No Admin RBAC check)
router.get("/profile", usersController.getMyProfile);
router.patch("/profile", usersController.updateMyProfile);
router.post("/profile/addresses", usersController.addAddress);
router.patch("/profile/addresses/:addressId", usersController.updateAddress);
router.delete("/profile/addresses/:addressId", usersController.deleteAddress);
router.patch("/profile/addresses/:addressId/default", usersController.setDefaultAddress);

// Admin-only RBAC checks
router.use(rbacMiddleware([AdminRole.SUPER_ADMIN, AdminRole.MANAGEMENT_TEAM, AdminRole.SUPPORT_STAFF]));

router.get("/", validateRequest(listUsersSchema), usersController.list);
router.get("/:id", validateRequest(getUserByIdSchema), usersController.getOne);
router.patch("/:id", validateRequest(updateUserSchema), usersController.update);
router.delete("/:id", validateRequest(getUserByIdSchema), usersController.delete);

export default router;
