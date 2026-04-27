"use client";

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Kanban, FolderUp, Users, Layout } from "lucide-react"
import { motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

export function FeaturesSection() {
    return (
        <section className="bg-[#030305] py-16 md:py-32 relative overflow-hidden">
            {/* Escarchado de fondo */}
            {/* <div className="absolute inset-0 z-0 opacity-30">
                <CanvasRevealEffect
                    animationSpeed={5}
                    containerClassName="bg-black"
                    colors={[[255, 255, 255]]}
                    dotSize={3}
                />
            </div> */}

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tighter">Todo lo que tu agencia necesita</h2>
                    <p className="text-zinc-400 max-w-xl mx-auto font-medium">Una suite completa de herramientas diseñadas para escalar tu comunicación y productividad con elegancia técnica.</p>
                </motion.div>

                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-4">
                        {/* Card 1: Spaces */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="col-span-full lg:col-span-2"
                        >
                            <Card className="relative h-full flex overflow-hidden border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-[#51DD7D]/50 transition-all duration-500 group">
                                <CardContent className="relative m-auto size-fit pt-8 text-center">
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#51DD7D]/20 bg-[#51DD7D]/5 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(81,221,125,0.05)]">
                                        <Layout className="size-10 text-[#51DD7D]" />
                                    </div>
                                    <h2 className="mt-8 text-2xl font-bold text-white tracking-tight">Spaces Ilimitados</h2>
                                    <p className="mt-3 text-zinc-500 text-sm px-4 font-medium">Un espacio dedicado para cada cliente o proyecto con acceso controlado y diseño exclusivo.</p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Card 2: Chat */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="col-span-full sm:col-span-3 lg:col-span-2"
                        >
                            <Card className="relative h-full overflow-hidden border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-[#51DD7D]/50 transition-all duration-500 group">
                                <CardContent className="pt-8 text-center">
                                    <div className="mx-auto flex size-20 items-center justify-center rounded-2xl border border-[#51DD7D]/20 bg-[#51DD7D]/5 group-hover:scale-110 transition-transform duration-500">
                                        <MessageSquare className="size-8 text-[#51DD7D]" />
                                    </div>
                                    <div className="mt-14 space-y-3">
                                        <h2 className="text-xl font-bold text-white tracking-tight">Chat en Realtime</h2>
                                        <p className="text-zinc-500 text-sm font-medium">Comunicación directa y profesional sin hilos de email infinitos.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Card 3: Kanban */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="col-span-full sm:col-span-3 lg:col-span-2"
                        >
                            <Card className="relative h-full overflow-hidden border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-[#51DD7D]/50 transition-all duration-500 group">
                                <CardContent className="pt-8 text-center">
                                    <div className="mx-auto flex size-20 items-center justify-center rounded-2xl border border-[#51DD7D]/20 bg-[#51DD7D]/5 group-hover:scale-110 transition-transform duration-500">
                                        <Kanban className="size-8 text-[#51DD7D]" />
                                    </div>
                                    <div className="mt-14 space-y-3">
                                        <h2 className="text-xl font-bold text-white tracking-tight">Tablero Kanban</h2>
                                        <p className="text-zinc-500 text-sm font-medium">Gestiona entregas y feedback de forma visual y sencilla.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Card 4: Files */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="col-span-full lg:col-span-3"
                        >
                            <Card className="relative h-full overflow-hidden border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-[#51DD7D]/50 transition-all duration-500 group">
                                <CardContent className="grid pt-8 sm:grid-cols-2">
                                    <div className="flex flex-col justify-between space-y-12">
                                        <div className="flex size-14 items-center justify-center rounded-2xl border border-[#51DD7D]/20 bg-[#51DD7D]/5 group-hover:scale-110 transition-transform duration-500">
                                            <FolderUp className="size-7 text-[#51DD7D]" strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-3">
                                            <h2 className="text-xl font-bold text-white tracking-tight">Archivos Compartidos</h2>
                                            <p className="text-zinc-500 text-sm font-medium">Repositorio seguro para activos, diseños y documentos finales.</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-center border-l border-white/[0.05] pl-6">
                                        <div className="space-y-4 w-full">
                                            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                                                <div className="size-8 rounded-lg bg-zinc-800" />
                                                <div className="h-2 w-20 bg-zinc-800 rounded" />
                                            </div>
                                            <div className="flex items-center gap-3 bg-[#51DD7D]/10 p-3 rounded-xl border border-[#51DD7D]/20 ml-6">
                                                <div className="size-8 rounded-lg bg-[#51DD7D]/40" />
                                                <div className="h-2 w-24 bg-[#51DD7D]/30 rounded" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Card 5: Roles */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="col-span-full lg:col-span-3"
                        >
                            <Card className="relative h-full overflow-hidden border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-[#51DD7D]/50 transition-all duration-500 group">
                                <CardContent className="flex flex-col justify-between h-full pt-8">
                                    <div className="flex size-14 items-center justify-center rounded-2xl border border-[#51DD7D]/20 bg-[#51DD7D]/5 group-hover:scale-110 transition-transform duration-500">
                                        <Users className="size-7 text-[#51DD7D]" strokeWidth={1.5} />
                                    </div>
                                    <div className="mt-12 space-y-3">
                                        <h2 className="text-xl font-bold text-white tracking-tight">Roles Especializados</h2>
                                        <p className="text-zinc-500 text-sm font-medium">Permisos diferenciados para Admins, Trabajadores y Clientes.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
