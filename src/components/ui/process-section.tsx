"use client";

import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Crea tu Space",
    description: "Configura un espacio dedicado para tu cliente en segundos. Sube tu logo y personaliza el entorno."
  },
  {
    number: "02",
    title: "Invita a tu Cliente",
    description: "Envía un acceso directo a tu cliente. Sin registros complicados, comunicación directa desde el primer minuto."
  },
  {
    number: "03",
    title: "Gestiona y Entrega",
    description: "Comparte archivos, chatea en tiempo real y mueve tareas en el tablero Kanban hasta completar el proyecto."
  }
];

export function ProcessSection() {
  return (
    <section className="bg-[#030305] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 text-left max-w-2xl">
          <h2 className="text-sm font-bold text-[#51DD7D] uppercase tracking-widest mb-4">El Proceso</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">De la idea a la entrega en tiempo récord</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="text-7xl font-black text-white/5 absolute -top-10 -left-4 group-hover:text-[#51DD7D]/10 transition-colors">
                {step.number}
              </div>
              <div className="relative z-10">
                <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-[#51DD7D] transition-colors">{step.title}</h4>
                <p className="text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
