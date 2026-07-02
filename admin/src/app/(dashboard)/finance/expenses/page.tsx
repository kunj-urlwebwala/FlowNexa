"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ExpenseRecord {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  status: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([
    { id: "EXP-89", category: "Server Infrastructure", amount: 480.0, description: "Vercel Enterprise scaling & bandwidth limits", date: "June 25, 2026", status: "Resolved" },
    { id: "EXP-88", category: "SaaS Software Toolings", amount: 150.0, description: "TipTap RichText and Recharts premium keys", date: "June 18, 2026", status: "Resolved" },
    { id: "EXP-87", category: "Warehouse Cargo Freight", amount: 1800.0, description: "SF Cargo relocation load to NY East Hub", date: "June 12, 2026", status: "Resolved" },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState(0);
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState("");

  const columns: Column<ExpenseRecord>[] = [
    {
      header: "Expense Code",
      accessorKey: "id",
      cell: (row) => <span className="font-bold text-white text-xs">{row.id}</span>,
    },
    {
      header: "Category",
      accessorKey: "category",
      sortable: true,
    },
    {
      header: "Billing details",
      accessorKey: "description",
      cell: (row) => <span className="text-xs text-muted-foreground line-clamp-1">{row.description}</span>,
    },
    {
      header: "Billing Amount",
      accessorKey: "amount",
      cell: (row) => <span className="font-bold text-xs text-red-400">₹{row.amount.toFixed(2)}</span>,
      sortable: true,
    },
    {
      header: "Logged Date",
      accessorKey: "date",
      sortable: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Expenses Control Log</h1>
          <p className="text-xs text-muted-foreground">Log warehouse costs, server scalability billing, and freight payouts.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <Plus size={16} />
          Log Expense
        </Button>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={expenses} columns={columns} searchKey="category" searchPlaceholder="Search expenses..." />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <DialogHeader className="text-left">
            <DialogTitle className="text-white text-base font-bold font-heading">Log Expense</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">Record a new expense entry.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category" className="text-xs font-semibold text-white">Category</Label>
              <Input id="category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="amount" className="text-xs font-semibold text-white">Amount (₹)</Label>
              <Input id="amount" type="number" step="0.01" value={newAmount} onChange={(e) => setNewAmount(Number(e.target.value))} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-white">Description</Label>
              <Textarea id="description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-24" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date" className="text-xs font-semibold text-white">Date</Label>
              <Input id="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">Cancel</Button>
            <Button size="sm" onClick={() => { setExpenses([...expenses, { id: "exp-" + Date.now(), category: newCategory, amount: newAmount, description: newDescription, date: newDate, status: "Resolved" }]); setDialogOpen(false); toast.success("Expense logged successfully"); }} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">Log Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
