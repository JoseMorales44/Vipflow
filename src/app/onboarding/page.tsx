"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "motion/react";
import Image from "next/image";

export default function OnboardingPage() {
  const [orgName, setOrgName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // 1. Crear la Organización (Agencia)
      const slug = orgName.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: orgName,
          slug: slug,
          owner_id: user.id,
          plan: "free"
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // 2. Añadir al creador como Owner en org_members
      await supabase.from("org_members").insert({
        org_id: org.id,
        user_id: user.id,
        role: "owner"
      });

      // 3. Crear el primer Space por defecto ("General")
      const { data: space, error: spaceError } = await supabase
        .from("spaces")
        .insert({
          org_id: org.id,
          name: "General",
          description: "Espacio central para la comunicación del equipo.",
          created_by: user.id
        })
        .select()
        .single();

      if (spaceError) throw spaceError;

      // 4. Crear la primera columna Kanban
      await supabase.from("kanban_columns").insert({
        space_id: space.id,
        name: "Pendientes",
        position: 0,
        color: "#51DD7D"
      });

      // ¡Todo listo! Redirigir al dashboard
      router.push("/dashboard/inbox");
      router.refresh();
    } catch (error: unknown) {
      console.error("Error during setup:", error);
      const message = error instanceof Error ? error.message : "Error desconocido";
      alert(`Error al configurar: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0c] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-10">
          <Image src="/images/logo-VIP.png" alt="Logo" width={180} height={50} className="object-contain" />
        </div>

        <Card className="border-white/5 bg-[#141414] shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white text-center">Configura tu Agencia</CardTitle>
            <CardDescription className="text-zinc-500 text-center">
              Empecemos por darle un nombre a tu nuevo centro de operaciones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="orgName" className="text-zinc-400">Nombre de tu Agencia</Label>
                <Input
                  id="orgName"
                  placeholder="Ej: Marketing VIP, Creative Lab..."
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white h-12"
                  disabled={isLoading}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#51DD7D] text-black hover:bg-[#51DD7D]/90 h-12 font-bold text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    Configurando...
                  </span>
                ) : (
                  "Comenzar mi aventura"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-zinc-600 text-xs uppercase tracking-widest">
          VipFlow — Potenciando Agencias Creativas
        </p>
      </motion.div>
    </div>
  );
}
