"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuditRecord {
  id: string;
  title: string;
  warehouse: string;
  scheduledDate: string;
  inspector: string;
  status: string;
}

export default function StockAuditPage() {
  const [audits, setAudits] = useState<AuditRecord[]>([
    { id: "AUD-01", title: "Quarterly Audio Electronics Check", warehouse: "SF Logistics", scheduledDate: "June 25, 2026", inspector: "Alex Mercer", status: "Resolved" },
    { id: "AUD-02", title: "Mid-Term Wearables Assessment", warehouse: "NY East Hub", scheduledDate: "July 12, 2026", inspector: "System Diagnostics", status: "Pending" },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newWarehouse, setNewWarehouse] = useState("SF Logistics Center");
  const [newInspector, setNewInspector] = useState("");
  const [newScheduledDate, setNewScheduledDate] = useState("");

  const columns: Column<AuditRecord>[] = [
    {
      header: "Audit Code",
      accessorKey: "id",
      cell: (row) => <span className="font-bold text-white text-xs">{row.id}</span>,
    },
    {
      header: "Assessment Name",
      accessorKey: "title",
      cell: (row) => <span className="text-xs text-white">{row.title}</span>,
      sortable: true,
    },
    {
      header: "Warehouse",
      accessorKey: "warehouse",
      sortable: true,
    },
    {
      header: "Inspector Name",
      accessorKey: "inspector",
      sortable: true,
    },
    {
      header: "Scheduled Date",
      accessorKey: "scheduledDate",
      sortable: true,
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
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                setAudits(audits.map((a) => a.id === row.id ? { ...a, status: "Resolved" } : a));
                toast.success("Audit Completed Successfully!");
              }}
              className="h-8 rounded-lg border-white/5 bg-[#1A1D26] text-emerald-400 hover:bg-[#242836] hover:text-emerald-355 text-xs px-3 cursor-pointer"
            >
              Mark Completed
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Stock Audits Schedules</h1>
          <p className="text-xs text-muted-foreground">Schedule physical bin checks and verify counts vs databases.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <Plus size={16} />
          Create Audit Run
        </Button>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={audits} columns={columns} searchKey="title" searchPlaceholder="Search audit runs..." />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <DialogHeader className="text-left">
            <DialogTitle className="text-white text-base font-bold font-heading">New Audit Run</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">Schedule a new stock audit inspection.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title" className="text-xs font-semibold text-white">Title</Label>
              <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
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
              <Label htmlFor="inspector" className="text-xs font-semibold text-white">Inspector</Label>
              <Input id="inspector" value={newInspector} onChange={(e) => setNewInspector(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scheduledDate" className="text-xs font-semibold text-white">Scheduled Date</Label>
              <Input id="scheduledDate" value={newScheduledDate} onChange={(e) => setNewScheduledDate(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">Cancel</Button>
            <Button size="sm" onClick={() => { setAudits([...audits, { id: "aud-" + Date.now(), title: newTitle, warehouse: newWarehouse, inspector: newInspector, scheduledDate: newScheduledDate, status: "Pending" }]); setDialogOpen(false); toast.success("Audit created successfully"); }} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">Create Audit Run</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
