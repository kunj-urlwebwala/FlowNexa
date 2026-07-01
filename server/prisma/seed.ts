import { PrismaClient, AdminRole, AdminStatus, PaymentStatus, PaymentMethod } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 4,
  });
}

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing database
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "AdminUser", "User", "Category", "Brand", "Product", "ProductVariant", "Warehouse", "InventoryStock", "Lead", "Area" CASCADE;`
  );

  const adminPassword = await hashPassword("admin123");

  // 1. Create Default Admin Users
  console.log("Seeding Super Admin...");
  await prisma.adminUser.create({
    data: {
      email: "admin@flownexa.com",
      username: "superadmin",
      password: adminPassword,
      name: "Alex Mercer",
      role: AdminRole.SUPER_ADMIN,
      status: AdminStatus.ACTIVE,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    },
  });

  // 2. Create Brands matching storefront categories/brands
  console.log("Seeding Brands...");
  const brandSequoia = await prisma.brand.create({
    data: { id: "brand-1", name: "Sequoia", slug: "sequoia", description: "Premium audio and lifestyle products." },
  });
  const brandFlownexa = await prisma.brand.create({
    data: { id: "brand-2", name: "FlowNexa", slug: "flownexa", description: "Official FlowNexa accessories." },
  });

  // 3. Create Categories matching storefront categories
  console.log("Seeding Categories...");
  await prisma.category.create({
    data: { id: "cat-1", name: "Audio & Acoustics", slug: "audio", description: "Headphones, earbuds, and audio gears." },
  });
  await prisma.category.create({
    data: { id: "cat-2", name: "Smart Wearables", slug: "wearables", description: "Smartwatches and fitness trackers." },
  });
  await prisma.category.create({
    data: { id: "cat-3", name: "Tech Accessories", slug: "accessories", description: "Chargers, cases, and powerbanks." },
  });
  await prisma.category.create({
    data: { id: "cat-4", name: "Premium Devices", slug: "electronics", description: "VR headsets and smart screens." },
  });
  await prisma.category.create({
    data: { id: "cat-5", name: "Smart Home", slug: "smart-home", description: "Lighting, smart plugs, and speakers." },
  });
  await prisma.category.create({
    data: { id: "cat-6", name: "Gaming Gears", slug: "gaming", description: "Mechanical keyboards and precision mice." },
  });

  // 4. Create Warehouses
  console.log("Seeding Warehouses...");
  const whMumbai = await prisma.warehouse.create({
    data: {
      name: "Mumbai Primary Distribution Center",
      code: "WH-BOM-01",
      address: "Warehouse Block A, Near Port Trust Area, Mumbai, MH",
      capacity: 50000,
    },
  });

  // 5. Create Products matching storefront mockup IDs "prod-1" through "prod-8"
  console.log("Seeding Storefront Catalog Products...");

  const productsToSeed = [
    {
      id: "prod-1",
      name: "Sequoia Inspiring Musico Pro",
      slug: "sequoia-inspiring-musico-pro",
      price: 24900, // in INR
      compareAtPrice: 32900,
      description: "Experience sound in its purest form with Sequoia Inspiring Musico Pro. Engineered with custom-built dynamic drivers and active noise cancellation, these royal blue headphones deliver an immersive, studio-quality soundscape.",
      categoryId: "cat-1",
      brandId: "brand-1",
      images: ["/images/products/headphones.png"],
      isActive: true,
      sku: "SEQ-MP-BLU",
    },
    {
      id: "prod-2",
      name: "FlowNexa Orizon VR Headset",
      slug: "flownexa-orizon-vr",
      price: 49900,
      compareAtPrice: 65900,
      description: "Step into new dimensions with the FlowNexa Orizon VR Headset. Featuring custom high-resolution dual LCD displays (2K per eye) and advanced spatial audio integration.",
      categoryId: "cat-4",
      brandId: "brand-2",
      images: ["/images/products/vr-headset.png"],
      isActive: true,
      sku: "FN-ORZ-VR",
    },
    {
      id: "prod-3",
      name: "Aural X-Buds Pro",
      slug: "aural-x-buds-pro",
      price: 12900,
      compareAtPrice: 16900,
      description: "True wireless audio, redefined. The Aural X-Buds Pro feature high-fidelity audio, crystal-clear call quality through triple microphone arrays, and intelligent active noise cancellation.",
      categoryId: "cat-1",
      brandId: "brand-1",
      images: ["/images/products/earbuds.png"],
      isActive: true,
      sku: "AR-XB-PRO",
    },
    {
      id: "prod-4",
      name: "Apex Gaming Keyboard V2",
      slug: "apex-gaming-keyboard-v2",
      price: 10900,
      compareAtPrice: 12900,
      description: "Take control of your gaming experience with the Apex Mechanical Keyboard. Featuring custom linear red switches, full RGB backlighting with per-key customization.",
      categoryId: "cat-6",
      brandId: "brand-2",
      images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=60"],
      isActive: true,
      sku: "APX-GK-V2",
    },
    {
      id: "prod-5",
      name: "Horizon Smartwatch Horizon-X",
      slug: "horizon-smartwatch-horizon-x",
      price: 21900,
      compareAtPrice: 25900,
      description: "Elevate your daily routine with the Horizon-X Smartwatch. Packed with advanced wellness tracking sensors including heart rate, SpO2, and sleep quality analytics.",
      categoryId: "cat-2",
      brandId: "brand-2",
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60"],
      isActive: true,
      sku: "HRZ-SW-X",
    },
    {
      id: "prod-6",
      name: "Lumina Smart Bulb Kit",
      slug: "lumina-smart-bulb-kit",
      price: 6900,
      compareAtPrice: 8900,
      description: "Transform your home ambiance with the Lumina Smart Bulb Starter Kit. Includes 3 smart RGB LED bulbs that connect directly to your Wi-Fi network.",
      categoryId: "cat-5",
      brandId: "brand-2",
      images: ["https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&auto=format&fit=crop&q=60"],
      isActive: true,
      sku: "LMN-SB-KIT",
    },
    {
      id: "prod-7",
      name: "Onyx Wireless Power Bank",
      slug: "onyx-wireless-power-bank",
      price: 4900,
      compareAtPrice: 5900,
      description: "Fast wireless charging on the go. The Onyx Power Bank offers 10,000mAh capacity with strong magnetic alignment to snap onto compatible smartphones.",
      categoryId: "cat-3",
      brandId: "brand-1",
      images: ["https://images.unsplash.com/photo-1609592424109-dd772c72b1cc?w=600&auto=format&fit=crop&q=60"],
      isActive: true,
      sku: "ONX-WPB-10",
    },
    {
      id: "prod-8",
      name: "Zenith ANC Wireless Headphones",
      slug: "zenith-anc-headphones",
      price: 16900,
      compareAtPrice: 19900,
      description: "Escape the noise with Zenith Wireless Headphones. Hybrid active noise cancellation technology blocks out surrounding din, leaving you with detailed high-res audio.",
      categoryId: "cat-1",
      brandId: "brand-1",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60"],
      isActive: true,
      sku: "ZEN-HP-ANC",
    },
  ];

  for (const prodData of productsToSeed) {
    const seededProduct = await prisma.product.create({
      data: {
        id: prodData.id,
        name: prodData.name,
        slug: prodData.slug,
        description: prodData.description,
        price: prodData.price,
        compareAtPrice: prodData.compareAtPrice,
        categoryId: prodData.categoryId,
        brandId: prodData.brandId,
        images: prodData.images,
        isActive: prodData.isActive,
      },
    });

    // Create a variant
    const variant = await prisma.productVariant.create({
      data: {
        productId: seededProduct.id,
        sku: prodData.sku,
        price: prodData.price,
        attributes: { color: "Default" },
      },
    });

    // Seed stock levels
    await prisma.inventoryStock.create({
      data: {
        warehouseId: whMumbai.id,
        productId: seededProduct.id,
        variantId: variant.id,
        quantity: 500,
      },
    });
  }

  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
