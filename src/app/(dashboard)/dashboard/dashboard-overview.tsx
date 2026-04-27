"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Tables } from "@/types/database";
import { RecentTask } from "./page";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  LayoutGrid,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  owner: "CEO / Fundador",
  admin: "Administrador",
  worker: "Colaborador",
  client: "Cliente",
};

const ROLE_COLORS: Record<string, string> = {
  owner: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  admin: "text-[#51DD7D] bg-[#51DD7D]/10 border-[#51DD7D]/20",
  worker: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  client: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

const PRIORITY_CONFIG = {
  urgent: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10" },
  high: { icon: Zap, color: "text-orange-400", bg: "bg-orange-400/10" },
  normal: { icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
  low: { icon: CheckCircle2, color: "text-zinc-500", bg: "bg-zinc-500/10" },
};

interface DashboardOverviewProps {
  profile: Tables<"profiles"> | null;
  org: { id: string; name: string; plan: string } | null;
  role: string;
  spaces: { id: string; name: string; color: string | null; icon: string | null }[];
  recentTasks: RecentTask[];
  stats: { spaces: number; totalTasks: number };
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

export default function DashboardOverview({
  profile,
  org,
  role,
  spaces,
  recentTasks,
  stats,
}: DashboardOverviewProps) {
  const router = useRouter();
  const firstName = profile?.full_name?.split(" ")[0] || "Equipo";
  const roleLabel = ROLE_LABELS[role] || role;
  const roleColor = ROLE_COLORS[role] || ROLE_COLORS.worker;

  return (
    <div className="min-h-full bg-[#0a0a0c]">
      {/* Hero Header */}
      <div className="relative px-10 pt-12 pb-8 border-b border-white/[0.04] overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#51DD7D]/[0.03] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#51DD7D]/[0.04] rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

        <div className="relative flex items-start justify-between gap-8">
          <div>
            {/* Avatar + greeting */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden shrink-0 shadow-xl">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-black text-zinc-400">
                    {firstName[0]}
                  </div>
                )}
              </div>
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">
                  {getGreeting()}
                </p>
                <h1 className="text-3xl font-black text-white tracking-tight">
                  {firstName}
                </h1>
              </div>
            </div>

            {/* Org + Role badges */}
            <div className="flex items-center gap-3 flex-wrap">
              {org && (
                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2">
                  <div className="h-5 w-5 rounded-md bg-white flex items-center justify-center">
                    <span className="text-black font-black text-[10px]">
                      {org.name[0]}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white">{org.name}</span>
                  <span className="text-[10px] text-zinc-600 font-bold uppercase">
                    {org.plan || "Free"}
                  </span>
                </div>
              )}
              <div
                className={`flex items-center gap-1.5 border rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest ${roleColor}`}
              >
                {roleLabel}
              </div>
              {profile?.job_title && (
                <div className="text-xs text-zinc-600 font-bold uppercase tracking-widest px-4 py-2 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                  {profile.job_title}
                </div>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="hidden md:flex gap-4 shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center px-6 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl min-w-[100px]"
            >
              <div className="text-3xl font-black text-[#51DD7D]">
                {stats.spaces}
              </div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                Espacios
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-center px-6 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl min-w-[100px]"
            >
              <div className="text-3xl font-black text-white">
                {stats.totalTasks}
              </div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                Tareas
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="p-10 space-y-10 max-w-7xl mx-auto">
        {/* Quick Actions */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4">
            Acciones Rápidas
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/dashboard/spaces/new")}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#51DD7D] text-black font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-[#51DD7D]/90 transition-all shadow-[0_0_20px_rgba(81,221,125,0.2)]"
            >
              <Plus className="h-4 w-4" />
              Nuevo Espacio
            </button>
            <button
              onClick={() => router.push("/dashboard/kanban")}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] text-zinc-300 font-black text-[11px] uppercase tracking-widest rounded-xl border border-white/[0.08] hover:bg-white/[0.07] transition-all"
            >
              <LayoutGrid className="h-4 w-4" />
              Ver Kanban
            </button>
            <button
              onClick={() => router.push("/dashboard/teams")}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] text-zinc-300 font-black text-[11px] uppercase tracking-widest rounded-xl border border-white/[0.08] hover:bg-white/[0.07] transition-all"
            >
              <Users className="h-4 w-4" />
              Gestionar Equipo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Spaces */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                Mis Espacios ({stats.spaces})
              </p>
              <Link
                href="/dashboard/spaces/new"
                className="text-[10px] text-[#51DD7D] font-bold hover:underline"
              >
                + Nuevo
              </Link>
            </div>

            {spaces.length === 0 ? (
              <div
                onClick={() => router.push("/dashboard/spaces/new")}
                className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/[0.06] rounded-2xl text-zinc-700 cursor-pointer hover:border-white/10 hover:text-zinc-500 transition-all"
              >
                <Plus className="h-8 w-8 mb-2" />
                <p className="text-sm font-bold">Crea tu primer espacio</p>
                <p className="text-xs mt-1">
                  Organiza proyectos y clientes aquí
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {spaces.map((space, i) => (
                  <motion.div
                    key={space.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => router.push(`/dashboard/spaces/${space.id}`)}
                    className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer group"
                  >
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0 border border-white/[0.06]"
                      style={{
                        backgroundColor: space.color
                          ? `${space.color}18`
                          : "rgba(255,255,255,0.03)",
                        borderColor: space.color
                          ? `${space.color}30`
                          : undefined,
                      }}
                    >
                      {space.icon || "📁"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors truncate">
                        {space.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor: space.color || "#51DD7D",
                          }}
                        />
                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                          Activo
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                Tareas Recientes
              </p>
              <Link
                href="/dashboard/inbox"
                className="text-[10px] text-[#51DD7D] font-bold hover:underline"
              >
                Ver todas
              </Link>
            </div>

            {recentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/[0.06] rounded-2xl text-zinc-700">
                <CheckCircle2 className="h-8 w-8 mb-2" />
                <p className="text-sm font-bold">Sin tareas activas</p>
                <p className="text-xs mt-1">Todo al día 🎉</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentTasks.map((task, i) => {
                  const priority =
                    (task.priority as keyof typeof PRIORITY_CONFIG) || "normal";
                  const cfg =
                    PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.normal;
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => router.push("/dashboard/inbox")}
                      className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer group"
                    >
                      <div
                        className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors truncate">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {task.spaces?.name && (
                            <span className="text-[10px] font-bold text-[#51DD7D] bg-[#51DD7D]/10 px-1.5 py-0.5 rounded uppercase">
                              {task.spaces.name}
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                            {priority}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
