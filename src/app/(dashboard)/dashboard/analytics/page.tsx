"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "motion/react";

interface Stats {
  totalTasks: number;
  completedTasks: number;
  totalSpaces: number;
  totalMembers: number;
  urgentTasks: number;
  highTasks: number;
}

function StatCard({
  label,
  value,
  sub,
  color,
  delay,
}: {
  label: string;
  value: number | string;
  sub?: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-6 hover:bg-white/[0.05] transition-colors"
    >
      <div className={`text-4xl font-black tracking-tighter ${color}`}>
        {value}
      </div>
      <div className="text-sm font-bold text-white mt-2">{label}</div>
      {sub && (
        <div className="text-[11px] text-zinc-600 mt-1 uppercase tracking-widest font-bold">
          {sub}
        </div>
      )}
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const loadStats = useCallback(async () => {
    const [tasksRes, spacesRes, membersRes] = await Promise.all([
      supabase.from("tasks").select("id, priority, column_id"),
      supabase.from("spaces").select("id"),
      supabase.from("org_members").select("id"),
    ]);

    const tasks = tasksRes.data || [];
    setStats({
      totalTasks: tasks.length,
      completedTasks: 0, // Would need to join kanban_columns to find done columns
      totalSpaces: spacesRes.data?.length || 0,
      totalMembers: membersRes.data?.length || 0,
      urgentTasks: tasks.filter((t) => t.priority === "urgent").length,
      highTasks: tasks.filter((t) => t.priority === "high").length,
    });
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    const handle = requestAnimationFrame(() => loadStats());
    return () => cancelAnimationFrame(handle);
  }, [loadStats]);

  return (
    <div className="min-h-full bg-[#0a0a0c]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-2xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
          <div className="h-8 w-1 bg-[#51DD7D] rounded-full" />
          Métricas de Agencia
        </h1>
        <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-[0.2em] mt-1 ml-4">
          Resumen de rendimiento del equipo
        </p>
      </div>

      <div className="p-8 max-w-6xl mx-auto space-y-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Tareas Totales"
                value={stats?.totalTasks ?? 0}
                sub="En todos los espacios"
                color="text-[#51DD7D]"
                delay={0}
              />
              <StatCard
                label="Espacios Activos"
                value={stats?.totalSpaces ?? 0}
                sub="Proyectos en curso"
                color="text-blue-400"
                delay={0.05}
              />
              <StatCard
                label="Miembros del Equipo"
                value={stats?.totalMembers ?? 0}
                sub="Colaboradores activos"
                color="text-purple-400"
                delay={0.1}
              />
              <StatCard
                label="Tareas Urgentes"
                value={stats?.urgentTasks ?? 0}
                sub="Requieren atención inmediata"
                color="text-red-400"
                delay={0.15}
              />
            </div>

            {/* Priority breakdown */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6">
                Distribución por Prioridad
              </h2>
              <div className="space-y-4">
                {[
                  {
                    label: "Urgente",
                    value: stats?.urgentTasks ?? 0,
                    color: "bg-red-500",
                    total: stats?.totalTasks ?? 1,
                  },
                  {
                    label: "Alta",
                    value: stats?.highTasks ?? 0,
                    color: "bg-orange-500",
                    total: stats?.totalTasks ?? 1,
                  },
                  {
                    label: "Media / Baja",
                    value:
                      (stats?.totalTasks ?? 0) -
                      (stats?.urgentTasks ?? 0) -
                      (stats?.highTasks ?? 0),
                    color: "bg-[#51DD7D]",
                    total: stats?.totalTasks ?? 1,
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-4">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest w-24 shrink-0">
                      {row.label}
                    </span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${row.color}`}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.round((row.value / Math.max(row.total, 1)) * 100)}%`,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white w-8 text-right shrink-0">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
