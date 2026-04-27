"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/database";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  const loadProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
      setFullName(data.full_name || "");
      setJobTitle(data.job_title || "");
    }
  }, [supabase]);

  useEffect(() => {
    const handle = requestAnimationFrame(() => loadProfile());
    return () => cancelAnimationFrame(handle);
  }, [loadProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);

    await supabase
      .from("profiles")
      .update({ full_name: fullName, job_title: jobTitle })
      .eq("id", profile.id);

    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-full bg-[#0a0a0c]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-2xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
          <div className="h-8 w-1 bg-[#51DD7D] rounded-full" />
          Mi Perfil
        </h1>
        <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-[0.2em] mt-1 ml-4">
          Configuración de tu cuenta personal
        </p>
      </div>

      <div className="max-w-2xl mx-auto p-8 space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
          <div className="h-20 w-20 rounded-2xl bg-zinc-800 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt=""
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-2xl font-black text-zinc-500">
                {profile?.full_name?.[0]?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {profile?.full_name}
            </h2>
            <p className="text-sm text-zinc-500">{profile?.email}</p>
            <p className="text-[10px] text-zinc-700 mt-2 uppercase tracking-widest font-bold">
              {profile?.job_title || "Sin cargo definido"}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form
          onSubmit={handleSave}
          className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl space-y-6"
        >
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">
            Editar Información
          </h3>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Nombre Completo
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#51DD7D]/50 transition-colors"
              placeholder="Tu nombre completo"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Email
            </label>
            <input
              value={profile?.email || ""}
              readOnly
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-600 cursor-not-allowed"
            />
            <p className="text-[10px] text-zinc-700">
              El email no puede modificarse desde aquí.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Cargo / Rol
            </label>
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#51DD7D]/50 transition-colors"
              placeholder="ej. Diseñador Senior, Project Manager..."
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className={`px-8 font-bold min-w-[140px] transition-all ${
                saved
                  ? "bg-[#51DD7D]/20 text-[#51DD7D] border border-[#51DD7D]/30"
                  : "bg-[#51DD7D] text-black hover:bg-[#51DD7D]/90"
              }`}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saved ? (
                "✓ Guardado"
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
