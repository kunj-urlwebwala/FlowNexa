import { Router } from "express";
import { crmController } from "./crm.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import {
  createLeadSchema,
  updateLeadSchema,
  createAreaSchema,
  createContactRequestSchema,
  getLeadByIdSchema,
} from "./crm.dto";
import { AdminRole } from "@prisma/client";

const router = Router();

// Public storefront contact endpoint
router.post("/contact", validateRequest(createContactRequestSchema), crmController.createContact);

// Admin-only routing boundaries
router.use(authMiddleware);
router.use(rbacMiddleware([AdminRole.SUPER_ADMIN, AdminRole.MANAGEMENT_TEAM, AdminRole.SUPPORT_STAFF]));

// Leads pipeline CRUD
router.get("/leads", crmController.listLeads);
router.get("/leads/:id", validateRequest(getLeadByIdSchema), crmController.getLead);
router.post("/leads", validateRequest(createLeadSchema), crmController.createLead);
router.patch("/leads/:id", validateRequest(updateLeadSchema), crmController.updateLead);
router.delete("/leads/:id", validateRequest(getLeadByIdSchema), crmController.deleteLead);

// Areas
router.get("/areas", crmController.listAreas);
router.post("/areas", validateRequest(createAreaSchema), crmController.createArea);
router.delete("/areas/:id", crmController.deleteArea);

// Contact requests list & mark-read
router.get("/contact", crmController.listContact);
router.patch("/contact/:id/read", crmController.readContact);

export default router;
