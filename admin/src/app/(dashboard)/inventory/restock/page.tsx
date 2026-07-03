"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RestockRecord {
  id: string;
  productName: string;
  qty: number;
  warehouse: string;
  urgency: string;
  status: string;
}

export default function RestockRequestsPage() {
  const [requests, setRequests] = useState<RestockRecord[]>([
    { id: "RST-902", productName: "MagSafe Stand", qty: 50, warehouse: "SF Logistics Center", urgency: "High", status: "Pending" },
    { id: "RST-901", productName: "USB-C Hub", qty: 100, warehouse: "NY East Hub", urgency: "Medium", status: "Approved" },
    { id: "RST-900", productName: "Flow Power Bank", qty: 80, warehouse: "Chicago Midwest", urgency: "High", status: "Pending" },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newQty, setNewQty] = useState(0);
  const [newWarehouse, setNewWarehouse] = useState("SF Logistics Center");
  const [newUrgency, setNewUrgency] = useState("Medium");

  const columns: Column<RestockRecord>[] = [
    {
      header: "Request ID",
      accessorKey: "id",
      cell: (row) => <span className="font-bold text-white text-xs">{row.id}</span>,
    },
    {
      header: "Product Requested",
      accessorKey: "productName",
      cell: (row) => <span className="text-xs text-white">{row.productName}</span>,
      sortable: true,
    },
    {
      header: "Restock Qty",
      accessorKey: "qty",
      cell: (row) => <span className="font-bold text-xs">{row.qty} Units</span>,
      sortable: true,
    },
    {
      header: "Target Warehouse",
      accessorKey: "warehouse",
      sortable: true,
    },
    {
      header: "Urgency Rating",
      accessorKey: "urgency",
      cell: (row) => (
        <span className={`font-bold text-[10px] ${row.urgency === "High" ? "text-red-400" : "text-amber-400"}`}>
          {row.urgency} Priority
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Controls",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex gap-1.5 justify-end">
          {row.status === "Pending" && (
            <>
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  setRequests(requests.map((r) => r.id === row.id ? { ...r, status: "Approved" } : r));
                  toast.success("Purchase Order Approved", { description: `Dispatched PO to supplier for ${row.qty} units.` });
                }}
                className="h-8 rounded-lg border-white/5 bg-[#1A1D26] text-emerald-400 hover:bg-[#242836] hover:text-emerald-355 text-xs px-3.5 cursor-pointer"
              >
                Approve PO
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  setRequests(requests.map((r) => r.id === row.id ? { ...r, status: "Rejected" } : r));
                  toast.error("Restock Request Declined");
                }}
                className="h-8 rounded-lg border-white/5 bg-[#1A1D26] text-red-400 hover:bg-[#242836] hover:text-red-355 text-xs px-3.5 cursor-pointer"
              >
                Decline
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Restock Approval Queue</h1>
          <p className="text-xs text-muted-foreground">Approve supply chain purchase orders (POs) and manage incoming inventory items.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <Plus size={16} />
          Manual Request
        </Button>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={requests} columns={columns} searchKey="productName" searchPlaceholder="Search restock requests..." />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <DialogHeader className="text-left">
            <DialogTitle className="text-white text-base font-bold font-heading">Manual Restock Request</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">Submit a new purchase order request for restock.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="productName" className="text-xs font-semibold text-white">Product Name</Label>
              <Input id="productName" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="qty" className="text-xs font-semibold text-white">Quantity</Label>
              <Input id="qty" type="number" value={newQty} onChange={(e) => setNewQty(Number(e.target.value))} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="warehouse" className="text-xs font-semibold text-white">Warehouse</Label>
              <select id="warehouse" value={newWarehouse} onChange={(e) => setNewWarehouse(e.target.value)} className="bg-[#1A1D26] border border-white/5 text-xs text-white rounded-lg h-10 px-3 focus:outline-none">
                <option value="SF Logistics Center">SF Logistics Center</option>
                <option value="NY East Hub">NY East Hub</option>
                <option value="Chicago Midwest">Chicago Midwest</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="urgency" className="text-xs font-semibold text-white">Urgency</Label>
              <select id="urgency" value={newUrgency} onChange={(e) => setNewUrgency(e.target.value)} className="bg-[#1A1D26] border border-white/5 text-xs text-white rounded-lg h-10 px-3 focus:outline-none">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">Cancel</Button>
            <Button size="sm" onClick={() => { setRequests([...requests, { id: "rst-" + Date.now(), productName: newProductName, qty: newQty, warehouse: newWarehouse, urgency: newUrgency, status: "Pending" }]); setDialogOpen(false); toast.success("Restock request created"); }} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">Manual Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
