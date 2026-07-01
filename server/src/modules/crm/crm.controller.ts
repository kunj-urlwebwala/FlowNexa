import { Request, Response, NextFunction } from "express";
import { crmService } from "./crm.service";
import { successResponse } from "../../shared/utils/response.util";

export class CrmController {
  // Leads
  async listLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const leads = await crmService.listLeads();
      successResponse(res, "Leads listed successfully", leads);
    } catch (error) {
      next(error);
    }
  }

  async getLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await crmService.getLeadById(req.params.id as string);
      successResponse(res, "Lead details retrieved successfully", lead);
    } catch (error) {
      next(error);
    }
  }

  async createLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await crmService.createLead(req.body);
      successResponse(res, "Lead created successfully", lead, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await crmService.updateLead(req.params.id as string, req.body);
      successResponse(res, "Lead updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await crmService.deleteLead(req.params.id as string);
      successResponse(res, "Lead deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  // Areas
  async listAreas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const areas = await crmService.listAreas();
      successResponse(res, "Territory areas listed successfully", areas);
    } catch (error) {
      next(error);
    }
  }

  async createArea(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const area = await crmService.createArea(req.body);
      successResponse(res, "Territory area created successfully", area, 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteArea(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await crmService.deleteArea(req.params.id as string);
      successResponse(res, "Territory area deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  // Contact requests
  async listContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await crmService.listContactRequests();
      successResponse(res, "Contact support requests listed successfully", list);
    } catch (error) {
      next(error);
    }
  }

  async createContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await crmService.createContactRequest(req.body);
      successResponse(res, "Contact ticket filed successfully", record, 201);
    } catch (error) {
      next(error);
    }
  }

  async readContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await crmService.markContactRequestRead(
        req.params.id as string,
        req.body.isRead
      );
      successResponse(res, "Contact request status updated", updated);
    } catch (error) {
      next(error);
    }
  }
}
export const crmController = new CrmController();
