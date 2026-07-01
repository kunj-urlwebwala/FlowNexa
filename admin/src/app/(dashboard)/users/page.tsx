"use client";

import React, { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, ShieldAlert, UserCheck, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { api } from "@/lib/api";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  ordersCount: number;
  joinedDate: string;
}

export default function UsersListPage() {
  const [usersList, setUsersList] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<UserRecord | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get<any[]>("/users");
      
      // Map API user record to UI record
      const mapped: UserRecord[] = data.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || "",
        role: "Customer",
        status: u.isActive ? "Active" : "Inactive",
        ordersCount: 0, // dynamic count could be loaded or default 0
        joinedDate: new Date(u.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      }));
      
      setUsersList(mapped);
    } catch (err: any) {
      toast.error("Failed to load user directory", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeactivate = (user: UserRecord) => {
    setActiveUser(user);
    setConfirmOpen(true);
  };

  const executeDeactivate = async () => {
    if (!activeUser) return;
    const nextStatus = activeUser.status === "Active" ? "Inactive" : "Active";
    const isActive = nextStatus === "Active";

    try {
      await api.patch(`/users/${activeUser.id}`, { isActive });
      
      const updated = usersList.map((u) => {
        if (u.id === activeUser.id) {
          return { ...u, status: nextStatus };
        }
        return u;
      });
      setUsersList(updated);
      toast.success(isActive ? "User Activated" : "User Suspended", {
        description: `${activeUser.name} status updated successfully.`,
      });
    } catch (err: any) {
      toast.error("Failed to update user status", {
        description: err.message,
      });
    }
  };

  const columns: Column<UserRecord>[] = [
    {
      header: "User Details",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-white text-xs">{row.name}</span>
          <span className="text-[10px] text-muted-foreground">{row.email}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Access Role",
      accessorKey: "role",
      cell: (row) => (
        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white/5 border border-white/5 text-white/90">
          {row.role}
        </span>
      ),
      sortable: true,
    },
    {
      header: "Account Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
      sortable: true,
    },
    {
      header: "Joined Date",
      accessorKey: "joinedDate",
      sortable: true,
    },
    {
      header: "Controls",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex gap-1.5 justify-end">
          <Link href={`/users/${row.id}`}>
            <Button
              variant="outline"
              size="xs"
              className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer"
              title="View Profile Details"
            >
              <Eye size={12} className="text-white" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="xs"
            onClick={() => handleDeactivate(row)}
            className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer"
            title={row.status === "Active" ? "Suspend Account" : "Unsuspend Account"}
          >
            {row.status === "Active" ? (
              <ShieldAlert size={12} className="text-red-400" />
            ) : (
              <UserCheck size={12} className="text-emerald-400" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  const bulkActions = [
    {
      label: "Delete Accounts",
      action: async (items: UserRecord[]) => {
        try {
          for (const item of items) {
            await api.delete(`/users/${item.id}`);
          }
          const idsToDelete = new Set(items.map((i) => i.id));
          setUsersList(usersList.filter((u) => !idsToDelete.has(u.id)));
          toast.success("Accounts deleted successfully");
        } catch (err: any) {
          toast.error("Failed to delete some accounts", {
            description: err.message,
          });
        }
      },
      icon: Trash2,
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Title Header */}
      <div className="flex justify-between items-center text-left">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Users & Operators</h1>
          <p className="text-xs text-muted-foreground">
            Manage client directories, roles, statuses, and login sessions.
          </p>
        </div>
        <span className="text-[9px] bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full text-muted-foreground font-extrabold uppercase">
          Client Database
        </span>
      </div>

      {/* DataTable */}
      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl min-h-[200px] flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <Loader2 className="animate-spin text-flownexa-lime size-6" />
            <span className="text-xs text-muted-foreground">Syncing user directory with database...</span>
          </div>
        ) : (
          <DataTable
            data={usersList}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Search users by name or email..."
            bulkActions={bulkActions}
          />
        )}
      </div>

      {/* Confirmation modal */}
      {activeUser && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title={activeUser.status === "Active" ? "Suspend Account" : "Activate Account"}
          description={`Are you sure you want to change status of ${activeUser.name} to ${activeUser.status === "Active" ? "Inactive" : "Active"}? This will toggle their sign-in abilities.`}
          confirmLabel="Yes, Execute Toggle"
          onConfirm={executeDeactivate}
          variant={activeUser.status === "Active" ? "destructive" : "default"}
        />
      )}

    </div>
  );
}
