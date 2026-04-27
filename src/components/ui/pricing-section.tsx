"use client";

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

const plans = [
  {
    name: "Starter",
    price: "0",
    description: "Ideal para freelancers que empiezan a colaborar.",
    features: ["Hasta 2 Spaces", "Chat básico", "Gestión de tareas", "1GB de almacenamiento"],
    buttonText: "Empezar Gratis",
    isPopular: false,
  },
  {
    name: "Agencia Pro",
    price: "49",
    description: "Todo lo que una agencia en crecimiento necesita.",
    features: ["Spaces ilimitados", "Chat Realtime", "Kanban Avanzado", "10GB almacenamiento", "Portal de Cliente"],
    buttonText: "Prueba Pro Gratis",
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: "129",
    description: "Control total y marca blanca para tu agencia.",
    features: ["Todo lo de Pro", "Marca Blanca (Logo propio)", "Soporte VIP", "Almacenamiento ilimitado", "Exportación de datos"],
    buttonText: "Hablar con Ventas",
    isPopular: false,
  },
]

export function PricingSection() {
  return (
    <section className="bg-black py-24 px-6 relative overflow-hidden">
      {/* Escarchado de fondo */}
      <div className="absolute inset-0 z-0 opacity-20">
          <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[[255, 255, 255]]}
              dotSize={2}
          />
      </div>

      <div className="mx-auto max-w-7xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">Planes para cada etapa</h2>
          <p className="mt-6 text-lg text-zinc-500 max-w-2xl mx-auto font-medium">Inversión transparente para agencias que buscan la excelencia operativa.</p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className={`relative flex flex-col rounded-3xl border p-10 transition-all duration-500 group ${plan.isPopular
                ? "border-[#51DD7D]/50 bg-white/[0.05] backdrop-blur-2xl shadow-[0_0_50px_rgba(81,221,125,0.1)]"
                : "border-white/[0.05] bg-white/[0.02] backdrop-blur-md hover:border-[#51DD7D]/30"
                }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#51DD7D] px-4 py-1 text-[10px] font-black text-black uppercase tracking-widest shadow-xl">
                  Más Popular
                </div>
              )}
              <div className="mb-10 text-left">
                <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                <p className="mt-6 flex items-baseline gap-x-2">
                  <span className="text-5xl font-black tracking-tighter text-white">${plan.price}</span>
                  <span className="text-sm font-bold text-zinc-600 uppercase tracking-widest">/mes</span>
                </p>
                <p className="mt-6 text-sm text-zinc-500 font-medium leading-relaxed min-h-[40px]">{plan.description}</p>
              </div>
              <ul className="mb-10 space-y-5 flex-1 text-left">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-x-4 text-[13px] text-zinc-400 font-medium">
                    <Check className="h-4 w-4 flex-none text-[#51DD7D]" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={plan.isPopular 
                    ? "w-full h-14 rounded-2xl bg-[#51DD7D] text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-[#51DD7D]/90 transition-all shadow-2xl" 
                    : "w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all"}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
