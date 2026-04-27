"use client";

import React, { useState, DragEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type ColumnType = "backlog" | "todo" | "doing" | "done";

export interface CardType {
  title: string;
  id: string;
  column: ColumnType;
  description?: string;
  priority?: "low" | "medium" | "high";
  assignee?: {
    name: string;
    avatar: string;
  };
  tags?: string[];
  dueDate?: string;
}

interface ColumnProps {
  title: string;
  headingColor: string;
  cards: CardType[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
}

interface CardProps extends CardType {
  handleDragStart: (e: DragEvent, card: CardType) => void;
}

interface DropIndicatorProps {
  beforeId: string | null;
  column: string;
}

interface AddCardProps {
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
}

const DEFAULT_CARDS: CardType[] = [
  {
    title: "Design System Audit",
    id: "1",
    column: "backlog",
    description: "Review and update component library",
    priority: "high",
    assignee: { name: "Sarah Chen", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    tags: ["Design", "System"],
    dueDate: "Jan 15",
  },
  {
    title: "User Research Analysis",
    id: "2",
    column: "backlog",
    description: "Analyze feedback from recent user interviews",
    priority: "medium",
    assignee: { name: "Alex Rivera", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    tags: ["Research", "UX"],
    dueDate: "Jan 18",
  },
  {
    title: "Mobile App Redesign",
    id: "3",
    column: "todo",
    description: "Implementing new navigation patterns",
    priority: "high",
    assignee: { name: "Jordan Kim", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
    tags: ["Mobile", "UI"],
  },
  {
    title: "API Documentation",
    id: "4",
    column: "doing",
    description: "Complete developer documentation",
    priority: "medium",
    assignee: { name: "Maya Patel", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
    tags: ["Documentation", "API"],
    dueDate: "Jan 20",
  },
  {
    title: "Landing Page Optimization",
    id: "5",
    column: "done",
    description: "Improved conversion rate by 23%",
    priority: "low",
    assignee: { name: "Chris Wong", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
    tags: ["Marketing", "Web"],
  },
];

export const KanbanBoard = () => {
  const [cards, setCards] = useState<CardType[]>(DEFAULT_CARDS);

  return (
    <div className="flex h-full w-full gap-4 overflow-x-auto p-8 custom-scrollbar">
      <Column
        title="Backlog"
        column="backlog"
        headingColor="text-neutral-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="TODO"
        column="todo"
        headingColor="text-yellow-600"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In Progress"
        column="doing"
        headingColor="text-blue-600"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Complete"
        column="done"
        headingColor="text-emerald-600"
        cards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

const Column = ({ title, headingColor, cards, column, setCards }: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, card: CardType) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`[data-column="${column}"]`) as unknown as HTMLElement[]
    );
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-80 shrink-0">
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`font-semibold text-sm ${headingColor}`}>{title}</h3>
        <Badge variant="secondary" className="rounded-full">
          {filteredCards.length}
        </Badge>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`min-h-[500px] w-full rounded-lg border bg-muted/10 p-2 transition-colors ${
          active ? "border-primary bg-primary/5" : "border-white/5"
        }`}
      >
        {filteredCards.map((c) => (
          <TaskCard key={c.id} {...c} handleDragStart={handleDragStart} />
        ))}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

const TaskCard = ({
  title,
  id,
  column,
  description,
  priority,
  assignee,
  tags,
  dueDate,
  handleDragStart,
}: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStartCapture={(e) => handleDragStart(e, { title, id, column, description, priority, assignee, tags, dueDate })}
        className="cursor-grab active:cursor-grabbing mb-2"
      >
        <Card className="hover:shadow-md transition-shadow bg-neutral-900 border-white/5 hover:border-primary/30 group">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-sm leading-tight flex-1 text-neutral-200 group-hover:text-white transition-colors">{title}</h4>
                {priority && (
                  <Badge
                    variant={
                      priority === "high"
                        ? "destructive"
                        : priority === "medium"
                        ? "default"
                        : "secondary"
                    }
                    className="text-[10px] uppercase font-black px-1.5 py-0 h-4 shrink-0"
                  >
                    {priority}
                  </Badge>
                )}
              </div>

              {description && (
                <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">{description}</p>
              )}

              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] border-white/10 text-neutral-400">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                {dueDate && (
                  <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">{dueDate}</span>
                )}
                {assignee && (
                  <Avatar className="w-6 h-6 border border-white/10">
                    <AvatarImage src={assignee.avatar} />
                    <AvatarFallback className="text-[10px] bg-neutral-800 text-neutral-400">
                      {assignee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-primary opacity-0"
    />
  );
};

const BurnBarrel = ({ setCards }: { setCards: Dispatch<SetStateAction<CardType[]>> }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    setCards((pv) => pv.filter((c) => c.id !== cardId));
    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded-xl border-2 border-dashed text-3xl transition-all duration-500 ${
        active
          ? "border-destructive bg-destructive/10 text-destructive scale-105"
          : "border-white/10 bg-white/[0.02] text-neutral-600"
      }`}
    >
      {active ? <Flame className="animate-bounce" size={32} /> : <Trash2 size={32} />}
    </div>
  );
};

const AddCard = ({ column, setCards }: AddCardProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard: CardType = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
    };

    setCards((pv) => [...pv, newCard]);
    setAdding(false);
    setText("");
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit} className="mt-2">
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Añadir nueva tarea..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            value={text}
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setText("");
              }}
              className="px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-300"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-black transition-all hover:bg-primary/90 active:scale-95"
            >
              <span>Añadir</span>
              <Plus size={14} />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500 transition-all hover:text-neutral-200 rounded-xl hover:bg-white/[0.05]"
        >
          <Plus size={14} />
          <span>Nueva Tarea</span>
        </motion.button>
      )}
    </>
  );
};

export default KanbanBoard;
