import { PrismaClient, AdminRole, AdminStatus, PaymentStatus, PaymentMethod } from "@prisma/client";
import argon2 from "argon2";
import * as process from "process";

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
  console.log("Starting database seeding...");

  // Clean existing database — include ALL tables we'll seed
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "OrderItem", "Order", "InventoryStock", "StockLedger", "ProductVariant", "Product", "Category", "Brand", "Warehouse", "AdminUser", "User", "Address", "VerificationCall", "CancelReason" CASCADE;`
  );

  const adminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("user123");

  // ============================================================
  // 1. ADMIN USERS
  // ============================================================
  console.log("Seeding Admin Users...");
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

  // ============================================================
  // 2. BRANDS
  // ============================================================
  console.log("Seeding Brands...");
  const brandSequoia = await prisma.brand.create({
    data: { id: "brand-1", name: "Sequoia", slug: "sequoia", description: "Premium audio and lifestyle products." },
  });
  const brandFlownexa = await prisma.brand.create({
    data: { id: "brand-2", name: "FlowNexa", slug: "flownexa", description: "Official FlowNexa accessories." },
  });

  // ============================================================
  // 3. CATEGORIES + SUBCATEGORIES
  // ============================================================
  console.log("Seeding Categories & Subcategories...");
  // Root categories
  await prisma.category.create({
    data: { id: "cat-1", name: "Audio & Acoustics", slug: "audio", description: "Headphones, earbuds, and audio gears.", image: "/images/categories/audio.jpg" },
  });
  await prisma.category.create({
    data: { id: "cat-2", name: "Smart Wearables", slug: "wearables", description: "Smartwatches and fitness trackers.", image: "/images/categories/wearables.jpg" },
  });
  await prisma.category.create({
    data: { id: "cat-3", name: "Tech Accessories", slug: "accessories", description: "Chargers, cases, and powerbanks.", image: "/images/categories/accessories.jpg" },
  });
  await prisma.category.create({
    data: { id: "cat-4", name: "Premium Devices", slug: "electronics", description: "VR headsets and smart screens.", image: "/images/categories/electronics.jpg" },
  });
  await prisma.category.create({
    data: { id: "cat-5", name: "Smart Home", slug: "smart-home", description: "Lighting, smart plugs, and speakers.", image: "/images/categories/smart-home.jpg" },
  });
  await prisma.category.create({
    data: { id: "cat-6", name: "Gaming Gear", slug: "gaming", description: "Mechanical keyboards and precision mice.", image: "/images/categories/gaming.jpg" },
  });

  // Subcategories (using self-referential parentId)
  const subcategories = [
    { id: "subcat-1", name: "Headphones", slug: "headphones", parentId: "cat-1", description: "Over-ear and on-ear headphones" },
    { id: "subcat-2", name: "Earbuds", slug: "earbuds", parentId: "cat-1", description: "True wireless and wired earbuds" },
    { id: "subcat-3", name: "Speakers", slug: "speakers", parentId: "cat-1", description: "Portable and home speakers" },
    { id: "subcat-4", name: "Smartwatches", slug: "smartwatches", parentId: "cat-2", description: "Full-featured smartwatches" },
    { id: "subcat-5", name: "Fitness Bands", slug: "fitness-bands", parentId: "cat-2", description: "Activity and fitness trackers" },
    { id: "subcat-6", name: "Chargers", slug: "chargers", parentId: "cat-3", description: "Chargers, cables, and adapters" },
    { id: "subcat-7", name: "Keyboards", slug: "keyboards", parentId: "cat-3", description: "Mechanical and membrane keyboards" },
    { id: "subcat-8", name: "Power Banks", slug: "power-banks", parentId: "cat-3", description: "Portable batteries and power banks" },
    { id: "subcat-9", name: "Mice", slug: "mice", parentId: "cat-3", description: "Wired and wireless mice" },
    { id: "subcat-10", name: "Virtual Reality", slug: "virtual-reality", parentId: "cat-4", description: "VR headsets and accessories" },
    { id: "subcat-11", name: "Smart Screens", slug: "smart-screens", parentId: "cat-4", description: "Smart displays and monitors" },
    { id: "subcat-12", name: "Lighting", slug: "lighting", parentId: "cat-5", description: "Smart bulbs and lighting kits" },
    { id: "subcat-13", name: "Plugs & Switches", slug: "plugs-switches", parentId: "cat-5", description: "Smart plugs and switches" },
    { id: "subcat-14", name: "Controllers", slug: "controllers", parentId: "cat-6", description: "Game controllers and joysticks" },
  ];

  for (const sub of subcategories) {
    await prisma.category.create({ data: sub });
  }

  // ============================================================
  // 4. WAREHOUSES
  // ============================================================
  console.log("Seeding Warehouses...");
  const whMumbai = await prisma.warehouse.create({
    data: { name: "Mumbai Primary Distribution Center", code: "WH-BOM-01", address: "Warehouse Block A, Near Port Trust Area, Mumbai, MH", capacity: 50000 },
  });
  const whSF = await prisma.warehouse.create({
    data: { name: "SF Logistics Center", code: "WH-SF-01", address: "123 Logistics Ave, San Francisco, CA 94105", capacity: 35000 },
  });
  const whNY = await prisma.warehouse.create({
    data: { name: "NY East Hub", code: "WH-NY-01", address: "456 Distribution Blvd, New York, NY 10001", capacity: 40000 },
  });

  // ============================================================
  // 5. CUSTOMER USERS
  // ============================================================
  console.log("Seeding Customer Users...");
  const user1 = await prisma.user.create({
    data: {
      id: "user-1",
      email: "alex@mercer.com",
      password: userPassword,
      name: "Alex Mercer",
      phone: "+1-555-019-2834",
    },
  });
  const user2 = await prisma.user.create({
    data: {
      id: "user-2",
      email: "sarah@connor.com",
      password: userPassword,
      name: "Sarah Connor",
      phone: "+1-555-014-9982",
    },
  });
  const user3 = await prisma.user.create({
    data: {
      id: "user-3",
      email: "bruce@wayne.com",
      password: userPassword,
      name: "Bruce Wayne",
      phone: "+1-555-999-0000",
    },
  });

  // Addresses
  await prisma.address.create({
    data: { userId: "user-1", type: "SHIPPING", fullName: "Alex Mercer", phone: "+1-555-019-2834", street: "742 Market Street", city: "San Francisco", state: "CA", postalCode: "94102", country: "US", isDefault: true },
  });
  await prisma.address.create({
    data: { userId: "user-1", type: "BILLING", fullName: "Alex Mercer", phone: "+1-555-019-2834", street: "742 Market Street", city: "San Francisco", state: "CA", postalCode: "94102", country: "US", isDefault: true },
  });
  await prisma.address.create({
    data: { userId: "user-2", type: "SHIPPING", fullName: "Sarah Connor", phone: "+1-555-014-9982", street: "89 Lexington Ave", city: "New York", state: "NY", postalCode: "10016", country: "US", isDefault: true },
  });
  await prisma.address.create({
    data: { userId: "user-3", type: "SHIPPING", fullName: "Bruce Wayne", phone: "+1-555-999-0000", street: "1007 Wayne Manor", city: "Gotham", state: "NY", postalCode: "10027", country: "US", isDefault: true },
  });

  // ============================================================
  // 6. PRODUCTS
  // ============================================================
  console.log("Seeding Products...");

  interface ProductSeed {
    id: string; name: string; slug: string; price: number; compareAtPrice: number | null;
    description: string; categoryId: string; brandId: string; images: string[]; isActive: boolean;
    variants: { sku: string; price: number; attributes: Record<string, string>; stockPerWarehouse: Record<string, number> }[];
  }

  const productsToSeed: ProductSeed[] = [
    {
      id: "prod-1", name: "Sequoia Inspiring Musico Pro", slug: "sequoia-inspiring-musico-pro",
      price: 24900, compareAtPrice: 32900,
      description: "Experience sound in its purest form with Sequoia Inspiring Musico Pro. Engineered with custom-built dynamic drivers and active noise cancellation, these royal blue headphones deliver an immersive, studio-quality soundscape.",
      categoryId: "cat-1", brandId: "brand-1",
      images: ["/images/products/headphones.png"],
      isActive: true,
      variants: [
        { sku: "SEQ-MP-BLU", price: 24900, attributes: { color: "Royal Blue" }, stockPerWarehouse: { "WH-BOM-01": 200, "WH-SF-01": 150, "WH-NY-01": 100 } },
        { sku: "SEQ-MP-CHAR", price: 24900, attributes: { color: "Dark Charcoal" }, stockPerWarehouse: { "WH-BOM-01": 180, "WH-SF-01": 120, "WH-NY-01": 80 } },
      ],
    },
    {
      id: "prod-2", name: "FlowNexa Orizon VR Headset", slug: "flownexa-orizon-vr",
      price: 49900, compareAtPrice: 65900,
      description: "Step into new dimensions with the FlowNexa Orizon VR Headset. Featuring custom high-resolution dual LCD displays (2K per eye) and advanced spatial audio integration.",
      categoryId: "cat-4", brandId: "brand-2",
      images: ["/images/products/vr-headset.png"],
      isActive: true,
      variants: [
        { sku: "FN-ORZ-VR-W", price: 49900, attributes: { color: "Glacier White" }, stockPerWarehouse: { "WH-BOM-01": 50, "WH-SF-01": 80, "WH-NY-01": 40 } },
        { sku: "FN-ORZ-VR-B", price: 49900, attributes: { color: "Obsidian Black" }, stockPerWarehouse: { "WH-BOM-01": 60, "WH-SF-01": 70, "WH-NY-01": 35 } },
      ],
    },
    {
      id: "prod-3", name: "Aural X-Buds Pro", slug: "aural-x-buds-pro",
      price: 12900, compareAtPrice: 16900,
      description: "True wireless audio, redefined. The Aural X-Buds Pro feature high-fidelity audio, crystal-clear call quality through triple microphone arrays, and intelligent active noise cancellation.",
      categoryId: "cat-1", brandId: "brand-1",
      images: ["/images/products/earbuds.png"],
      isActive: true,
      variants: [
        { sku: "AR-XB-PRO-LM", price: 12900, attributes: { color: "Neon Lime" }, stockPerWarehouse: { "WH-BOM-01": 300, "WH-SF-01": 200, "WH-NY-01": 150 } },
        { sku: "AR-XB-PRO-CH", price: 12900, attributes: { color: "Charcoal Black" }, stockPerWarehouse: { "WH-BOM-01": 250, "WH-SF-01": 180, "WH-NY-01": 120 } },
      ],
    },
    {
      id: "prod-4", name: "Apex Gaming Keyboard V2", slug: "apex-gaming-keyboard-v2",
      price: 10900, compareAtPrice: 12900,
      description: "Take control of your gaming experience with the Apex Mechanical Keyboard. Featuring custom linear red switches, full RGB backlighting with per-key customization.",
      categoryId: "cat-6", brandId: "brand-2",
      images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=60"],
      isActive: true,
      variants: [
        { sku: "APX-GK-V2", price: 10900, attributes: { color: "Default" }, stockPerWarehouse: { "WH-BOM-01": 80, "WH-SF-01": 60, "WH-NY-01": 40 } },
      ],
    },
    {
      id: "prod-5", name: "Horizon Smartwatch Horizon-X", slug: "horizon-smartwatch-horizon-x",
      price: 21900, compareAtPrice: 25900,
      description: "Elevate your daily routine with the Horizon-X Smartwatch. Packed with advanced wellness tracking sensors including heart rate, SpO2, and sleep quality analytics.",
      categoryId: "cat-2", brandId: "brand-2",
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60"],
      isActive: true,
      variants: [
        { sku: "HRZ-SW-X-B", price: 21900, attributes: { color: "Obsidian Black" }, stockPerWarehouse: { "WH-BOM-01": 100, "WH-SF-01": 80, "WH-NY-01": 50 } },
        { sku: "HRZ-SW-X-LM", price: 21900, attributes: { color: "Lime Accent" }, stockPerWarehouse: { "WH-BOM-01": 60, "WH-SF-01": 40, "WH-NY-01": 30 } },
        { sku: "HRZ-SW-X-R", price: 21900, attributes: { color: "Red Accent" }, stockPerWarehouse: { "WH-BOM-01": 40, "WH-SF-01": 30, "WH-NY-01": 20 } },
      ],
    },
    {
      id: "prod-6", name: "Lumina Smart Bulb Kit", slug: "lumina-smart-bulb-kit",
      price: 6900, compareAtPrice: 8900,
      description: "Transform your home ambiance with the Lumina Smart Bulb Starter Kit. Includes 3 smart RGB LED bulbs that connect directly to your Wi-Fi network.",
      categoryId: "cat-5", brandId: "brand-2",
      images: ["https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&auto=format&fit=crop&q=60"],
      isActive: true,
      variants: [
        { sku: "LMN-SB-KIT", price: 6900, attributes: { color: "White" }, stockPerWarehouse: { "WH-BOM-01": 400, "WH-SF-01": 250, "WH-NY-01": 200 } },
      ],
    },
    {
      id: "prod-7", name: "Onyx Wireless Power Bank", slug: "onyx-wireless-power-bank",
      price: 4900, compareAtPrice: 5900,
      description: "Fast wireless charging on the go. The Onyx Power Bank offers 10,000mAh capacity with strong magnetic alignment to snap onto compatible smartphones.",
      categoryId: "cat-3", brandId: "brand-1",
      images: ["https://images.unsplash.com/photo-1609592424109-dd772c72b1cc?w=600&auto=format&fit=crop&q=60"],
      isActive: true,
      variants: [
        { sku: "ONX-WPB-10", price: 4900, attributes: { color: "Black" }, stockPerWarehouse: { "WH-BOM-01": 500, "WH-SF-01": 300, "WH-NY-01": 200 } },
      ],
    },
    {
      id: "prod-8", name: "Zenith ANC Wireless Headphones", slug: "zenith-anc-headphones",
      price: 16900, compareAtPrice: 19900,
      description: "Escape the noise with Zenith Wireless Headphones. Hybrid active noise cancellation technology blocks out surrounding din, leaving you with detailed high-res audio.",
      categoryId: "cat-1", brandId: "brand-1",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60"],
      isActive: true,
      variants: [
        { sku: "ZEN-HP-ANC-B", price: 16900, attributes: { color: "Black" }, stockPerWarehouse: { "WH-BOM-01": 150, "WH-SF-01": 100, "WH-NY-01": 70 } },
        { sku: "ZEN-HP-ANC-W", price: 16900, attributes: { color: "White" }, stockPerWarehouse: { "WH-BOM-01": 100, "WH-SF-01": 80, "WH-NY-01": 50 } },
      ],
    },
    {
      id: "prod-9", name: "Atlas Smart Thermostat", slug: "atlas-smart-thermostat",
      price: 18900, compareAtPrice: null,
      description: "Take control of your home climate with Atlas. It automatically learns your schedule and temperature preferences to optimize energy efficiency. The sleek circular glass touch interface blends seamlessly into any modern home design.",
      categoryId: "cat-5", brandId: "brand-2",
      images: ["https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=600&auto=format&fit=crop&q=60"],
      isActive: true,
      variants: [
        { sku: "ATL-TST-B", price: 18900, attributes: { color: "Black" }, stockPerWarehouse: { "WH-BOM-01": 70, "WH-SF-01": 50, "WH-NY-01": 30 } },
        { sku: "ATL-TST-W", price: 18900, attributes: { color: "White" }, stockPerWarehouse: { "WH-BOM-01": 50, "WH-SF-01": 40, "WH-NY-01": 25 } },
      ],
    },
    {
      id: "prod-10", name: "Prime Wireless Ergonomic Mouse", slug: "prime-ergonomic-mouse",
      price: 7900, compareAtPrice: 9900,
      description: "Maximize your productivity and wrist comfort. The Prime Ergonomic Mouse features an optimal 57-degree vertical angle to reduce wrist strain. The high-precision optical sensor works flawlessly on almost any surface including glass.",
      categoryId: "cat-3", brandId: "brand-2",
      images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60"],
      isActive: true,
      variants: [
        { sku: "PRM-EM-B", price: 7900, attributes: { color: "Black" }, stockPerWarehouse: { "WH-BOM-01": 200, "WH-SF-01": 150, "WH-NY-01": 100 } },
        { sku: "PRM-EM-W", price: 7900, attributes: { color: "White" }, stockPerWarehouse: { "WH-BOM-01": 120, "WH-SF-01": 80, "WH-NY-01": 50 } },
      ],
    },
  ];

  const warehouseMap: Record<string, string> = {
    "WH-BOM-01": whMumbai.id,
    "WH-SF-01": whSF.id,
    "WH-NY-01": whNY.id,
  };

  // Track variant IDs for order items
  const variantMap: Record<string, { variantId: string; productName: string; price: number }[]> = {};

  for (const prodData of productsToSeed) {
    await prisma.product.create({
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

    variantMap[prodData.id] = [];

    for (const variant of prodData.variants) {
      const createdVariant = await prisma.productVariant.create({
        data: {
          productId: prodData.id,
          sku: variant.sku,
          price: variant.price,
          attributes: variant.attributes,
        },
      });

      variantMap[prodData.id].push({
        variantId: createdVariant.id,
        productName: prodData.name,
        price: variant.price,
      });

      // Create inventory stock for each warehouse
      for (const [whCode, qty] of Object.entries(variant.stockPerWarehouse)) {
        await prisma.inventoryStock.create({
          data: {
            warehouseId: warehouseMap[whCode],
            productId: prodData.id,
            variantId: createdVariant.id,
            quantity: qty,
          },
        });
      }
    }
  }

  // ============================================================
  // 7. ORDERS
  // ============================================================
  console.log("Seeding Orders...");

  // Helper to get a variant for a product
  function getVariant(productId: string, index: number = 0) {
    const variants = variantMap[productId];
    if (!variants || variants.length === 0) throw new Error(`No variants for ${productId}`);
    return variants[index % variants.length];
  }

  // PENDING order (for AI calling demo)
  const pendingOrder = await prisma.order.create({
    data: {
      id: "order-1",
      orderNumber: "FN-847291",
      userId: "user-1",
      status: "PENDING",
      paymentStatus: "PAID",
      paymentMethod: "CARD",
      shippingAddress: {
        fullName: "Alex Mercer", street: "742 Market Street", city: "San Francisco",
        state: "CA", postalCode: "94102", country: "US", phone: "+1-555-019-2834",
      },
      billingAddress: {
        fullName: "Alex Mercer", street: "742 Market Street", city: "San Francisco",
        state: "CA", postalCode: "94102", country: "US", phone: "+1-555-019-2834",
      },
      subtotal: 24900, tax: 4482, shippingCharges: 0, discount: 0, total: 29382,
    },
  });
  const v1 = getVariant("prod-1");
  await prisma.orderItem.create({
    data: { orderId: pendingOrder.id, productId: "prod-1", variantId: v1.variantId, productName: v1.productName, sku: "SEQ-MP-BLU", price: v1.price, quantity: 1 },
  });

  // PROCESSING order
  const processingOrder = await prisma.order.create({
    data: {
      id: "order-2",
      orderNumber: "FN-938204",
      userId: "user-3",
      status: "PROCESSING",
      paymentStatus: "PAID",
      paymentMethod: "CARD",
      shippingAddress: {
        fullName: "Bruce Wayne", street: "1007 Wayne Manor", city: "Gotham",
        state: "NY", postalCode: "10027", country: "US", phone: "+1-555-999-0000",
      },
      billingAddress: {
        fullName: "Bruce Wayne", street: "1007 Wayne Manor", city: "Gotham",
        state: "NY", postalCode: "10027", country: "US", phone: "+1-555-999-0000",
      },
      subtotal: 49900, tax: 8982, shippingCharges: 0, discount: 5000, total: 53882,
    },
  });
  const v2 = getVariant("prod-2");
  await prisma.orderItem.create({
    data: { orderId: processingOrder.id, productId: "prod-2", variantId: v2.variantId, productName: v2.productName, sku: "FN-ORZ-VR-W", price: v2.price, quantity: 1 },
  });

  // SHIPPED order
  const shippedOrder = await prisma.order.create({
    data: {
      id: "order-3",
      orderNumber: "FN-726481",
      userId: "user-2",
      status: "SHIPPED",
      paymentStatus: "PENDING",
      paymentMethod: "COD",
      shippingAddress: {
        fullName: "Sarah Connor", street: "89 Lexington Ave", city: "New York",
        state: "NY", postalCode: "10016", country: "US", phone: "+1-555-014-9982",
      },
      billingAddress: {
        fullName: "Sarah Connor", street: "89 Lexington Ave", city: "New York",
        state: "NY", postalCode: "10016", country: "US", phone: "+1-555-014-9982",
      },
      subtotal: 23800, tax: 4284, shippingCharges: 0, discount: 0, total: 28084,
    },
  });
  const v3a = getVariant("prod-3");
  await prisma.orderItem.create({
    data: { orderId: shippedOrder.id, productId: "prod-3", variantId: v3a.variantId, productName: v3a.productName, sku: "AR-XB-PRO-LM", price: v3a.price, quantity: 1 },
  });
  const v3b = getVariant("prod-4");
  await prisma.orderItem.create({
    data: { orderId: shippedOrder.id, productId: "prod-4", variantId: v3b.variantId, productName: v3b.productName, sku: "APX-GK-V2", price: v3b.price, quantity: 1 },
  });

  // DELIVERED order
  const deliveredOrder = await prisma.order.create({
    data: {
      id: "order-4",
      orderNumber: "FN-665102",
      userId: "user-1",
      status: "DELIVERED",
      paymentStatus: "PAID",
      paymentMethod: "UPI",
      shippingAddress: {
        fullName: "Alex Mercer", street: "742 Market Street", city: "San Francisco",
        state: "CA", postalCode: "94102", country: "US", phone: "+1-555-019-2834",
      },
      billingAddress: {
        fullName: "Alex Mercer", street: "742 Market Street", city: "San Francisco",
        state: "CA", postalCode: "94102", country: "US", phone: "+1-555-019-2834",
      },
      subtotal: 16900, tax: 3042, shippingCharges: 0, discount: 0, total: 19942,
    },
  });
  const v4 = getVariant("prod-8");
  await prisma.orderItem.create({
    data: { orderId: deliveredOrder.id, productId: "prod-8", variantId: v4.variantId, productName: v4.productName, sku: "ZEN-HP-ANC-B", price: v4.price, quantity: 1 },
  });

  // Another PENDING order (multi-item, for AI calling)
  const pendingOrder2 = await prisma.order.create({
    data: {
      id: "order-5",
      orderNumber: "FN-551903",
      userId: "user-2",
      status: "PENDING",
      paymentStatus: "PENDING",
      paymentMethod: "COD",
      shippingAddress: {
        fullName: "Sarah Connor", street: "89 Lexington Ave", city: "New York",
        state: "NY", postalCode: "10016", country: "US", phone: "+1-555-014-9982",
      },
      billingAddress: {
        fullName: "Sarah Connor", street: "89 Lexington Ave", city: "New York",
        state: "NY", postalCode: "10016", country: "US", phone: "+1-555-014-9982",
      },
      subtotal: 26800, tax: 4824, shippingCharges: 0, discount: 0, total: 31624,
    },
  });
  const v5a = getVariant("prod-5");
  await prisma.orderItem.create({
    data: { orderId: pendingOrder2.id, productId: "prod-5", variantId: v5a.variantId, productName: v5a.productName, sku: "HRZ-SW-X-B", price: v5a.price, quantity: 1 },
  });
  const v5b = getVariant("prod-7");
  await prisma.orderItem.create({
    data: { orderId: pendingOrder2.id, productId: "prod-7", variantId: v5b.variantId, productName: v5b.productName, sku: "ONX-WPB-10", price: v5b.price, quantity: 1 },
  });

  // CANCELLED order
  const cancelledOrder = await prisma.order.create({
    data: {
      id: "order-6",
      orderNumber: "FN-332718",
      userId: "user-3",
      status: "CANCELLED",
      paymentStatus: "REFUNDED",
      paymentMethod: "CARD",
      shippingAddress: {
        fullName: "Bruce Wayne", street: "1007 Wayne Manor", city: "Gotham",
        state: "NY", postalCode: "10027", country: "US", phone: "+1-555-999-0000",
      },
      billingAddress: {
        fullName: "Bruce Wayne", street: "1007 Wayne Manor", city: "Gotham",
        state: "NY", postalCode: "10027", country: "US", phone: "+1-555-999-0000",
      },
      subtotal: 7900, tax: 1422, shippingCharges: 0, discount: 0, total: 9322,
    },
  });
  const v6 = getVariant("prod-10");
  await prisma.orderItem.create({
    data: { orderId: cancelledOrder.id, productId: "prod-10", variantId: v6.variantId, productName: v6.productName, sku: "PRM-EM-B", price: v6.price, quantity: 1 },
  });

  // Cancel reasons
  await prisma.cancelReason.create({ data: { reason: "Changed mind" } });
  await prisma.cancelReason.create({ data: { reason: "Found cheaper elsewhere" } });
  await prisma.cancelReason.create({ data: { reason: "Product not needed" } });
  await prisma.cancelReason.create({ data: { reason: "Ordered by mistake" } });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
