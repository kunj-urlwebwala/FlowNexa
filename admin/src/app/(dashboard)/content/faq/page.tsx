"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FAQRecord {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQSetupPage() {
  const [faqs, setFaqs] = useState<FAQRecord[]>([
    { id: "FAQ-01", question: "How long does shipping take?", answer: "Express takes 1-2 business days, standard takes 3-5 business days.", category: "Logistics" },
    { id: "FAQ-02", question: "What is your return policy?", answer: "We offer a 30-day money-back guarantee with free return labels.", category: "Refunds" },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const columns: Column<FAQRecord>[] = [
    {
      header: "Question",
      accessorKey: "question",
      cell: (row) => <span className="font-bold text-white text-xs leading-snug block max-w-[200px] truncate">{row.question}</span>,
      sortable: true,
    },
    {
      header: "Answer",
      accessorKey: "answer",
      cell: (row) => <span className="text-xs text-muted-foreground line-clamp-1 max-w-[250px]">{row.answer}</span>,
    },
    {
      header: "Category",
      accessorKey: "category",
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
              setFaqs(faqs.filter((f) => f.id !== row.id));
              toast.success("FAQ removed successfully");
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
          <h1 className="text-2xl font-bold font-heading text-white">FAQ CMS Setup</h1>
          <p className="text-xs text-muted-foreground">Manage frequently asked questions categorized for clients storefront page.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <Plus size={16} />
          Create FAQ
        </Button>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={faqs} columns={columns} searchKey="question" searchPlaceholder="Search questions..." />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <DialogHeader className="text-left">
            <DialogTitle className="text-white text-base font-bold font-heading">Create FAQ</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">Add a new frequently asked question.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="question" className="text-xs font-semibold text-white">Question</Label>
              <Textarea id="question" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-24" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="answer" className="text-xs font-semibold text-white">Answer</Label>
              <Textarea id="answer" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-24" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category" className="text-xs font-semibold text-white">Category</Label>
              <Input id="category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">Cancel</Button>
            <Button size="sm" onClick={() => { setFaqs([...faqs, { id: "faq-" + Date.now(), question: newQuestion, answer: newAnswer, category: newCategory }]); setDialogOpen(false); toast.success("FAQ created successfully"); }} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">Create FAQ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
