"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import StatCard from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Bot, Phone, CheckCircle2, XCircle, PhoneOff, AlertTriangle, Loader2, RefreshCcw, Clock } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/shared/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";

interface CallLogRecord {
  id: string;
  orderId: string;
  callId: string | null;
  phoneNumber: string;
  status: string;
  result: string | null;
  attemptNumber: number;
  transcript: string | null;
  summary: string | null;
  recordingUrl: string | null;
  callDuration: number | null;
  retryAfter: string | null;
  createdAt: string;
  order: {
    orderNumber: string;
    status: string;
    total: number;
    paymentMethod: string;
    user: {
      name: string;
      email: string;
      phone: string | null;
    };
  };
}

interface CallStats {
  total: number;
  completed: number;
  confirmed: number;
  noAnswer: number;
  failed: number;
  pending: number;
}

const CountdownTimer = ({ retryAfter, onComplete }: { retryAfter: string; onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = new Date(retryAfter).getTime() - Date.now();
      return diff > 0 ? Math.floor(diff / 1000) : 0;
    };

    setTimeLeft(calculateTimeLeft()); // eslint-disable-line react-hooks/set-state-in-effect

    const interval = setInterval(() => {
      const t = calculateTimeLeft();
      setTimeLeft(t);
      if (t <= 0) {
        clearInterval(interval);
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [retryAfter, onComplete]);

  if (timeLeft <= 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <span className="text-[10px] text-yellow-400 font-mono flex items-center gap-1 mt-0.5 animate-pulse">
      <Clock size={10} /> Auto-retry in {formattedTime}
    </span>
  );
};

export default function AICallingAgentPage() {
  const [logs, setLogs] = useState<CallLogRecord[]>([]);
  const [stats, setStats] = useState<CallStats>({ total: 0, completed: 0, confirmed: 0, noAnswer: 0, failed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [activeCall, setActiveCall] = useState<CallLogRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [retrying, setRetrying] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [callsData, statsData] = await Promise.all([
        api.get<CallLogRecord[]>("/ai-calls?page=1&limit=50"),
        api.get<CallStats>("/ai-calls/stats"),
      ]);
      setLogs(callsData || []);
      setStats(statsData || { total: 0, completed: 0, confirmed: 0, noAnswer: 0, failed: 0, pending: 0 });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(); // eslint-disable-line react-hooks/set-state-in-effect

    // Auto-refresh every 15 seconds for real-time updates
    pollRef.current = setInterval(() => {
      loadData();
    }, 15000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loadData]);

  const handleRetryCall = async (orderId: string) => {
    try {
      setRetrying(orderId);
      const result = await api.post<{ phone?: string }>(`/ai-calls/retry/${orderId}`);
      toast.success(`Call initiated to ${result?.phone || "customer"} — should ring shortly.`);
      // Refresh data after a short delay to pick up webhook updates
      setTimeout(loadData, 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to initiate retry call";
      toast.error(message);
    } finally {
      setRetrying(null);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "—";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const getResultIcon = (result: string | null) => {
    switch (result) {
      case "CONFIRMED": return <CheckCircle2 className="text-green-400" size={14} />;
      case "DENIED": return <XCircle className="text-red-400" size={14} />;
      case "NO_ANSWER": return <PhoneOff className="text-yellow-400" size={14} />;
      case "ERROR": return <AlertTriangle className="text-red-400" size={14} />;
      default: return <Loader2 className="text-muted-foreground animate-spin" size={14} />;
    }
  };

  const columns: Column<CallLogRecord>[] = [
    {
      header: "Order",
      accessorKey: "orderId",
      cell: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-flownexa-lime text-xs">{row.order?.orderNumber || "—"}</span>
          <span className="text-[9px] text-muted-foreground">Attempt #{row.attemptNumber}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Customer",
      accessorKey: "phoneNumber",
      cell: (row) => (
        <div className="flex flex-col text-left gap-0.5">
          <span className="font-bold text-white text-xs">{row.order?.user?.name || "Unknown"}</span>
          <span className="text-[11px] text-zinc-400">{row.phoneNumber || row.order?.user?.phone || "No Number"}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Duration",
      accessorKey: "callDuration",
      cell: (row) => <span className="text-xs text-muted-foreground">{formatDuration(row.callDuration)}</span>,
      sortable: true,
    },
    {
      header: "Result",
      accessorKey: "result",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          {getResultIcon(row.result)}
          <span className="text-xs font-medium">{row.result || "PENDING"}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Summary",
      accessorKey: "summary",
      cell: (row) => (
        <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
          {row.summary || "Awaiting call completion..."}
        </span>
      ),
    },
    {
      header: "Time",
      accessorKey: "createdAt",
      cell: (row) => <span className="text-xs text-muted-foreground">{formatDate(row.createdAt)}</span>,
      sortable: true,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <div className="flex flex-col text-left">
          <StatusBadge status={row.status} />
          {row.status === "NO_ANSWER" && row.retryAfter && (
            <CountdownTimer
              retryAfter={row.retryAfter}
              onComplete={() => handleRetryCall(row.orderId)}
            />
          )}
        </div>
      ),
      sortable: true,
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex gap-1.5 justify-end">
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              setActiveCall(row);
              setDialogOpen(true);
            }}
            className="h-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] text-xs px-3 cursor-pointer"
          >
            View
          </Button>
          <Button
            variant="outline"
            size="xs"
            disabled={retrying === row.orderId || row.result === "CONFIRMED" || row.order?.status === "PROCESSING"}
            onClick={() => handleRetryCall(row.orderId)}
            className="h-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] text-xs px-3 cursor-pointer"
          >
            {retrying === row.orderId ? <Loader2 className="animate-spin" size={12} /> : <Phone size={12} />}
            <span className="ml-1">{row.result === "CONFIRMED" ? "Verified" : "Call Now"}</span>
          </Button>
        </div>
      ),
    },
  ];

  const successRate = stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">AI Voice Calling Dashboard</h1>
          <p className="text-xs text-muted-foreground">Monitor autonomous order verification calls, transcripts, and retry schedules. Auto-refreshes every 15s.</p>
        </div>
        <Button
          onClick={loadData}
          disabled={loading}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Calls" value={`${stats.total} calls`} icon={Phone} />
        <StatCard title="Confirmed Orders" value={`${stats.confirmed}`} icon={CheckCircle2} variant="highlighted" />
        <StatCard title="Pending Calls" value={`${stats.pending}`} icon={Clock} />
        <StatCard title="No Answer" value={`${stats.noAnswer}`} icon={PhoneOff} />
        <StatCard
          title="Verification Rate"
          value={`${successRate}%`}
          icon={Bot}
          progress={{ value: successRate, label: "Order Confirmation Success" }}
        />
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin text-flownexa-lime size-8 mb-3" />
            <p className="text-xs text-muted-foreground">Loading AI call records...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Bot className="text-muted-foreground size-12 mb-3 opacity-30" />
            <p className="text-sm text-muted-foreground font-medium">No AI calls yet</p>
            <p className="text-xs text-muted-foreground mt-1">Calls will appear here when customers place orders.</p>
          </div>
        ) : (
          <DataTable data={logs} columns={columns} searchKey="phoneNumber" searchPlaceholder="Search by phone number or order..." />
        )}
      </div>

      {/* Transcript Dialog */}
      {activeCall && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-lg p-6 font-sans">
            <DialogHeader className="text-left">
              <DialogTitle className="text-white text-base font-bold font-heading">
                AI Call Transcript — {activeCall.order?.orderNumber}
              </DialogTitle>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] bg-white/5 rounded-full px-2.5 py-1 text-muted-foreground">
                  {activeCall.order?.user?.name} • {activeCall.phoneNumber}
                </span>
                <span className="text-[10px] bg-white/5 rounded-full px-2.5 py-1 text-muted-foreground">
                  Duration: {formatDuration(activeCall.callDuration)}
                </span>
                <span className={`text-[10px] rounded-full px-2.5 py-1 font-semibold ${
                  activeCall.result === "CONFIRMED" ? "bg-green-500/10 text-green-400" :
                  activeCall.result === "DENIED" ? "bg-red-500/10 text-red-400" :
                  "bg-yellow-500/10 text-yellow-400"
                }`}>
                  {activeCall.result || "PENDING"}
                </span>
              </div>
            </DialogHeader>

            <div className="flex flex-col gap-3 mt-4 text-xs max-h-[350px] overflow-y-auto pr-1 scrollbar-thin text-left leading-relaxed">
              {activeCall.transcript ? (
                activeCall.transcript.split("\n").map((line, i) => {
                  const isAgent = line.toLowerCase().startsWith("agent:") || line.toLowerCase().startsWith("ai:");
                  return (
                    <div key={i} className={`flex gap-2 ${!isAgent ? "border-l-2 border-white/10 pl-2.5" : ""}`}>
                      <span className={`font-extrabold uppercase shrink-0 ${isAgent ? "text-flownexa-lime" : "text-muted-foreground"}`}>
                        {isAgent ? "AI:" : "Customer:"}
                      </span>
                      <span className={isAgent ? "text-white" : "text-muted-foreground"}>
                        {line.replace(/^(agent|ai|user|customer):\s*/i, "")}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground italic">No transcript available for this call.</p>
              )}
            </div>

            {(() => {
              if (!activeCall.summary) return null;
              let displayText = activeCall.summary;
              let isError = false;
              try {
                const parsed = JSON.parse(activeCall.summary);
                if (parsed.message) {
                  displayText = parsed.message;
                }
                if (parsed.status === "error") {
                  isError = true;
                }
              } catch {
                // Not JSON
              }

              return (
                <div className={`mt-4 rounded-xl p-3 ${isError ? "bg-red-500/10 border border-red-500/20 text-red-200" : "bg-white/5 text-white/80"}`}>
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">
                    {isError ? "⚠️ Error Details" : "AI Summary"}
                  </p>
                  <p className="text-xs">{displayText}</p>
                </div>
              );
            })()}

            {activeCall.recordingUrl && (
              <div className="mt-3">
                <audio controls className="w-full h-8" src={activeCall.recordingUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={retrying === activeCall.orderId || activeCall.result === "CONFIRMED"}
                onClick={() => {
                  handleRetryCall(activeCall.orderId);
                  setDialogOpen(false);
                }}
                className="rounded-full border-white/10 text-xs cursor-pointer px-4"
              >
                {retrying === activeCall.orderId ? <Loader2 className="animate-spin" size={12} /> : <Phone size={12} className="mr-1" />}
                {activeCall.result === "CONFIRMED" ? "Already Verified" : "Call Now"}
              </Button>
              <Button
                size="sm"
                onClick={() => setDialogOpen(false)}
                className="rounded-full bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover font-semibold text-xs cursor-pointer px-5"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
