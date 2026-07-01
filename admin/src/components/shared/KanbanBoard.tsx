"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, ChevronRight, User, Phone, Mail } from "lucide-react";
import StatusBadge from "./StatusBadge";

export interface KanbanCard {
  id: string;
  title: string;
  subtitle?: string;
  meta?: {
    phone?: string;
    email?: string;
    date?: string;
  };
  status: string; // matches column id
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
}

interface KanbanBoardProps {
  initialCards: KanbanCard[];
  columns: KanbanColumn[];
  onCardClick?: (card: KanbanCard) => void;
  onAddCard?: (columnId: string) => void;
}

export default function KanbanBoard({
  initialCards,
  columns,
  onCardClick,
  onAddCard,
}: KanbanBoardProps) {
  const [cards, setCards] = useState<KanbanCard[]>(initialCards);

  // Manual move helper for client side demo
  const moveCard = (cardId: string, targetStatus: string) => {
    const updated = cards.map((c) => {
      if (c.id === cardId) {
        return { ...c, status: targetStatus };
      }
      return c;
    });
    setCards(updated);
  };

  return (
    <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin select-none font-sans min-h-[500px]">
      {columns.map((col) => {
        const columnCards = cards.filter((c) => c.status.toLowerCase() === col.id.toLowerCase());

        return (
          <div
            key={col.id}
            className="flex-1 min-w-[280px] max-w-[340px] flex flex-col gap-3 p-3 bg-zinc-950/20 border border-white/5 rounded-2xl h-full"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className={cn("size-2.5 rounded-full", col.color)} />
                <h4 className="font-heading font-extrabold text-xs text-white uppercase tracking-wider">
                  {col.title}
                </h4>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full border border-white/5 text-muted-foreground font-bold">
                  {columnCards.length}
                </span>
              </div>

              {onAddCard && (
                <button
                  onClick={() => onAddCard(col.id)}
                  className="size-6 rounded-lg bg-[#1A1D26] hover:bg-[#242836] border border-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-colors cursor-pointer"
                  title="Add Lead Card"
                >
                  <Plus size={12} />
                </button>
              )}
            </div>

            {/* Column Cards Drop Area */}
            <div className="flex-1 flex flex-col gap-3 min-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
              {columnCards.length === 0 ? (
                <div className="flex-1 border border-dashed border-white/5 rounded-xl flex items-center justify-center p-6 text-center text-[10px] text-muted-foreground leading-relaxed">
                  No cards in this column. Move cards here to update status.
                </div>
              ) : (
                columnCards.map((card) => (
                  <motion.div
                    key={card.id}
                    layoutId={card.id}
                    onClick={() => onCardClick && onCardClick(card)}
                    className="p-4 bg-[#1A1D26] border border-white/5 rounded-xl hover:border-flownexa-lime/20 cursor-pointer shadow-md hover:shadow-lg transition-all group flex flex-col gap-2.5"
                  >
                    {/* Card Title */}
                    <div className="flex items-start justify-between gap-3 text-left">
                      <div>
                        <h5 className="font-bold text-xs text-white group-hover:text-flownexa-lime transition-colors">
                          {card.title}
                        </h5>
                        {card.subtitle && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">{card.subtitle}</p>
                        )}
                      </div>
                      <ChevronRight size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 shrink-0" />
                    </div>

                    {/* Metadata contact specs */}
                    {card.meta && (
                      <div className="flex flex-col gap-1 text-[9px] text-muted-foreground leading-none pt-1 border-t border-white/5">
                        {card.meta.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone size={10} className="shrink-0" />
                            <span>{card.meta.phone}</span>
                          </div>
                        )}
                        {card.meta.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail size={10} className="shrink-0" />
                            <span className="truncate">{card.meta.email}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Move selector for Client Demo */}
                    <div className="flex items-center justify-between gap-3 pt-2 mt-1 border-t border-white/5">
                      <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider">
                        Quick Move:
                      </span>
                      <select
                        value={card.status}
                        onChange={(e) => moveCard(card.id, e.target.value)}
                        className="bg-zinc-950 border border-white/5 rounded px-1.5 py-0.5 text-[9px] text-white focus:outline-none cursor-pointer"
                        onClick={(e) => e.stopPropagation()} // prevent card click
                      >
                        {columns.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title.split(" ")[0]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
