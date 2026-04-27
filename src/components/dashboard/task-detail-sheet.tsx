"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Calendar, 
  Send,
  MoreHorizontal,
  Paperclip,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types/database";
import { useCallback } from "react";

type TaskWithProfile = Tables<'tasks'> & {
  profiles: { full_name: string; avatar_url: string | null } | null;
};

type CommentWithProfile = Tables<'task_comments'> & {
  profiles: { full_name: string; avatar_url: string | null } | null;
};

interface TaskDetailSheetProps {
  taskId: string | null;
  onClose: () => void;
}

export function TaskDetailSheet({ taskId, onClose }: TaskDetailSheetProps) {
  const [task, setTask] = useState<TaskWithProfile | null>(null);
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const loadTaskDetails = useCallback(async () => {
    if (!taskId) return;
    setIsLoading(true);
    // 1. Cargar la tarea
    const { data: taskData } = await supabase
      .from('tasks')
      .select(`*, profiles:created_by(full_name, avatar_url)`)
      .eq('id', taskId)
      .single();
    
    setTask(taskData as TaskWithProfile);

    // 2. Cargar comentarios
    const { data: commentData } = await supabase
      .from('task_comments')
      .select(`*, profiles:user_id(full_name, avatar_url)`)
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });
    
    setComments((commentData as CommentWithProfile[]) || []);
    setIsLoading(false);
  }, [taskId, supabase]);

  useEffect(() => {
    if (taskId) {
      const handle = requestAnimationFrame(() => loadTaskDetails());
      return () => cancelAnimationFrame(handle);
    }
  }, [taskId, loadTaskDetails]);

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !taskId) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('task_comments').insert({
      task_id: taskId,
      user_id: user.id,
      content: newComment,
      is_internal: true
    });

    if (!error) {
      requestAnimationFrame(() => setNewComment(""));
      loadTaskDetails(); // Recargar para ver el nuevo comentario
    }
  };

  if (!taskId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 z-[60] h-full w-full max-w-2xl border-l border-white/5 bg-[#0d0d0f] shadow-2xl flex flex-col"
      >
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#51DD7D] border-t-transparent" />
          </div>
        ) : task && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-4 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Marcar Completa
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-zinc-500 hover:text-white">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Task Content */}
              <div className="p-8 space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-4">{task.title}</h1>
                  <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">
                    {task.description || "Sin descripción adicional."}
                  </p>
                </div>

                {/* Meta Attributes */}
                <div className="grid grid-cols-2 gap-8 py-6 border-y border-white/5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 w-24">Creado por</span>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-zinc-800" />
                        <span className="text-sm text-white">{task.profiles?.full_name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 w-24">Prioridad</span>
                      <div className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter",
                        task.priority === 'urgent' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                      )}>
                        {task.priority}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 w-24">Fecha</span>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Sin fecha límite</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity / Comments Section */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#51DD7D]" />
                    Actividad y Comentarios
                  </h3>
                  
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4">
                        <div className="h-8 w-8 rounded-lg bg-zinc-800 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-white">{comment.profiles?.full_name}</span>
                            <span className="text-[10px] text-zinc-600">{new Date(comment.created_at ?? '').toLocaleString()}</span>
                          </div>
                          <div className="text-sm text-zinc-400 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Comment Input Footer */}
            <div className="p-6 bg-[#0a0a0c] border-t border-white/5">
              <form onSubmit={handleSendComment} className="relative">
                <textarea
                  placeholder="Escribe un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 pr-24 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#51DD7D]/50 resize-none min-h-[100px]"
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-white">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button type="submit" className="bg-[#51DD7D] text-black hover:bg-[#51DD7D]/90 font-bold h-9 px-4">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
