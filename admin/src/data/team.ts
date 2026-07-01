export interface TeamMember {
  id: string;
  username: string;
  email: string;
  designation: string;
  role: "Super Admin" | "Management Team" | "Warehouse Management" | "Support Staff" | "Order Management" | "AI Engineer";
  status: "Active" | "Inactive";
  lastLogin: string;
  addedBy: string;
}

export const teamRoles = [
  "Super Admin",
  "Management Team",
  "Warehouse Management",
  "Support Staff",
  "Order Management",
  "AI Engineer",
] as const;

export const mockTeamMembers: TeamMember[] = [
  { id: "tm-1", username: "alex.mercer", email: "alex@flownexa.com", designation: "System Architect", role: "Super Admin", status: "Active", lastLogin: "Just now", addedBy: "System" },
  { id: "tm-2", username: "jane.smith", email: "jane@flownexa.com", designation: "Operations Lead", role: "Management Team", status: "Active", lastLogin: "2 hours ago", addedBy: "Alex Mercer" },
  { id: "tm-3", username: "mike.ross", email: "mike@flownexa.com", designation: "Warehouse Supervisor", role: "Warehouse Management", status: "Active", lastLogin: "1 day ago", addedBy: "Jane Smith" },
  { id: "tm-4", username: "emma.wilson", email: "emma@flownexa.com", designation: "Customer Support Lead", role: "Support Staff", status: "Active", lastLogin: "3 hours ago", addedBy: "Jane Smith" },
  { id: "tm-5", username: "liam.chen", email: "liam@flownexa.com", designation: "Order Fulfillment Manager", role: "Order Management", status: "Active", lastLogin: "5 hours ago", addedBy: "Alex Mercer" },
  { id: "tm-6", username: "sara.khan", email: "sara@flownexa.com", designation: "AI Research Engineer", role: "AI Engineer", status: "Inactive", lastLogin: "2 weeks ago", addedBy: "Alex Mercer" },
];
