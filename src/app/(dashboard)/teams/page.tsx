"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  UserMultiple, 
  AddLarge, 
  Copy, 
  Checkmark,
  UserAvatar,
  TrashCan
} from "@carbon/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Tables } from "@/types/database";

type MemberWithProfile = Tables<'org_members'> & {
  profiles: Tables<'profiles'> | null;
};

export default function TeamsPage() {
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [org, setOrg] = useState<Tables<'organizations'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteRole, setInviteRole] = useState<string>("worker");
  const [inviteLink, setInviteLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  const generateInvite = async () => {
    if (!org) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('invitations')
      .insert({
        org_id: org.id,
        role: inviteRole,
        invited_by: user.id,
      })
      .select()
      .single();

    if (data && !error) {
      const url = `${window.location.origin}/invite/${data.id}`;
      requestAnimationFrame(() => setInviteLink(url));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: membership } = await supabase
      .from('org_members')
      .select('org_id, role, organizations(*)')
      .eq('user_id', user.id)
      .single();
    
    if (membership) {
      setOrg(membership.organizations as unknown as Tables<'organizations'>);
      
      const { data: membersData } = await supabase
        .from('org_members')
        .select('*, profiles(*)')
        .eq('org_id', membership.org_id);
      
      if (membersData) setMembers(membersData as MemberWithProfile[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      loadData();
    });
    return () => cancelAnimationFrame(handle);
  }, [loadData]);

  if (loading) return <div className="p-8 text-neutral-500">Cargando equipo...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
            <UserMultiple size={32} className="text-primary" />
            Gestión de Equipo
          </h1>
          <p className="text-neutral-500 font-bold uppercase tracking-[0.2em] mt-1">
            {org?.name || 'Agencia'} — Miembros y Colaboradores
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Generador de Invitaciones */}
        <Card className="md:col-span-1 bg-neutral-900 border-white/5 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AddLarge size={20} className="text-primary" />
              Invitar Nuevo Miembro
            </CardTitle>
            <CardDescription>
              Genera un enlace único para que alguien se una a tu agencia.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Rol Sugerido</label>
              <div className="flex gap-2">
                {['worker', 'client', 'admin'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setInviteRole(r)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${
                      inviteRole === r 
                        ? 'bg-primary border-primary text-black shadow-[0_0_15px_rgba(81,221,125,0.3)]' 
                        : 'bg-white/5 border-white/10 text-neutral-500 hover:text-white'
                    }`}
                  >
                    {r === 'worker' ? 'Trabajador' : r === 'client' ? 'Cliente' : 'Admin'}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={generateInvite}
              className="w-full bg-primary text-black font-black uppercase tracking-widest text-[11px] h-12 rounded-xl"
            >
              Generar Enlace
            </Button>

            {inviteLink && (
              <div className="mt-4 p-4 bg-black rounded-xl border border-white/10 space-y-3">
                <p className="text-[10px] text-neutral-500 truncate">{inviteLink}</p>
                <Button 
                  onClick={copyToClipboard}
                  variant="outline" 
                  className="w-full border-white/10 text-white gap-2 h-10 text-[11px] font-bold"
                >
                  {copied ? <Checkmark size={16} className="text-primary" /> : <Copy size={16} />}
                  {copied ? 'Copiado' : 'Copiar Enlace'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista de Miembros */}
        <Card className="md:col-span-2 bg-neutral-900 border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Miembros Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10 overflow-hidden">
                      {m.profiles?.avatar_url ? (
                        <Image src={m.profiles.avatar_url} alt="" width={40} height={40} className="h-full w-full object-cover" />
                      ) : (
                        <UserAvatar size={20} className="text-neutral-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-none">{m.profiles?.full_name}</h4>
                      <p className="text-xs text-neutral-500 mt-1">{m.profiles?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={`uppercase text-[9px] font-black tracking-widest ${
                      m.role === 'owner' ? 'border-yellow-500/50 text-yellow-500' : 
                      m.role === 'admin' ? 'border-primary/50 text-primary' : 
                      'border-white/10 text-neutral-400'
                    }`}>
                      {m.role}
                    </Badge>
                    {m.role !== 'owner' && (
                      <button className="p-2 text-neutral-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <TrashCan size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
