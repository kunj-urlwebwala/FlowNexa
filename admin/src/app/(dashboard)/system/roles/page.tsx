"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield } from "lucide-react";

interface PermissionRecord {
  id: string;
  moduleName: string;
  superAdmin: boolean;
  warehouseManager: boolean;
  supportStaff: boolean;
}

export default function RolesPermissionsPage() {
  const [permissions] = useState<PermissionRecord[]>([
    { id: "perm-1", moduleName: "Catalog & Products (CRUD)", superAdmin: true, warehouseManager: true, supportStaff: false },
    { id: "perm-2", moduleName: "Order Fulfillment (Dispatch)", superAdmin: true, warehouseManager: true, supportStaff: true },
    { id: "perm-3", moduleName: "Financial Accounts & Wallets", superAdmin: true, warehouseManager: false, supportStaff: false },
    { id: "perm-4", moduleName: "AI Call trigger & transcript review", superAdmin: true, warehouseManager: false, supportStaff: true },
    { id: "perm-5", moduleName: "System Backups & Backdoor API config", superAdmin: true, warehouseManager: false, supportStaff: false },
  ]);

  const columns: Column<PermissionRecord>[] = [
    {
      header: "Operation Module",
      accessorKey: "moduleName",
      cell: (row) => <span className="font-bold text-white text-xs">{row.moduleName}</span>,
      sortable: true,
    },
    {
      header: "Super Admin",
      accessorKey: "superAdmin",
      cell: (row) => (
        <div className="flex items-center justify-center">
          <Checkbox checked={row.superAdmin} disabled className="border-white/20 data-[state=checked]:bg-flownexa-lime data-[state=checked]:text-flownexa-black opacity-80" />
        </div>
      ),
    },
    {
      header: "Warehouse Manager",
      accessorKey: "warehouseManager",
      cell: (row) => (
        <div className="flex items-center justify-center">
          <Checkbox checked={row.warehouseManager} disabled className="border-white/20 data-[state=checked]:bg-white/10 opacity-40" />
        </div>
      ),
    },
    {
      header: "Support Staff",
      accessorKey: "supportStaff",
      cell: (row) => (
        <div className="flex items-center justify-center">
          <Checkbox checked={row.supportStaff} disabled className="border-white/20 data-[state=checked]:bg-white/10 opacity-40" />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Shield size={24} className="text-flownexa-lime" />
            Roles & Operations Matrix
          </h1>
          <p className="text-xs text-muted-foreground">Monitor system access lists and verify functional module permissions.</p>
        </div>
        <span className="text-[9px] bg-flownexa-lime-muted border border-flownexa-lime/20 text-flownexa-lime font-extrabold px-2.5 py-0.5 rounded-full uppercase">
          🔒 RBAC Matrix Locked
        </span>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-6 rounded-3xl flex flex-col gap-4">
        <h3 className="font-heading font-bold text-sm text-white">Functional Access List</h3>
        <DataTable data={permissions} columns={columns} searchKey="moduleName" searchPlaceholder="Search modules..." />
      </div>
    </div>
  );
}
