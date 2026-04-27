"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NewSpacePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#51DD7D");
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState<string>("");
  const router = useRouter();
  const supabase = createClient();

  const COLORS = [
    "#51DD7D", "#3B82F6", "#A855F7", "#F59E0B",
    "#EF4444", "#EC4899", "#14B8A6", "#F97316",
  ];

  const loadOrg = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("org_members")
      .select("org_id")
      .eq("user_id", user.id)
      .single();
    if (data) setOrgId(data.org_id);
  }, [supabase]);

  useEffect(() => {
    const handle = requestAnimationFrame(() => loadOrg());
    return () => cancelAnimationFrame(handle);
  }, [loadOrg]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !orgId) return;
    setIsLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsLoading(false); return; }

    const { data, error } = await supabase
      .from("spaces")
      .insert({ name: name.trim(), description, color, org_id: orgId, created_by: user.id })
      .select()
      .single();

    setIsLoading(false);
    if (data && !error) {
      router.push(`/dashboard/spaces/${data.id}`);
    }
  };

  return (
    <div className="min-h-full bg-[#0a0a0c]">
      <div className="px-8 py-6 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-2xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
          <div className="h-8 w-1 bg-[#51DD7D] rounded-full" />
          Nuevo Espacio
        </h1>
        <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-[0.2em] mt-1 ml-4">
          Crea un espacio de trabajo para tu equipo o cliente
        </p>
      </div>

      <div className="max-w-lg mx-auto p-8">
        <form onSubmit={handleCreate} className="space-y-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">
            Información del Espacio
          </h3>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Nombre del Espacio *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="ej. Proyecto Coca-Cola, Rediseño Web..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#51DD7D]/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe brevemente el propósito de este espacio..."
              rows={3}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#51DD7D]/50 transition-colors resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Color del Espacio
            </label>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    color === c ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="px-8 py-2.5 bg-[#51DD7D] text-black font-black rounded-xl text-sm hover:bg-[#51DD7D]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Crear Espacio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
