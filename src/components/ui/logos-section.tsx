"use client";

import { motion } from "motion/react";

export function LogosSection() {
    return (
        <section className="bg-[#030305] py-12 border-y border-white/5 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="mx-auto max-w-7xl px-6"
            >
                <p className="text-center text-sm font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-8">
                    Agencias que ya confían en VipFlow
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    {["AGENCY.CO", "CREATIVE_LAB", "MARKET_PRO", "DESIGN_STUDIO", "VIBE_MEDIA"].map((logo, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 + 0.3 }}
                            viewport={{ once: true }}
                            className="text-2xl font-bold text-white tracking-tighter"
                        >
                            {logo}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
