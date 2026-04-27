"use client";

import { useState } from "react";

const NOTIFICATION_PREFS = [
  { id: "task_assigned", label: "Nueva tarea asignada", description: "Cuando alguien te asigne una tarea", defaultOn: true },
  { id: "task_comment", label: "Comentarios en tareas", description: "Cuando alguien comente en una tarea tuya", defaultOn: true },
  { id: "mention", label: "Menciones", description: "Cuando alguien te mencione en un comentario", defaultOn: true },
  { id: "invite_accepted", label: "Invitación aceptada", description: "Cuando alguien acepte tu invitación", defaultOn: false },
  { id: "space_update", label: "Actualizaciones de Espacio", description: "Cambios en los espacios donde participas", defaultOn: false },
  { id: "weekly_digest", label: "Resumen Semanal", description: "Un email con el resumen de actividad de la semana", defaultOn: true },
];

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_PREFS.map((p) => [p.id, p.defaultOn]))
  );

  const toggle = (id: string) =>
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-full bg-[#0a0a0c]">
      <div className="px-8 py-6 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-2xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
          <div className="h-8 w-1 bg-[#51DD7D] rounded-full" />
          Preferencias de Notificaciones
        </h1>
        <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-[0.2em] mt-1 ml-4">
          Controla qué notificaciones recibes y cuándo
        </p>
      </div>
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl divide-y divide-white/[0.04]">
          {NOTIFICATION_PREFS.map((pref) => (
            <div key={pref.id} className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
              <div>
                <p className="text-sm font-bold text-white">{pref.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{pref.description}</p>
              </div>
              <button
                onClick={() => toggle(pref.id)}
                className={`relative h-6 w-11 rounded-full transition-all duration-300 shrink-0 ${
                  prefs[pref.id] ? "bg-[#51DD7D]" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
                    prefs[pref.id] ? "left-5.5 translate-x-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-zinc-700 text-center mt-4 uppercase tracking-widest font-bold">
          Las preferencias se guardan automáticamente
        </p>
      </div>
    </div>
  );
}
