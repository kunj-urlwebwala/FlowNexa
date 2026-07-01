export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  ordersCount: number;
  joinedDate: string;
  addresses?: {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
  }[];
  recentActivities?: {
    action: string;
    timestamp: string;
  }[];
}

export const mockUsers: UserRecord[] = [
  {
    id: "usr-1",
    name: "Alex Mercer",
    email: "alex@mercer.com",
    role: "Customer",
    status: "Active",
    ordersCount: 8,
    joinedDate: "Jan 12, 2026",
    addresses: [
      {
        fullName: "Alex Mercer",
        phone: "+1 (555) 019-2834",
        addressLine1: "128 Innovation Way, Suite 400",
        city: "San Francisco",
        state: "CA",
        zipCode: "94107",
        country: "United States",
        isDefault: true,
      },
    ],
    recentActivities: [
      { action: "Placed order #FN-847291", timestamp: "2 mins ago" },
      { action: "Added Sequoia Headphones to wishlist", timestamp: "1 hour ago" },
      { action: "Logged in via Mobile app", timestamp: "1 day ago" },
    ],
  },
  {
    id: "usr-2",
    name: "Sarah Connor",
    email: "sarah@connor.com",
    role: "Customer",
    status: "Active",
    ordersCount: 4,
    joinedDate: "Feb 18, 2026",
    addresses: [
      {
        fullName: "Sarah Connor",
        phone: "+1 (555) 014-9982",
        addressLine1: "542 Tech Blvd",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
        country: "United States",
        isDefault: true,
      },
    ],
    recentActivities: [
      { action: "Placed order #FN-726481", timestamp: "1 hour ago" },
      { action: "Submitted support request regarding return", timestamp: "12 hours ago" },
    ],
  },
  {
    id: "usr-3",
    name: "Bruce Wayne",
    email: "bruce@wayne.com",
    role: "Customer",
    status: "Active",
    ordersCount: 12,
    joinedDate: "Dec 05, 2025",
    addresses: [
      {
        fullName: "Bruce Wayne",
        phone: "+1 (555) 999-0000",
        addressLine1: "1007 Mountain Drive",
        city: "Gotham City",
        state: "NJ",
        zipCode: "07001",
        country: "United States",
        isDefault: true,
      },
    ],
    recentActivities: [
      { action: "Placed order #FN-938204", timestamp: "3 hours ago" },
      { action: "Updated primary shipping address", timestamp: "2 days ago" },
    ],
  },
  {
    id: "usr-4",
    name: "Johnathan Doe",
    email: "john@doe.com",
    role: "Customer",
    status: "Inactive",
    ordersCount: 0,
    joinedDate: "Mar 10, 2026",
    addresses: [],
    recentActivities: [
      { action: "Registered account", timestamp: "2 days ago" },
    ],
  },
  {
    id: "usr-5",
    name: "Administrator Staff",
    email: "admin@flownexa.com",
    role: "Super Admin",
    status: "Active",
    ordersCount: 0,
    joinedDate: "Nov 01, 2025",
    addresses: [],
    recentActivities: [
      { action: "Modified product Orizon VR metadata", timestamp: "10 mins ago" },
      { action: "Resolved support ticket #78", timestamp: "45 mins ago" },
    ],
  },
];
