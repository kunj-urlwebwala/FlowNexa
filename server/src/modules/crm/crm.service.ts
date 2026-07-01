import { prisma } from "../../config/database";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError";

export class CrmService {
  // ----------------------------------------------------
  // LEADS PIPELINE
  // ----------------------------------------------------

  async listLeads() {
    return prisma.lead.findMany({
      orderBy: { updatedAt: "desc" },
    });
  }

  async getLeadById(id: string) {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundError("Lead card not found");
    return lead;
  }

  async createLead(data: any) {
    return prisma.lead.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        email: data.email,
        phone: data.phone,
        status: data.status,
        columnId: data.columnId,
      },
    });
  }

  async updateLead(id: string, data: any) {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundError("Lead card not found");

    return prisma.lead.update({
      where: { id },
      data,
    });
  }

  async deleteLead(id: string) {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundError("Lead card not found");

    await prisma.lead.delete({ where: { id } });
    return null;
  }

  // ----------------------------------------------------
  // GEOGRAPHIC AREAS
  // ----------------------------------------------------

  async listAreas() {
    return prisma.area.findMany({
      orderBy: { regionName: "asc" },
    });
  }

  async createArea(data: any) {
    const existing = await prisma.area.findUnique({ where: { regionName: data.regionName } });
    if (existing) throw new ConflictError("Geographic region area already exists");

    return prisma.area.create({
      data: {
        regionName: data.regionName,
        country: data.country,
      },
    });
  }

  async deleteArea(id: string) {
    const area = await prisma.area.findUnique({ where: { id } });
    if (!area) throw new NotFoundError("Territory area not found");

    await prisma.area.delete({ where: { id } });
    return null;
  }

  // ----------------------------------------------------
  // CONTACT REQUESTS
  // ----------------------------------------------------

  async listContactRequests() {
    return prisma.contactRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async createContactRequest(data: any) {
    return prisma.contactRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      },
    });
  }

  async markContactRequestRead(id: string, isRead: boolean) {
    const request = await prisma.contactRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundError("Contact request not found");

    return prisma.contactRequest.update({
      where: { id },
      data: { isRead },
    });
  }
}
export const crmService = new CrmService();
