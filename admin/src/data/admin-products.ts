export interface AdminProductRecord {
  id: string;
  name: string;
  sku: string;
  costPrice: number;
  price: number; // selling price
  originalPrice?: number;
  category: string;
  subCategory: string;
  brand: string;
  image: string;
  variants: {
    color?: string;
    size?: string;
    stock: number;
  }[];
  visibility: "Visible" | "Hidden" | "Draft";
  taxRate: number; // percentage (e.g., 18 for GST)
  createdDate: string;
  stock: number;
  minStock: number;
  maxStock: number;
  monthlySold: number;
  status: "Active" | "Draft" | "Out of Stock";
  warehouse: string;
}

export const mockAdminProducts: AdminProductRecord[] = [
  {
    id: "prod-1",
    name: "Sequoia Inspiring Musico Pro",
    sku: "SEQ-AUD-HP-01",
    costPrice: 120,
    price: 299,
    originalPrice: 399,
    category: "Audio & Acoustics",
    subCategory: "Headphones",
    brand: "Sequoia",
    image: "/images/products/headphones.png",
    variants: [
      { color: "Royal Blue", stock: 15 },
      { color: "Dark Charcoal", stock: 20 },
    ],
    visibility: "Visible",
    taxRate: 18,
    createdDate: "Jan 15, 2026",
    stock: 35,
    minStock: 10,
    maxStock: 100,
    monthlySold: 128,
    status: "Active",
    warehouse: "SF Logistics Center",
  },
  {
    id: "prod-2",
    name: "FlowNexa Orizon VR Headset",
    sku: "FN-ELC-VR-02",
    costPrice: 280,
    price: 599,
    originalPrice: 799,
    category: "Premium Devices",
    subCategory: "Virtual Reality",
    brand: "FlowNexa",
    image: "/images/products/vr-headset.png",
    variants: [
      { color: "Glacier White", stock: 8 },
      { color: "Obsidian Black", stock: 12 },
    ],
    visibility: "Visible",
    taxRate: 18,
    createdDate: "Feb 02, 2026",
    stock: 20,
    minStock: 5,
    maxStock: 50,
    monthlySold: 94,
    status: "Active",
    warehouse: "SF Logistics Center",
  },
  {
    id: "prod-3",
    name: "X-Buds Pro Wireless",
    sku: "FN-AUD-XB-03",
    costPrice: 45,
    price: 149,
    originalPrice: 199,
    category: "Audio & Acoustics",
    subCategory: "Earbuds",
    brand: "FlowNexa",
    image: "/images/products/earbuds.png",
    variants: [
      { color: "Neon Lime", stock: 45 },
      { color: "Charcoal Black", stock: 35 },
    ],
    visibility: "Visible",
    taxRate: 18,
    createdDate: "Feb 22, 2026",
    stock: 80,
    minStock: 15,
    maxStock: 150,
    monthlySold: 86,
    status: "Active",
    warehouse: "NY East Hub",
  },
  {
    id: "prod-4",
    name: "MagSafe Stand",
    sku: "ACC-MGS-ST-04",
    costPrice: 15,
    price: 39,
    originalPrice: 49,
    category: "Tech Accessories",
    subCategory: "Chargers",
    brand: "FlowNexa",
    image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=100&auto=format&fit=crop&q=80",
    variants: [
      { color: "Space Gray", stock: 4 },
    ],
    visibility: "Visible",
    taxRate: 12,
    createdDate: "Mar 05, 2026",
    stock: 4,
    minStock: 10,
    maxStock: 60,
    monthlySold: 22,
    status: "Out of Stock", // stock < minStock trigger
    warehouse: "SF Logistics Center",
  },
  {
    id: "prod-5",
    name: "Mechanical Keyboard",
    sku: "FN-ACC-KB-05",
    costPrice: 75,
    price: 189,
    category: "Tech Accessories",
    subCategory: "Keyboards",
    brand: "FlowNexa",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&auto=format&fit=crop&q=80",
    variants: [
      { color: "Lime Swapped", stock: 12 },
    ],
    visibility: "Draft",
    taxRate: 18,
    createdDate: "Mar 28, 2026",
    stock: 12,
    minStock: 5,
    maxStock: 40,
    monthlySold: 0,
    status: "Draft",
    warehouse: "Chicago Midwest",
  },
];
