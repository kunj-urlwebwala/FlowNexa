"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Eye, MapPin } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WarehouseRecord {
  id: string;
  name: string;
  location: string;
  capacity: number;
  totalStock: number;
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<WarehouseRecord[]>([
    { id: "wh-1", name: "SF Logistics Center", location: "San Francisco, CA", capacity: 85, totalStock: 8200 },
    { id: "wh-2", name: "NY East Hub", location: "New York, NY", capacity: 48, totalStock: 3100 },
    { id: "wh-3", name: "Chicago Midwest", location: "Chicago, IL", capacity: 32, totalStock: 1150 },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newCapacity, setNewCapacity] = useState(0);
  const [newTotalStock, setNewTotalStock] = useState(0);

  const columns: Column<WarehouseRecord>[] = [
    {
      header: "Warehouse Name",
      accessorKey: "name",
      cell: (row) => <span className="font-bold text-white text-xs">{row.name}</span>,
      sortable: true,
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: (row) => (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin size={12} className="text-flownexa-lime" />
          {row.location}
        </span>
      ),
      sortable: true,
    },
    {
      header: "Capacity Filled",
      accessorKey: "capacity",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="font-bold text-xs">{row.capacity}%</span>
          {/* Spark progress */}
          <div className="w-20 bg-white/5 h-1.5 rounded-full overflow-hidden flex">
            <div className="bg-flownexa-lime h-full rounded-full" style={{ width: `${row.capacity}%` }} />
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Total Units Stored",
      accessorKey: "totalStock",
      cell: (row) => <span className="font-bold text-xs">{row.totalStock.toLocaleString()} Units</span>,
      sortable: true,
    },
    {
      header: "Controls",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex gap-1.5 justify-end">
          <Link href={`/warehouses/${row.id}`}>
            <Button
              variant="outline"
              size="xs"
              className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer"
              title="View Bin Allocations"
            >
              <Eye size={12} className="text-white" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Warehousing Nodes</h1>
          <p className="text-xs text-muted-foreground">Manage distribution points and monitor warehouse cubic capacity.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <Plus size={16} />
          Create Warehouse
        </Button>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={warehouses} columns={columns} searchKey="name" searchPlaceholder="Search warehouses..." />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <DialogHeader className="text-left">
            <DialogTitle className="text-white text-base font-bold font-heading">Create Warehouse</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">Add a new warehouse distribution node.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-white">Name</Label>
              <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location" className="text-xs font-semibold text-white">Location</Label>
              <Input id="location" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="capacity" className="text-xs font-semibold text-white">Capacity (%)</Label>
              <Input id="capacity" type="number" value={newCapacity} onChange={(e) => setNewCapacity(Number(e.target.value))} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="totalStock" className="text-xs font-semibold text-white">Total Stock</Label>
              <Input id="totalStock" type="number" value={newTotalStock} onChange={(e) => setNewTotalStock(Number(e.target.value))} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">Cancel</Button>
            <Button size="sm" onClick={() => { setWarehouses([...warehouses, { id: "wh-" + Date.now(), name: newName, location: newLocation, capacity: newCapacity, totalStock: newTotalStock }]); setDialogOpen(false); toast.success("Warehouse created successfully"); }} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">Create Warehouse</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
