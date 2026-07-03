import { prisma } from "../../config/database";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError";

export class CrmService {
  // ----------------------------------------------------
  // LEADS PIPELINE
  // ----------------------------------------------------

  async listLeads(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.lead.findMany({ skip, take: limit, orderBy: { updatedAt: "desc" } }),
      prisma.lead.count(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
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

  async listAreas(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.area.findMany({ skip, take: limit, orderBy: { regionName: "asc" } }),
      prisma.area.count(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
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

  async listContactRequests(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.contactRequest.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.contactRequest.count(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
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
