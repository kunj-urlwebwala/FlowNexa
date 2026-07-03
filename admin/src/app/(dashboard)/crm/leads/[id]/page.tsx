"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, User, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Timeline from "@/components/shared/Timeline";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailPage(props: PageProps) {
  const params = use(props.params);

  const leads = [
    { id: "lead-1", title: "Google LLC Procurement", subtitle: "Enterprise headphone bulk contract", email: "google-procure@google.com", phone: "+1 (555) 902-8401" },
    { id: "lead-2", title: "Stripe Tech Ops", subtitle: "VR headsets for global onboarding", email: "onboard@stripe.com", phone: "+1 (555) 109-8472" },
    { id: "lead-3", title: "Meta Hardware Labs", subtitle: "Acoustic driver custom evaluation", email: "lab-procure@meta.com", phone: "+1 (555) 993-2910" },
  ];

  const lead = leads.find((l) => l.id === params.id) || leads[0];

  const timelineItems = [
    { title: "Lead Captured", timestamp: "June 25, 09:30 AM", isCompleted: true, description: "Lead registered from B2B web form" },
    { title: "First Contact", timestamp: "June 26, 11:00 AM", isCompleted: true, description: "Dispatched introductory sales deck PDF" },
    { title: "Proposal Dispatched", timestamp: "June 28, 02:00 PM", isCompleted: true, description: "Allocated pricing sheet for 500 units bulk contract" },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <Link href="/crm/leads">
          <Button variant="outline" size="sm" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs gap-1.5 cursor-pointer">
            <ArrowLeft size={14} />
            Back to Deals Flow
          </Button>
        </Link>
      </div>

      <div className="bg-flownexa-surface border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="flex gap-4 items-center">
          <div className="size-16 rounded-2xl bg-flownexa-lime flex items-center justify-center text-flownexa-black text-2xl font-extrabold shadow-lg shadow-flownexa-lime/10 shrink-0">
            <User size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-heading">{lead.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{lead.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-flownexa-surface border-white/5 rounded-3xl text-left">
          <CardContent className="p-6 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Deal Contact</h3>
            <div className="flex flex-col gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-flownexa-lime shrink-0" />
                <span>{lead.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-flownexa-lime shrink-0" />
                <span>{lead.phone}</span>
              </div>
            </div>
            <Button
              onClick={() => {
                toast.success("Meeting Scheduled", { description: "Sent calendar invite for B2B contract discussion." });
              }}
              className="w-full rounded-xl bg-flownexa-lime text-flownexa-black font-semibold text-xs h-9 cursor-pointer mt-2"
            >
              Schedule Callback
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-flownexa-surface border-white/5 md:col-span-2 rounded-3xl text-left">
          <CardContent className="p-6 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Interaction Timeline</h3>
            <Timeline items={timelineItems} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
