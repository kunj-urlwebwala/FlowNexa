"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

interface Step {
  title: string;
  subtitle?: string;
}

interface FormWizardProps {
  currentStep: number; // 0-indexed
  steps: Step[];
  onStepChange: (step: number) => void;
  onSubmit: () => void;
  children: React.ReactNode;
  isValid?: boolean;
  isSubmitting?: boolean;
}

export default function FormWizard({
  currentStep,
  steps,
  onStepChange,
  onSubmit,
  children,
  isValid = true,
  isSubmitting = false,
}: FormWizardProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isValid && !isLastStep) {
      onStepChange(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      onStepChange(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans select-none">
      {/* Wizard Progress Header */}
      <div className="bg-flownexa-surface border border-white/5 p-4 rounded-2xl flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold uppercase tracking-wider text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="font-bold text-flownexa-lime">
            {steps[currentStep].title}
          </span>
        </div>

        {/* Dynamic Progress indicator bar */}
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden flex gap-0.5">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "flex-1 h-full rounded-full transition-all duration-500",
                idx <= currentStep ? "bg-flownexa-lime shadow-[0_0_8px_rgba(225,255,75,0.4)]" : "bg-white/10"
              )}
            />
          ))}
        </div>

        {/* Steps Label Stack (Horizontal scrolling on mobile, grid on desktop) */}
        <div className="hidden sm:flex items-center justify-between gap-1.5 pt-1 divide-x divide-white/5">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isActive = idx === currentStep;

            return (
              <div
                key={idx}
                onClick={() => isDone && onStepChange(idx)}
                className={cn(
                  "flex-1 text-center py-1 flex flex-col items-center justify-center gap-1 transition-all first:pl-0 pl-2",
                  isDone ? "cursor-pointer" : "cursor-default"
                )}
              >
                <div
                  className={cn(
                    "size-5 rounded-full border text-[9px] font-extrabold flex items-center justify-center",
                    isDone
                      ? "bg-flownexa-lime-muted border-flownexa-lime text-flownexa-lime"
                      : isActive
                      ? "bg-flownexa-lime text-flownexa-black border-flownexa-lime"
                      : "bg-zinc-950 border-white/10 text-muted-foreground"
                  )}
                >
                  {isDone ? <CheckCircle2 size={10} /> : idx + 1}
                </div>
                <span
                  className={cn(
                    "text-[9px] font-bold uppercase tracking-wider truncate max-w-[80px]",
                    isActive ? "text-white" : isDone ? "text-muted-foreground hover:text-white" : "text-muted-foreground/55"
                  )}
                >
                  {step.title.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Active Step Container */}
      <div className="bg-flownexa-surface border border-white/5 rounded-3xl p-6 min-h-[300px]">
        {children}
      </div>

      {/* Wizard Controls Footer */}
      <div className="flex justify-between items-center bg-zinc-900/40 p-4 border border-white/5 rounded-2xl">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isFirstStep}
          className="rounded-full border-white/10 bg-[#1A1D26] text-white hover:bg-[#242836] font-semibold text-xs gap-1.5 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
        >
          <ArrowLeft size={14} />
          Back
        </Button>

        {isLastStep ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !isValid}
            className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover shadow-lg shadow-flownexa-lime/10 text-xs px-5 cursor-pointer disabled:opacity-30"
          >
            {isSubmitting ? "Submitting details..." : "Complete & Launch"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!isValid}
            className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover shadow-lg shadow-flownexa-lime/10 text-xs gap-1.5 cursor-pointer disabled:opacity-30"
          >
            Continue
            <ArrowRight size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
