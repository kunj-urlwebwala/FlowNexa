"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Landmark } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BankRecord {
  id: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  type: string;
  status: string;
}

export default function BankAccountsPage() {
  const [banks, setBanks] = useState<BankRecord[]>([
    { id: "BNK-01", bankName: "Silicon Valley Bank", accountNumber: "•••• 7810", routingNumber: "•••• 0984", type: "Checking Corporate", status: "Primary Active" },
    { id: "BNK-02", bankName: "JPMorgan Chase", accountNumber: "•••• 9482", routingNumber: "•••• 8472", type: "Secondary Escrow", status: "Backup" },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBankName, setNewBankName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newRoutingNumber, setNewRoutingNumber] = useState("");
  const [newType, setNewType] = useState("Checking Corporate");

  const columns: Column<BankRecord>[] = [
    {
      header: "Settlement Node",
      accessorKey: "bankName",
      cell: (row) => (
        <div className="flex items-center gap-2.5 text-left">
          <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground shrink-0">
            <Landmark size={14} />
          </div>
          <span className="font-bold text-white text-xs">{row.bankName}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Account Number",
      accessorKey: "accountNumber",
      cell: (row) => <span className="font-mono text-xs text-white">{row.accountNumber}</span>,
    },
    {
      header: "Routing Number",
      accessorKey: "routingNumber",
      cell: (row) => <span className="font-mono text-xs text-muted-foreground">{row.routingNumber}</span>,
    },
    {
      header: "Hold type",
      accessorKey: "type",
      sortable: true,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <span className={`font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${
          row.status.includes("Primary") ? "bg-flownexa-lime-muted text-flownexa-lime" : "bg-white/5 text-muted-foreground"
        }`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Settlement Bank Accounts</h1>
          <p className="text-xs text-muted-foreground">Manage payout nodes, checking accounts, and escrow reserves.</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <Plus size={16} />
          Link Bank Account
        </Button>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={banks} columns={columns} searchKey="bankName" searchPlaceholder="Search banks..." />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <DialogHeader className="text-left">
            <DialogTitle className="text-white text-base font-bold font-heading">Link Bank Account</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">Register a new settlement bank account.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bankName" className="text-xs font-semibold text-white">Bank Name</Label>
              <Input id="bankName" value={newBankName} onChange={(e) => setNewBankName(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="accountNumber" className="text-xs font-semibold text-white">Account Number</Label>
              <Input id="accountNumber" value={newAccountNumber} onChange={(e) => setNewAccountNumber(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="routingNumber" className="text-xs font-semibold text-white">Routing Number</Label>
              <Input id="routingNumber" value={newRoutingNumber} onChange={(e) => setNewRoutingNumber(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="type" className="text-xs font-semibold text-white">Type</Label>
              <select id="type" value={newType} onChange={(e) => setNewType(e.target.value)} className="bg-[#1A1D26] border border-white/5 text-xs text-white rounded-lg h-10 px-3 focus:outline-none">
                <option value="Checking Corporate">Checking Corporate</option>
                <option value="Secondary Escrow">Secondary Escrow</option>
              </select>
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold text-xs">Cancel</Button>
            <Button size="sm" onClick={() => { setBanks([...banks, { id: "bnk-" + Date.now(), bankName: newBankName, accountNumber: newAccountNumber, routingNumber: newRoutingNumber, type: newType, status: "Backup" }]); setDialogOpen(false); toast.success("Bank account linked successfully"); }} className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer">Link Bank Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
