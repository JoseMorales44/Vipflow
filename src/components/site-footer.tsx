"use client";

import Link from "next/link";
import { Mail, Instagram, Facebook, Linkedin, Youtube, Heart } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation = {
  categories: [
    {
      id: "about",
      name: "Acerca de",
      items: [
        { name: "Qué es VipFlow", href: "/about" },
        { name: "Casos de éxito", href: "/works" },
        { name: "Precios", href: "/pricing" },
      ],
    },
    {
      id: "features",
      name: "Funciones",
      items: [
        { name: "Spaces", href: "/features/spaces" },
        { name: "Chat Realtime", href: "/features/chat" },
        { name: "Gestión Kanban", href: "/features/kanban" },
      ],
    },
    {
      id: "dashboard",
      name: "Plataforma",
      items: [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Portal Cliente", href: "/client-portal" },
        { name: "Seguridad", href: "/security" },
      ],
    },
    {
      id: "company",
      name: "Compañía",
      items: [
        { name: "Contacto", href: "/contact" },
        { name: "Términos", href: "/terms" },
        { name: "Privacidad", href: "/privacy" },
      ],
    },
  ],
};

const iconStyle = "hover:-translate-y-1 border border-white/5 rounded-xl p-2.5 transition-all hover:bg-white/5 text-zinc-400 hover:text-[#51DD7D]";

export function SiteFooter() {
  return (
    <footer className="bg-[#000000] border-t border-white/5 px-6 pt-16 pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:flex md:items-start gap-12 mb-16">
          <div className="md:w-1/3">
            <Link href="/" className="inline-block mb-6">
              <div className="relative h-10 w-40">
                <Image
                  src="/images/logo-VIP.png"
                  alt="Marketing VIP Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              VipFlow es la herramienta diseñada por agencias para agencias. Nuestra misión es transformar la forma en que colaboras con tus clientes, eliminando el ruido y centralizando lo que importa: resultados.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {navigation.categories.map((category) => (
              <div key={category.id}>
                <h3 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">{category.name}</h3>
                <ul className="space-y-4">
                  {category.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-zinc-400 hover:text-[#51DD7D] transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 pb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <Link href="#" className={iconStyle}><Mail className="h-5 w-5" /></Link>
              <Link href="#" className={iconStyle}><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className={iconStyle}><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className={iconStyle}><Linkedin className="h-5 w-5" /></Link>
              <Link href="#" className={iconStyle}><Youtube className="h-5 w-5" /></Link>
            </div>

            <ThemeToggle />
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-zinc-500">
          <div className="flex flex-wrap items-center justify-center gap-1">
            <span>© {new Date().getFullYear()}</span>
            <span className="font-bold text-white mx-1">VipFlow</span>
            <span>— Hecho con</span>
            <Heart className="text-[#51DD7D] h-3 w-3 fill-[#51DD7D]" />
            <span>por</span>
            <Link href="https://marketingvip.com" className="text-white hover:text-[#51DD7D] font-bold underline underline-offset-4">Marketing VIP</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
