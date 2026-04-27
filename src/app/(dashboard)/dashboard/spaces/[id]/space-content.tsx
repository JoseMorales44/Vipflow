"use client";

import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Search,
  Settings,
  Users,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TaskDetailSheet } from "@/components/dashboard/task-detail-sheet";
import { SpaceChat } from "@/components/dashboard/space-chat";
import { AgentPlan } from "@/components/ui/agent-plan";
import { Tables } from "@/types/database";

import { Column } from "@/types/dashboard";
import { SpaceMember } from "./page";
import Image from "next/image";

interface SpaceContentProps {
  space: Tables<'spaces'>;
  columns: Column[];
  members: SpaceMember[];
}

export function SpaceContent({ space, columns, members }: SpaceContentProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'board' | 'chat' | 'roadmap'>('board');

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Space Header */}
      <div className="flex items-center justify-between px-10 py-8 border-b border-white/[0.03] bg-white/[0.01]">
        <div className="flex items-center gap-6">
          <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-2xl shadow-inner">
            {space.icon || '📁'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-none">{space.name}</h1>
            <p className="text-zinc-500 text-xs mt-2 font-medium tracking-wide uppercase">{space.description || 'Sin descripción'}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex -space-x-3 mr-4">
            {members.slice(0, 4).map((m) => (
              <div
                key={m.id}
                title={m.profiles?.full_name || ''}
                className="h-8 w-8 rounded-full border-2 border-black bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-400 overflow-hidden"
              >
                {m.profiles?.avatar_url ? (
                  <Image src={m.profiles.avatar_url} alt={m.profiles.full_name} width={32} height={32} className="object-cover" />
                ) : (
                  <span>{m.profiles?.full_name?.[0]?.toUpperCase() || '?'}</span>
                )}
              </div>
            ))}
            {members.length === 0 && (
              <div className="h-8 w-8 rounded-full border-2 border-black bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-600">+</div>
            )}
            <div className="h-8 w-8 rounded-full border-2 border-black bg-white flex items-center justify-center text-[10px] font-bold text-black cursor-pointer hover:scale-110 transition-transform">
              <Plus className="h-3 w-3" />
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-white/[0.03] border-white/[0.08] text-zinc-400 h-9 rounded-xl hover:bg-white/[0.06] hover:text-white transition-all">
            <Users className="h-4 w-4 mr-2" />
            Equipo
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 bg-white/[0.03] border-white/[0.08] text-zinc-400 rounded-xl hover:bg-white/[0.06] hover:text-white transition-all">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Board Controls / Tabs */}
      <div className="flex items-center gap-8 px-10 py-2 border-b border-white/[0.03]">
        <button
          onClick={() => setActiveTab('board')}
          className={cn(
            "flex items-center gap-2 text-xs font-bold py-4 border-b-2 transition-all relative",
            activeTab === 'board'
              ? "text-white border-white"
              : "text-zinc-600 border-transparent hover:text-zinc-400"
          )}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          Tablero
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            "flex items-center gap-2 text-xs font-bold py-4 border-b-2 transition-all",
            activeTab === 'chat'
              ? "text-white border-white"
              : "text-zinc-600 border-transparent hover:text-zinc-400"
          )}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Canal de Chat
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={cn(
            "flex items-center gap-2 text-xs font-bold py-4 border-b-2 transition-all",
            activeTab === 'roadmap'
              ? "text-white border-white"
              : "text-zinc-600 border-transparent hover:text-zinc-400"
          )}
        >
          <Milestone className="h-3.5 w-3.5" />
          Roadmap
        </button>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
            <input type="text" placeholder="Buscar en este espacio..." className="h-9 w-64 bg-transparent border border-white/[0.05] rounded-xl pl-9 pr-4 text-xs text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800" />
          </div>
        </div>
      </div>

      <div className={cn("flex-1", activeTab === 'board' ? "overflow-x-auto overflow-y-hidden" : "overflow-hidden")}>
        {activeTab === 'board' ? (
          /* Kanban Board */
          <div className="flex gap-8 h-full items-start p-10 overflow-x-auto custom-scrollbar min-w-max bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.02)_0%,_transparent_100%)]">
            {columns?.map((column) => (
              <div key={column.id} className="w-80 flex flex-col h-full bg-white/[0.01] rounded-3xl border border-white/[0.03] overflow-hidden group/column">
                <div className="p-5 flex items-center justify-between border-b border-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] bg-white" />
                    <h2 className="text-xs font-black text-white uppercase tracking-[0.1em]">{column.name}</h2>
                    <span className="text-[10px] font-bold text-zinc-600 bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/[0.05]">
                      {column.tasks?.length || 0}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-700 hover:text-white transition-colors opacity-0 group-hover/column:opacity-100">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {column.tasks?.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl hover:border-white/20 hover:bg-white/[0.04] hover:scale-[1.02] transition-all cursor-pointer group/card shadow-2xl"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-[13px] font-bold text-zinc-300 group-hover/card:text-white transition-colors leading-relaxed">
                          {task.title}
                        </h3>
                        <MoreHorizontal className="h-4 w-4 text-zinc-800 opacity-0 group-hover/card:opacity-100 transition-opacity shrink-0" />
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-zinc-600 line-clamp-2 mb-4 leading-relaxed font-medium">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-1.5">
                          <div className="h-6 w-6 rounded-full bg-zinc-900 border border-black shadow-lg" />
                        </div>
                        <div className={cn(
                          "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter border",
                          task.priority === 'urgent' ? 'bg-red-500/5 text-red-500 border-red-500/10' :
                            task.priority === 'high' ? 'bg-orange-500/5 text-orange-500 border-orange-500/10' :
                              'bg-zinc-800/50 text-zinc-500 border-white/[0.03]'
                        )}>
                          {task.priority}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button className="w-full py-4 rounded-2xl border border-dashed border-white/[0.03] text-zinc-700 hover:border-white/10 hover:text-zinc-500 transition-all text-[11px] font-bold uppercase tracking-widest">
                    + Añadir Tarea
                  </button>
                </div>
              </div>
            ))}

            <button className="w-80 h-16 shrink-0 rounded-3xl border border-dashed border-white/[0.03] flex items-center justify-center gap-3 text-zinc-700 hover:border-white/10 hover:text-zinc-400 transition-all text-xs font-black uppercase tracking-widest bg-white/[0.005]">
              <Plus className="h-4 w-4" />
              Nueva Columna
            </button>
          </div>
        ) : activeTab === 'chat' ? (
          <SpaceChat spaceId={space.id} />
        ) : (
          <div className="p-10 h-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.01)_0%,_transparent_100%)]">
            <AgentPlan />
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <TaskDetailSheet taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </div>
  );
}

function MessageSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
  )
}

function Milestone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
  )
}
