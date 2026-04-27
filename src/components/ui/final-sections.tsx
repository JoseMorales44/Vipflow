"use client";

import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="bg-[#030305] py-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-[#51DD7D] px-8 py-20 text-center shadow-2xl"
        >
          {/* Decoración abstracta de fondo */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-8 uppercase">
              ¿Listo para escalar <br /> tu agencia?
            </h2>
            <p className="text-black/70 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
              Únete a las agencias que ya han profesionalizado su flujo de trabajo. Empieza hoy mismo tu prueba gratuita de 14 días.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="bg-black text-[#51DD7D] hover:bg-black/90 text-xl font-bold px-12 h-16 rounded-none">
                  Empezar Ahora <MoveRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-black/20 text-black hover:bg-black/5 text-xl font-bold px-12 h-16 rounded-none">
                  Ver Demo
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const faqs = [
    { q: "¿Puedo personalizar VipFlow con mi propio logo?", a: "Sí, el plan Enterprise incluye marca blanca total para que tus clientes vean tu propia identidad." },
    { q: "¿Cuántos clientes puedo invitar?", a: "Depende de tu plan. El plan Agencia Pro ofrece clientes ilimitados para que escales sin restricciones." },
    { q: "¿Es seguro compartir archivos sensibles?", a: "Absolutamente. Usamos encriptación de nivel bancario y el almacenamiento seguro de Supabase para proteger tu data." },
    { q: "¿Tienen soporte técnico?", a: "Sí, contamos con soporte 24/7 para nuestros planes Pro y Enterprise para asegurar que tu agencia nunca se detenga." }
  ];

  return (
    <section className="bg-[#030305] py-24 px-6 border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold text-[#51DD7D] uppercase tracking-widest mb-4">FAQ</h2>
            <h3 className="text-4xl font-bold text-white tracking-tight">Preguntas frecuentes</h3>
            <p className="mt-4 text-zinc-400">¿Tienes más dudas? Escríbenos directamente al chat de soporte.</p>
          </motion.div>
          <div className="space-y-8">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="border-b border-white/5 pb-8"
              >
                <h4 className="text-lg font-bold text-white mb-2">{faq.q}</h4>
                <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
