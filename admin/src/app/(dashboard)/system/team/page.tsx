"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { mockTeamMembers, TeamMember, teamRoles } from "@/data/team";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  UserX,
  UserCheck,
  ShieldCheck,
  Mail,
  User,
  KeyRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "@/store/adminStore";

export default function TeamManagementPage() {
  const { user } = useAdminStore();
  const [teamList, setTeamList] = useState<TeamMember[]>(mockTeamMembers);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Form State
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [newRole, setNewRole] = useState<TeamMember["role"]>("Support Staff");
  const [newPassword, setNewPassword] = useState("");

  const canAddMembers = user?.role === "Super Admin" || user?.role === "Management Team";

  const handleToggleStatus = (member: TeamMember) => {
    setActiveMember(member);
    setConfirmOpen(true);
  };

  const executeToggleStatus = () => {
    if (!activeMember) return;
    const isActivating = activeMember.status === "Inactive";
    const updated = teamList.map((tm) => {
      if (tm.id === activeMember.id) {
        return { ...tm, status: isActivating ? ("Active" as const) : ("Inactive" as const) };
      }
      return tm;
    });
    setTeamList(updated);
    toast.success(isActivating ? "Member Activated" : "Member Suspended", {
      description: `${activeMember.username} has been marked ${
        isActivating ? "Active" : "Suspended"
      }.`,
    });
  };

  const handleDeleteClick = (member: TeamMember) => {
    setActiveMember(member);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = () => {
    if (!activeMember) return;
    setTeamList(teamList.filter((tm) => tm.id !== activeMember.id));
    toast.success("Team Member Deleted", {
      description: `${activeMember.username} has been removed from the directory.`,
    });
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newEmail || !newPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      username: newUsername.toLowerCase().trim().replace(/\s+/g, "."),
      email: newEmail.trim(),
      designation: newDesignation.trim() || "Workspace Operator",
      role: newRole,
      status: "Active",
      lastLogin: "Never",
      addedBy: user?.name || "System",
    };

    setTeamList([newMember, ...teamList]);
    setCreateDialogOpen(false);
    toast.success("Team Member Created", {
      description: `Successfully added ${newUsername} as ${newRole}.`,
    });

    // Reset Form
    setNewUsername("");
    setNewEmail("");
    setNewName("");
    setNewDesignation("");
    setNewRole("Support Staff");
    setNewPassword("");
  };

  const columns: Column<TeamMember>[] = [
    {
      header: "Staff Member",
      accessorKey: "username",
      cell: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-white text-xs">@{row.username}</span>
          <span className="text-[10px] text-muted-foreground">{row.email}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Designation",
      accessorKey: "designation",
      cell: (row) => (
        <span className="text-xs text-zinc-300 font-medium">{row.designation || "—"}</span>
      ),
      sortable: true,
    },
    {
      header: "Assigned Role",
      accessorKey: "role",
      cell: (row) => (
        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white/5 border border-white/5 text-white/90">
          {row.role}
        </span>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
      sortable: true,
    },
    {
      header: "Last Active",
      accessorKey: "lastLogin",
      sortable: true,
    },
    {
      header: "Created By",
      accessorKey: "addedBy",
      cell: (row) => <span className="text-xs text-zinc-400">{row.addedBy}</span>,
      sortable: true,
    },
    {
      header: "Controls",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex gap-1.5 justify-end">
          {canAddMembers && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => handleToggleStatus(row)}
              className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer"
              title={row.status === "Active" ? "Suspend Member" : "Activate Member"}
            >
              {row.status === "Active" ? (
                <UserX size={12} className="text-amber-400" />
              ) : (
                <UserCheck size={12} className="text-emerald-400" />
              )}
            </Button>
          )}
          {canAddMembers && row.role !== "Super Admin" && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => handleDeleteClick(row)}
              className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-red-950/20 hover:border-red-900/50 flex items-center justify-center p-0 cursor-pointer"
              title="Delete Account"
            >
              <Trash2 size={12} className="text-red-400" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#14161F] p-6 rounded-2xl border border-white/5">
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-flownexa-lime" />
            <h1 className="text-lg font-bold font-heading text-white">Team Directory</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage system administrators, warehouse personnel, support, and sales executives.
          </p>
        </div>

        {canAddMembers && (
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="rounded-xl bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-bold text-xs flex items-center gap-2 cursor-pointer h-10 px-5"
          >
            <Plus size={14} /> Add Team Member
          </Button>
        )}
      </div>

      {/* Directory Table */}
      <div className="bg-[#14161F] p-5 rounded-3xl border border-white/5 text-left">
        <DataTable
          data={teamList}
          columns={columns}
          searchPlaceholder="Search team directory..."
          searchKey="username"
        />
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-md p-6 font-sans">
          <form onSubmit={handleCreateMember}>
            <DialogHeader className="text-left mb-4">
              <DialogTitle className="text-white text-base font-bold font-heading">
                Add Team Member
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Register a new workspace operator with defined role-based permissions.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 text-left">
              <div>
                <Label htmlFor="name" className="text-xs text-zinc-300 font-bold mb-1 block">
                  Full Name
                </Label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Sara Connor"
                    className="pl-9 bg-[#14161F] border-white/5 text-xs text-white rounded-lg focus:border-flownexa-lime h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="username" className="text-xs text-zinc-300 font-bold mb-1 block">
                    Username *
                  </Label>
                  <Input
                    id="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="sara.connor"
                    className="bg-[#14161F] border-white/5 text-xs text-white rounded-lg focus:border-flownexa-lime h-10"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="designation" className="text-xs text-zinc-300 font-bold mb-1 block">
                    Designation
                  </Label>
                  <Input
                    id="designation"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                    placeholder="e.g. Support Executive"
                    className="bg-[#14161F] border-white/5 text-xs text-white rounded-lg focus:border-flownexa-lime h-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-xs text-zinc-300 font-bold mb-1 block">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="sara@flownexa.com"
                    className="pl-9 bg-[#14161F] border-white/5 text-xs text-white rounded-lg focus:border-flownexa-lime h-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="role" className="text-xs text-zinc-300 font-bold mb-1 block">
                    Access Role
                  </Label>
                  <select
                    id="role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full bg-[#14161F] border border-white/5 text-xs text-white rounded-lg p-2.5 outline-none focus:border-flownexa-lime h-10 cursor-pointer"
                  >
                    {teamRoles.map((role) => (
                      <option key={role} value={role} className="bg-zinc-950">
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="pass" className="text-xs text-zinc-300 font-bold mb-1 block">
                    Temporary Password *
                  </Label>
                  <div className="relative">
                    <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="pass"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9 bg-[#14161F] border-white/5 text-xs text-white rounded-lg focus:border-flownexa-lime h-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCreateDialogOpen(false)}
                className="w-full sm:w-auto rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold text-xs h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="w-full sm:w-auto rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-black font-bold text-xs cursor-pointer h-10"
              >
                Create Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Status Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={activeMember?.status === "Active" ? "Suspend Member" : "Activate Member"}
        description={`Are you sure you want to change the account status of @${activeMember?.username}?`}
        onConfirm={executeToggleStatus}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Team Member"
        description={`This action will permanently delete @${activeMember?.username} from the directory. Are you sure?`}
        variant="destructive"
        onConfirm={executeDelete}
        confirmLabel="Delete Account"
      />
    </div>
  );
}
