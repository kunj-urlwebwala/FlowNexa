import { Router } from "express";
import { teamsController } from "./teams.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { createTeamMemberSchema, updateTeamMemberSchema, getTeamMemberByIdSchema } from "./teams.dto";
import { AdminRole } from "@prisma/client";

const router = Router();

// Apply auth and RBAC restrictions to all endpoints
router.use(authMiddleware);
router.use(rbacMiddleware([AdminRole.SUPER_ADMIN, AdminRole.MANAGEMENT_TEAM]));

router.get("/", teamsController.list);
router.post("/", validateRequest(createTeamMemberSchema), teamsController.create);
router.get("/:id", validateRequest(getTeamMemberByIdSchema), teamsController.getOne);
router.patch("/:id", validateRequest(updateTeamMemberSchema), teamsController.update);
router.delete("/:id", validateRequest(getTeamMemberByIdSchema), teamsController.delete);

export default router;
