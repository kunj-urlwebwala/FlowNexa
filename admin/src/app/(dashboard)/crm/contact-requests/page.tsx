"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: string;
}

export default function ContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([
    { id: "REQ-78", name: "Bruce Wayne", email: "bruce@wayne.com", subject: "Refund query on order #FN-938204", message: "Hey, I need a refund on my VR headset, it arrived in the wrong color. Pls respond.", date: "45 mins ago", status: "New" },
    { id: "REQ-77", name: "Clark Kent", email: "clark@kent.com", subject: "Bulk procurement query", message: "Hi! We are looking to buy 50 earbuds for our Daily Planet staff. Do you offer corporate pricing?", date: "June 28, 2026", status: "Resolved" },
  ]);

  const [activeReq, setActiveReq] = useState<ContactRequest | null>(null);
  const [replyText, setReplyText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenReply = (req: ContactRequest) => {
    setActiveReq(req);
    setReplyText("");
    setDialogOpen(true);
  };

  const handleSendReply = () => {
    if (!activeReq || !replyText) return;
    setRequests(
      requests.map((r) => (r.id === activeReq.id ? { ...r, status: "Resolved" } : r))
    );
    toast.success("Response Dispatched", {
      description: `Emailed resolution to ${activeReq.email} successfully.`,
    });
    setDialogOpen(false);
  };

  const columns: Column<ContactRequest>[] = [
    {
      header: "Req ID",
      accessorKey: "id",
      cell: (row) => <span className="font-bold text-white text-xs">{row.id}</span>,
    },
    {
      header: "Client Name",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-white text-xs">{row.name}</span>
          <span className="text-[9px] text-muted-foreground">{row.email}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Message Subject",
      accessorKey: "subject",
      cell: (row) => <span className="text-xs text-white truncate max-w-[150px]">{row.subject}</span>,
    },
    {
      header: "Message Body",
      accessorKey: "message",
      cell: (row) => <span className="text-xs text-muted-foreground line-clamp-1">{row.message}</span>,
    },
    {
      header: "Date Received",
      accessorKey: "date",
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
          {row.status === "New" ? (
            <Button
              variant="outline"
              size="xs"
              onClick={() => handleOpenReply(row)}
              className="h-8 rounded-lg border-white/5 bg-[#1A1D26] text-emerald-400 hover:bg-[#242836] hover:text-emerald-355 text-xs px-3 cursor-pointer"
            >
              Reply & Resolve
            </Button>
          ) : (
            <span className="text-[10px] text-muted-foreground font-bold px-3 py-1">Replied</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Contact Us Support Tickets</h1>
          <p className="text-xs text-muted-foreground">Monitor and respond to client help requests submitted via storefront forms.</p>
        </div>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={requests} columns={columns} searchKey="name" searchPlaceholder="Search submissions by client name..." />
      </div>

      {activeReq && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
            <DialogHeader className="text-left">
              <DialogTitle className="text-white text-base font-bold font-heading">
                Respond to Support Query
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1.5">
                Client {activeReq.name} wrote: <em className="text-white block mt-1.5 border-l-2 border-flownexa-lime pl-2.5 bg-white/2 py-2 rounded-r-xl">“{activeReq.message}”</em>
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-1.5 mt-4 text-left">
              <Label htmlFor="replyText" className="text-xs font-semibold text-white">Resolution E-mail Body</Label>
              <Textarea
                id="replyText"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your response message here. Clicking Send will mail it to the customer..."
                className="bg-[#1A1D26] border-white/5 text-xs h-28"
              />
            </div>

            <DialogFooter className="flex gap-2 mt-6">
              <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">
                Discard
              </Button>
              <Button size="sm" onClick={handleSendReply} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">
                Dispatch Email Response
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
