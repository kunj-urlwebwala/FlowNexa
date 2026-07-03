"use client";

import React, { useState } from "react";
import KanbanBoard, { KanbanCard } from "@/components/shared/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LeadsPipelinePage() {
  const router = useRouter();
  
  const columns = [
    { id: "new", title: "New Leads", color: "bg-blue-400" },
    { id: "contacted", title: "Contacted", color: "bg-amber-400" },
    { id: "qualified", title: "Qualified", color: "bg-purple-400" },
    { id: "proposal", title: "Proposal Sent", color: "bg-indigo-400" },
    { id: "won", title: "Closed Won", color: "bg-emerald-400" },
  ];

  const initialLeads: KanbanCard[] = [
    {
      id: "lead-1",
      title: "Google LLC Procurement",
      subtitle: "Enterprise headphone bulk contract",
      meta: { phone: "+1 (555) 902-8401", email: "google-procure@google.com", date: "June 28" },
      status: "new",
    },
    {
      id: "lead-2",
      title: "Stripe Tech Ops",
      subtitle: "VR headsets for global onboarding",
      meta: { phone: "+1 (555) 109-8472", email: "onboard@stripe.com", date: "June 25" },
      status: "qualified",
    },
    {
      id: "lead-3",
      title: "Meta Hardware Labs",
      subtitle: "Acoustic driver custom evaluation",
      meta: { phone: "+1 (555) 993-2910", email: "lab-procure@meta.com", date: "June 22" },
      status: "proposal",
    },
  ];

  const [leads, setLeads] = useState<KanbanCard[]>(initialLeads);
  const [boardKey, setBoardKey] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDate, setNewDate] = useState("");

  const handleCardClick = (card: KanbanCard) => {
    router.push(`/crm/leads/${card.id}`);
  };

  const handleAddCard = () => {
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Leads Deal Flow</h1>
          <p className="text-xs text-muted-foreground">Manage enterprise B2B sales pipelines and drag-and-drop cards to update status.</p>
        </div>
        <Button
          onClick={() => handleAddCard()}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <Plus size={16} />
          Add B2B Lead
        </Button>
      </div>

      {/* Kanban Board Container */}
      <div className="bg-flownexa-surface/40 p-4 border border-white/5 rounded-3xl overflow-x-auto">
        <KanbanBoard
          key={boardKey}
          initialCards={leads}
          columns={columns}
          onCardClick={handleCardClick}
          onAddCard={handleAddCard}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <DialogHeader className="text-left">
            <DialogTitle className="text-white text-base font-bold font-heading">Add B2B Lead</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">Create a new lead card in the pipeline.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title" className="text-xs font-semibold text-white">Title</Label>
              <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="subtitle" className="text-xs font-semibold text-white">Subtitle</Label>
              <Input id="subtitle" value={newSubtitle} onChange={(e) => setNewSubtitle(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold text-white">Phone</Label>
              <Input id="phone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-white">Email</Label>
              <Input id="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date" className="text-xs font-semibold text-white">Date</Label>
              <Input id="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">Cancel</Button>
            <Button size="sm" onClick={() => { setLeads([...leads, { id: "lead-" + Date.now(), title: newTitle, subtitle: newSubtitle, meta: { phone: newPhone, email: newEmail, date: newDate }, status: "new" }]); setBoardKey((k) => k + 1); setDialogOpen(false); toast.success("B2B lead created successfully"); }} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">Add B2B Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
