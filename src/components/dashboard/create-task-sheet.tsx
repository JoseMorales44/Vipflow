"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Calendar,
  UserPlus,
  Maximize2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
// import { Tables } from "@/types/database";

interface CreateTaskSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTaskSheet({ isOpen, onClose }: CreateTaskSheetProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [spaces, setSpaces] = useState<{ id: string; name: string }[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>("");

  const router = useRouter();
  const supabase = createClient();

  // Cargar los spaces disponibles
  useEffect(() => {
    if (isOpen) {
      async function loadSpaces() {
        const { data } = await supabase.from('spaces').select('id, name');
        if (data && data.length > 0) {
          setSpaces(data);
          setSelectedSpaceId(data[0].id);
        }
      }
      loadSpaces();
    }
  }, [isOpen, supabase]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedSpaceId) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // 1. Obtener la primera columna (por defecto) del space
      const { data: column } = await supabase
        .from('kanban_columns')
        .select('id')
        .eq('space_id', selectedSpaceId)
        .order('position', { ascending: true })
        .limit(1)
        .single();

      if (!column) throw new Error("No hay columnas en este espacio");

      // 2. Crear la tarea
      const { error } = await supabase.from('tasks').insert({
        title,
        description,
        priority,
        space_id: selectedSpaceId,
        column_id: column.id,
        created_by: user.id
      });

      if (error) throw error;

      // Éxito: Limpiar y cerrar
      setTitle("");
      setDescription("");
      onClose();
      router.refresh();
    } catch (error: unknown) {
      console.error("Error creating task:", error);
      const message = error instanceof Error ? error.message : "Error desconocido";
      alert(`Error al crear tarea: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
            className="fixed right-0 top-0 z-[60] h-full w-full max-w-lg border-l border-white/5 bg-[#0d0d0f] shadow-2xl"
          >
            <form onSubmit={handleCreateTask} className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-white/5 p-4">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Maximize2 className="h-4 w-4 hover:text-white cursor-pointer" />
                  <span className="text-xs font-medium uppercase tracking-widest text-[#51DD7D]">Añadir Tarea</span>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-white/5 text-zinc-500 hover:text-white">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Título de la tarea..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-2xl font-bold text-white placeholder:text-zinc-700 focus:outline-none"
                    autoFocus
                    required
                  />
                  <textarea
                    placeholder="Añade una descripción más detallada..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[120px] bg-transparent text-zinc-400 placeholder:text-zinc-800 resize-none focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Space / Proyecto</Label>
                    <select
                      value={selectedSpaceId}
                      onChange={(e) => setSelectedSpaceId(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-md p-2 text-sm text-zinc-300 focus:outline-none focus:border-[#51DD7D]/50"
                    >
                      {spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Prioridad</Label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-md p-2 text-sm text-zinc-300 focus:outline-none focus:border-[#51DD7D]/50"
                    >
                      <option value="none">Ninguna</option>
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="outline" size="sm" className="h-8 border-dashed border-white/10 bg-transparent text-zinc-500">
                    <Calendar className="h-3.5 w-3.5 mr-2" />
                    Fecha Límite
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="h-8 border-dashed border-white/10 bg-transparent text-zinc-500">
                    <UserPlus className="h-3.5 w-3.5 mr-2" />
                    Asignar
                  </Button>
                </div>
              </div>

              <div className="border-t border-white/5 p-6 bg-[#0a0a0c]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-medium">
                    <span className="px-2 py-0.5 rounded bg-white/5 uppercase tracking-tighter">Enter para guardar</span>
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">Cancelar</Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#51DD7D] text-black hover:bg-[#51DD7D]/90 px-8 font-bold min-w-[120px]"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear Tarea"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
