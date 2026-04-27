"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { CreateTaskSheet } from "@/components/dashboard/create-task-sheet";
import { TaskDetailSheet } from "@/components/dashboard/task-detail-sheet";
import { Tables } from "@/types/database";

type TaskWithSpace = Tables<'tasks'> & {
  spaces: { name: string } | null;
};

export function InboxContent({ filter }: { filter?: 'starred' | 'archive' }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskWithSpace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTasks() {
      const { data } = await supabase
        .from('tasks')
        .select(`*, spaces(name)`)
        .order('created_at', { ascending: false });

      setTasks((data as unknown as TaskWithSpace[]) || []);
      setIsLoading(false);
    }
    fetchTasks();
  }, [supabase]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c]">
      {/* Inbox Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#51DD7D]/10 flex items-center justify-center">
              <InboxIcon className="h-4 w-4 text-[#51DD7D]" />
            </div>
                <h1 className="text-xl font-bold text-white">
              {filter === 'starred' ? 'Destacados' : filter === 'archive' ? 'Archivados' : 'Inbox'}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar en pendientes..." 
              className="h-9 w-64 bg-white/5 border border-white/5 rounded-full pl-9 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#51DD7D]/30 transition-all"
            />
          </div>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-[#51DD7D] text-black hover:bg-[#51DD7D]/90 h-9 px-4 font-bold rounded-full text-xs"
          >
            <Plus className="h-4 w-4 mr-1" />
            Nueva Tarea
          </Button>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex items-center gap-8 px-8 py-2 border-b border-white/5 bg-white/[0.01]">
        <button className="h-10 text-[11px] font-bold uppercase tracking-widest text-[#51DD7D] border-b-2 border-[#51DD7D]">Pendientes ({tasks.length})</button>
        <button className="h-10 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors">Completado</button>
        <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold text-zinc-500 hover:text-white">
                <Filter className="h-3 w-3 mr-2" />
                Filtrar
            </Button>
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-full animate-pulse bg-white/5 rounded-xl border border-white/5" />
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setSelectedTaskId(task.id)
                }}
                className="group flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-xl hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer"
              >
                <div className="h-6 w-6 rounded-full border-2 border-zinc-700 flex items-center justify-center group-hover:border-[#51DD7D] transition-colors">
                  <div className="h-2 w-2 rounded-full bg-[#51DD7D] scale-0 group-hover:scale-100 transition-transform" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{task.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-[#51DD7D] bg-[#51DD7D]/10 px-1.5 py-0.5 rounded uppercase">
                        {task.spaces?.name || 'General'}
                    </span>
                    <span className="text-[10px] text-zinc-600 tracking-tight">• Creado recientemente</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-6 w-6 rounded bg-white/5 flex items-center justify-center">
                    <MoreHorizontal className="h-3.5 w-3.5 text-zinc-600" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-xl font-bold text-white mb-2">Tu bandeja está al día</h2>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">No hay tareas pendientes en este momento.</p>
          </div>
        )}
      </div>

      <CreateTaskSheet isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <TaskDetailSheet taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </div>
  );
}

function InboxIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
    )
}
