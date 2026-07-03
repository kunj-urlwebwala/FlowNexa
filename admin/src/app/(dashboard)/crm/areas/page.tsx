"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AreaRecord {
  id: string;
  regionName: string;
  country: string;
  leadCount: number;
}

export default function AreasPage() {
  const [areas, setAreas] = useState<AreaRecord[]>([
    { id: "AR-01", regionName: "California West Coast", country: "United States", leadCount: 14 },
    { id: "AR-02", regionName: "New York Tri-State", country: "United States", leadCount: 8 },
    { id: "AR-03", regionName: "London Corporate", country: "United Kingdom", leadCount: 5 },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRegionName, setNewRegionName] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newLeadCount, setNewLeadCount] = useState(0);

  const columns: Column<AreaRecord>[] = [
    {
      header: "Area Code",
      accessorKey: "id",
      cell: (row) => <span className="font-bold text-white text-xs">{row.id}</span>,
    },
    {
      header: "Sales Region",
      accessorKey: "regionName",
      cell: (row) => (
        <span className="font-bold text-white text-xs flex items-center gap-1.5">
          <MapPin size={12} className="text-flownexa-lime" />
          {row.regionName}
        </span>
      ),
      sortable: true,
    },
    {
      header: "Country Node",
      accessorKey: "country",
      sortable: true,
    },
    {
      header: "Deals Count",
      accessorKey: "leadCount",
      cell: (row) => <span className="font-bold text-xs">{row.leadCount} Active</span>,
      sortable: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Geographic Sales Territories</h1>
          <p className="text-xs text-muted-foreground">Assign operators to geographical areas and track client distribution density.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <Plus size={16} />
          Create Territory
        </Button>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={areas} columns={columns} searchKey="regionName" searchPlaceholder="Search regions..." />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <DialogHeader className="text-left">
            <DialogTitle className="text-white text-base font-bold font-heading">Create Territory</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">Add a new geographic sales territory.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="regionName" className="text-xs font-semibold text-white">Region Name</Label>
              <Input id="regionName" value={newRegionName} onChange={(e) => setNewRegionName(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="country" className="text-xs font-semibold text-white">Country</Label>
              <Input id="country" value={newCountry} onChange={(e) => setNewCountry(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="leadCount" className="text-xs font-semibold text-white">Lead Count</Label>
              <Input id="leadCount" type="number" value={newLeadCount} onChange={(e) => setNewLeadCount(Number(e.target.value))} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">Cancel</Button>
            <Button size="sm" onClick={() => { setAreas([...areas, { id: "ar-" + Date.now(), regionName: newRegionName, country: newCountry, leadCount: newLeadCount }]); setDialogOpen(false); toast.success("Territory created successfully"); }} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">Create Territory</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
