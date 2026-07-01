"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/shared/StatusBadge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CouponRecord {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrder: number;
  status: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponRecord[]>([
    { id: "CPN-01", code: "FLOWNEXA10", discountType: "Percentage Discount", discountValue: 10, minOrder: 50, status: "Active" },
    { id: "CPN-02", code: "ACOUSTIC100", discountType: "Flat Value Off", discountValue: 100, minOrder: 500, status: "Active" },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newDiscountType, setNewDiscountType] = useState("Percentage Discount");
  const [newDiscountValue, setNewDiscountValue] = useState(0);
  const [newMinOrder, setNewMinOrder] = useState(0);
  const [newStatus, setNewStatus] = useState("Active");

  const columns: Column<CouponRecord>[] = [
    {
      header: "Promo Code",
      accessorKey: "code",
      cell: (row) => <span className="font-bold text-white text-xs">{row.code}</span>,
      sortable: true,
    },
    {
      header: "Discount Bracket",
      accessorKey: "discountType",
      cell: (row) => (
        <span className="text-xs text-white">
          {row.discountValue}{row.discountType.includes("Percentage") ? "%" : "$"} Off
        </span>
      ),
      sortable: true,
    },
    {
      header: "Minimum Order Amount",
      accessorKey: "minOrder",
      cell: (row) => <span className="text-xs text-muted-foreground">${row.minOrder} Min</span>,
      sortable: true,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
      sortable: true,
    },
    {
      header: "Controls",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex gap-1.5 justify-end">
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              setCoupons(coupons.filter((c) => c.id !== row.id));
              toast.success("Coupon code deleted");
            }}
            className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer"
          >
            <Trash2 size={12} className="text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Coupons & Promo Codes</h1>
          <p className="text-xs text-muted-foreground">Manage active discount structures, campaigns, and thresholds.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <Plus size={16} />
          Create Coupon
        </Button>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={coupons} columns={columns} searchKey="code" searchPlaceholder="Search codes..." />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <DialogHeader className="text-left">
            <DialogTitle className="text-white text-base font-bold font-heading">Create Coupon</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">Add a new promotional coupon code.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="code" className="text-xs font-semibold text-white">Code</Label>
              <Input id="code" value={newCode} onChange={(e) => setNewCode(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="discountType" className="text-xs font-semibold text-white">Discount Type</Label>
              <select id="discountType" value={newDiscountType} onChange={(e) => setNewDiscountType(e.target.value)} className="bg-[#1A1D26] border border-white/5 text-xs text-white rounded-lg h-10 px-3 focus:outline-none">
                <option value="Percentage Discount">Percentage Discount</option>
                <option value="Flat Value Off">Flat Value Off</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="discountValue" className="text-xs font-semibold text-white">Discount Value</Label>
              <Input id="discountValue" type="number" value={newDiscountValue} onChange={(e) => setNewDiscountValue(Number(e.target.value))} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="minOrder" className="text-xs font-semibold text-white">Min Order ($)</Label>
              <Input id="minOrder" type="number" value={newMinOrder} onChange={(e) => setNewMinOrder(Number(e.target.value))} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status" className="text-xs font-semibold text-white">Status</Label>
              <select id="status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="bg-[#1A1D26] border border-white/5 text-xs text-white rounded-lg h-10 px-3 focus:outline-none">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">Cancel</Button>
            <Button size="sm" onClick={() => { setCoupons([...coupons, { id: "cpn-" + Date.now(), code: newCode, discountType: newDiscountType, discountValue: newDiscountValue, minOrder: newMinOrder, status: newStatus }]); setDialogOpen(false); toast.success("Coupon created successfully"); }} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">Create Coupon</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
