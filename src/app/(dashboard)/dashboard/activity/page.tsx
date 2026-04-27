"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "motion/react";
import { Tables } from "@/types/database";

type ActivityWithProfile = Tables<"activity_log"> & {
  profiles: { full_name: string; avatar_url: string | null } | null;
};

const ACTION_LABELS: Record<string, string> = {
  task_created: "creó una tarea",
  task_updated: "actualizó una tarea",
  task_completed: "completó una tarea",
  comment_added: "comentó en una tarea",
  member_joined: "se unió al espacio",
  space_created: "creó un espacio",
};

const ACTION_COLORS: Record<string, string> = {
  task_created: "bg-blue-500",
  task_updated: "bg-yellow-500",
  task_completed: "bg-[#51DD7D]",
  comment_added: "bg-purple-500",
  member_joined: "bg-orange-500",
  space_created: "bg-pink-500",
};

export default function ActivityPage() {
  const [activity, setActivity] = useState<ActivityWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const loadActivity = useCallback(async () => {
    const { data } = await supabase
      .from("activity_log")
      .select("*, profiles:user_id(full_name, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(50);

    setActivity((data as ActivityWithProfile[]) || []);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    const handle = requestAnimationFrame(() => loadActivity());
    return () => cancelAnimationFrame(handle);
  }, [loadActivity]);

  return (
    <div className="min-h-full bg-[#0a0a0c]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-2xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
          <div className="h-8 w-1 bg-[#51DD7D] rounded-full" />
          Actividad Reciente
        </h1>
        <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-[0.2em] mt-1 ml-4">
          Historial de acciones del equipo
        </p>
      </div>

      <div className="max-w-3xl mx-auto p-8">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : activity.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h2 className="text-white font-bold mb-2">Sin actividad reciente</h2>
            <p className="text-zinc-500 text-sm">
              Las acciones del equipo aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-white/[0.05]" />

            <div className="space-y-1">
              {activity.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex gap-6 pl-10 py-3 relative group"
                >
                  {/* Dot */}
                  <div
                    className={`absolute left-2.5 top-4 h-3 w-3 rounded-full -translate-x-1/2 border-2 border-[#0a0a0c] ${
                      ACTION_COLORS[item.action] || "bg-zinc-600"
                    }`}
                  />

                  <div className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 group-hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 shrink-0">
                          {item.profiles?.full_name?.[0] || "?"}
                        </div>
                        <p className="text-sm text-zinc-300">
                          <span className="font-bold text-white">
                            {item.profiles?.full_name || "Alguien"}
                          </span>{" "}
                          {ACTION_LABELS[item.action] || item.action}
                        </p>
                      </div>
                      <span className="text-[10px] text-zinc-600 whitespace-nowrap shrink-0">
                        {new Date(item.created_at ?? "").toLocaleString("es-MX", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="mt-2 pl-9">
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        {item.entity_type} • {item.space_id?.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
