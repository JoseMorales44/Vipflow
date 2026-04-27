"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Building, 
  UserFollow, 
  CheckmarkFilled,
  WarningAlt,
  Rocket
} from "@carbon/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InvitePage() {
  const { id } = useParams();
  const router = useRouter();
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("worker");
  const [jobTitle, setJobTitle] = useState("");
  const [joining, setJoining] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadInvitation() {
      const { data, error: invError } = await supabase
        .from('invitations')
        .select('*, organizations(*)')
        .eq('id', id)
        .eq('status', 'pending')
        .single();
      
      if (invError || !data) {
        setError("Esta invitación no es válida o ya ha expirado.");
      } else {
        setInvitation(data);
        setRole(data.role); // Default to what the admin selected
      }
      setLoading(false);
    }
    loadInvitation();
  }, [id]);

  const handleJoin = async () => {
    setJoining(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // If not logged in, we should redirect to login first with this invite ID in state
      // For now, assume they need to be logged in (standard flow)
      router.push(`/login?returnTo=/invite/${id}`);
      return;
    }

    // 1. Update Profile
    await supabase
      .from('profiles')
      .update({ full_name: fullName, job_title: jobTitle })
      .eq('id', user.id);

    // 2. Join Org
    const { error: joinError } = await supabase
      .from('org_members')
      .insert({
        org_id: invitation.org_id,
        user_id: user.id,
        role: role,
      });

    if (joinError) {
      if (joinError.code === '23505') {
        setError("Ya eres miembro de esta organización.");
      } else {
        setError("Hubo un error al unirte. Por favor intenta de nuevo.");
      }
      setJoining(false);
      return;
    }

    // 3. Mark invitation as accepted
    await supabase
      .from('invitations')
      .update({ status: 'accepted' })
      .eq('id', id);

    router.push('/dashboard');
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-neutral-500 font-bold uppercase tracking-widest text-xs">Validando Invitación...</div>;

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-neutral-900 border-red-500/20">
          <CardContent className="pt-10 pb-10 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
              <WarningAlt size={32} className="text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Invitación No Válida</h2>
              <p className="text-neutral-500 text-sm">{error}</p>
            </div>
            <Button onClick={() => router.push('/')} variant="outline" className="w-full border-white/10 text-white">Volver al Inicio</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />

      <Card className="max-w-lg w-full bg-neutral-900/50 backdrop-blur-xl border-white/5 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <Building size={24} className="text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-white">
              Te han invitado a {invitation.organizations.name}
            </CardTitle>
            <CardDescription className="uppercase text-[10px] font-bold tracking-[0.2em] text-neutral-500 mt-2">
              Completa tu perfil para unirte al equipo
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Nombre Completo</Label>
              <Input 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Escribe tu nombre..."
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">¿Qué rol cumples?</Label>
              <div className="flex gap-2">
                {['worker', 'client'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all ${
                      role === r 
                        ? 'bg-primary border-primary text-black shadow-[0_0_15px_rgba(81,221,125,0.3)]' 
                        : 'bg-white/5 border-white/10 text-neutral-500 hover:text-white'
                    }`}
                  >
                    {r === 'worker' ? 'Trabajador / Talento' : 'Cliente / Stakeholder'}
                  </button>
                ))}
              </div>
            </div>

            {role === 'worker' && (
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Cargo / Especialidad</Label>
                <Input 
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Ej: Designer, Developer, Project Manager..."
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-primary/50"
                />
              </div>
            )}
          </div>

          <Button 
            onClick={handleJoin}
            disabled={!fullName || joining}
            className="w-full bg-primary text-black font-black uppercase tracking-widest text-[12px] h-14 rounded-xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {joining ? 'Procesando...' : 'Unirme a la Agencia'}
            <Rocket size={20} className="ml-2" />
          </Button>

          <p className="text-center text-[10px] text-neutral-600 font-medium">
            Al unirte, aceptas los términos de servicio de la organización.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
