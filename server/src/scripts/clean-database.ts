import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Starting database cleanup...");

  try {
    // Delete in topological dependency order:
    console.log("- Cleaning Return/Refund requests...");
    await prisma.refund.deleteMany({});
    await prisma.return.deleteMany({});
    await prisma.cancelReason.deleteMany({});

    console.log("- Cleaning Order Items & Orders...");
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});

    console.log("- Cleaning Stock levels & warehouse logs...");
    await prisma.stockLedger.deleteMany({});
    await prisma.inventoryStock.deleteMany({});
    await prisma.damagedStock.deleteMany({});
    await prisma.stockAudit.deleteMany({});
    await prisma.restockRequest.deleteMany({});
    await prisma.warehouse.deleteMany({});

    console.log("- Cleaning Product Catalog...");
    await prisma.productVariant.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.brand.deleteMany({});

    console.log("- Cleaning CRM leads & support tickets...");
    await prisma.lead.deleteMany({});
    await prisma.area.deleteMany({});
    await prisma.contactRequest.deleteMany({});

    console.log("- Cleaning CMS logs & global settings...");
    await prisma.blogPost.deleteMany({});
    await prisma.blogCategory.deleteMany({});
    await prisma.testimonial.deleteMany({});
    await prisma.fAQ.deleteMany({});
    await prisma.websitePage.deleteMany({});
    await prisma.sEOMetadata.deleteMany({});
    await prisma.banner.deleteMany({});
    await prisma.websiteSettings.deleteMany({});
    await prisma.mediaFile.deleteMany({});

    console.log("- Cleaning Financial accounts & operational expenses...");
    await prisma.expense.deleteMany({});
    await prisma.bankAccount.deleteMany({});

    console.log("- Cleaning Marketing configurations...");
    await prisma.coupon.deleteMany({});
    await prisma.emailTemplate.deleteMany({});
    await prisma.newsletterSubscriber.deleteMany({});

    console.log("- Cleaning Customer baskets & wishlists...");
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.wishlistItem.deleteMany({});
    await prisma.activityLog.deleteMany({});

    console.log("- Cleaning Customer address book & user registry...");
    await prisma.address.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("- Cleaning Admin Users (preserving SUPER_ADMIN)...");
    await prisma.adminUser.deleteMany({
      where: {
        role: {
          not: "SUPER_ADMIN",
        },
      },
    });

    console.log("✨ Database cleanup completed successfully!");
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
