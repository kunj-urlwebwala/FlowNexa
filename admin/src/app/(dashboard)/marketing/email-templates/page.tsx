"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TemplateRecord {
  id: string;
  name: string;
  subject: string;
  triggerEvent: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<TemplateRecord[]>([
    { id: "TMP-01", name: "Welcome Onboarding Email", subject: "Welcome to FlowNexa acoustics!", triggerEvent: "Customer Account Registration" },
    { id: "TMP-02", name: "Order Fulfill Dispatch Confirmation", subject: "Your order #{{order_id}} has shipped!", triggerEvent: "Order Status Shipped" },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newTriggerEvent, setNewTriggerEvent] = useState("");

  const columns: Column<TemplateRecord>[] = [
    {
      header: "Template Name",
      accessorKey: "name",
      cell: (row) => <span className="font-bold text-white text-xs">{row.name}</span>,
      sortable: true,
    },
    {
      header: "Email Subject Header",
      accessorKey: "subject",
      cell: (row) => <span className="text-xs text-white truncate max-w-[200px] block">{row.subject}</span>,
    },
    {
      header: "System Trigger Event",
      accessorKey: "triggerEvent",
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
            onClick={() => toast.info(`Editing template: ${row.name}`)}
            className="h-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] text-xs px-3.5 cursor-pointer"
          >
            <Edit3 size={12} className="mr-1.5" />
            Edit Template
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Email Notification Templates</h1>
          <p className="text-xs text-muted-foreground">Configure automated email triggers and transactional subject headings.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <Plus size={16} />
          Create Template
        </Button>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={templates} columns={columns} searchKey="name" searchPlaceholder="Search templates..." />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <DialogHeader className="text-left">
            <DialogTitle className="text-white text-base font-bold font-heading">Create Template</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">Add a new email notification template.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-white">Name</Label>
              <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="subject" className="text-xs font-semibold text-white">Subject</Label>
              <Input id="subject" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="triggerEvent" className="text-xs font-semibold text-white">Trigger Event</Label>
              <Input id="triggerEvent" value={newTriggerEvent} onChange={(e) => setNewTriggerEvent(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">Cancel</Button>
            <Button size="sm" onClick={() => { setTemplates([...templates, { id: "tmp-" + Date.now(), name: newName, subject: newSubject, triggerEvent: newTriggerEvent }]); setDialogOpen(false); toast.success("Template created successfully"); }} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
