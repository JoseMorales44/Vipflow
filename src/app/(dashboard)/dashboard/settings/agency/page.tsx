"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/database";
import { Loader2 } from "lucide-react";

export default function AgencySettingsPage() {
  const [org, setOrg] = useState<Tables<"organizations"> | null>(null);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  const loadOrg = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: membership } = await supabase
      .from("org_members")
      .select("organizations(*)")
      .eq("user_id", user.id)
      .single();
    if (membership?.organizations) {
      const o = membership.organizations as unknown as Tables<"organizations">;
      setOrg(o);
      setName(o.name || "");
    }
  }, [supabase]);

  useEffect(() => {
    const handle = requestAnimationFrame(() => loadOrg());
    return () => cancelAnimationFrame(handle);
  }, [loadOrg]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    setIsSaving(true);
    await supabase.from("organizations").update({ name }).eq("id", org.id);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-full bg-[#0a0a0c]">
      <div className="px-8 py-6 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-2xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
          <div className="h-8 w-1 bg-[#51DD7D] rounded-full" />
          Configuración de Agencia
        </h1>
        <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-[0.2em] mt-1 ml-4">
          Administración de la organización
        </p>
      </div>
      <div className="max-w-2xl mx-auto p-8">
        <form onSubmit={handleSave} className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Datos de la Organización</h3>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nombre de Agencia</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#51DD7D]/50 transition-colors"
              placeholder="Nombre de tu agencia"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Plan Actual</label>
            <div className="px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
              <span className="text-sm text-zinc-400">{org?.plan || "Free"}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#51DD7D] bg-[#51DD7D]/10 px-2 py-1 rounded-lg">Activo</span>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} className={`px-8 font-bold min-w-[140px] transition-all ${saved ? "bg-[#51DD7D]/20 text-[#51DD7D] border border-[#51DD7D]/30" : "bg-[#51DD7D] text-black hover:bg-[#51DD7D]/90"}`}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? "✓ Guardado" : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
