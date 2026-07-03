import { Request, Response, NextFunction } from "express";
import { teamsService } from "./teams.service";
import { successResponse } from "../../shared/utils/response.util";

export class TeamsController {
  /**
   * List admin team members
   */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await teamsService.listTeamMembers(page, limit);
      successResponse(res, "Admin team members listed successfully", result.items, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create admin team member
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const member = await teamsService.createTeamMember(req.body);
      successResponse(res, "Team member added successfully", member, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get team member details
   */
  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const member = await teamsService.getTeamMemberById(req.params.id as string);
      successResponse(res, "Team member details retrieved successfully", member);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update team member status/role
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await teamsService.updateTeamMember(req.params.id as string, req.body);
      successResponse(res, "Team member profile updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete team member
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await teamsService.deleteTeamMember(req.params.id as string);
      successResponse(res, "Team member removed successfully", null);
    } catch (error) {
      next(error);
    }
  }
}
export const teamsController = new TeamsController();
