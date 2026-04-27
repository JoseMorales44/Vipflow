"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Inbox, 
  LayoutDashboard, 
  Settings, 
  Users, 
  Plus, 
  ChevronDown,
  Bell,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types/database";

const mainNav = [
  { name: "Inicio", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inbox", href: "/dashboard/inbox", icon: Inbox },
  { name: "Mi Equipo", href: "/dashboard/teams", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const [spaces, setSpaces] = useState<Tables<'spaces'>[]>([]);
  const [org, setOrg] = useState<Tables<'organizations'> | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadSidebarData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: memberships } = await supabase
        .from('org_members')
        .select('org_id, organizations(*)')
        .eq('user_id', user.id)
        .limit(1);
      
      let currentOrg = null;

      if (memberships && memberships.length > 0) {
        currentOrg = memberships[0].organizations;
      } else {
        const { data: ownedOrg } = await supabase
          .from('organizations')
          .select('*')
          .eq('owner_id', user.id)
          .limit(1)
          .single();
        currentOrg = ownedOrg;
      }

      if (currentOrg) {
        setOrg(currentOrg);
        const { data: spacesData } = await supabase
          .from('spaces')
          .select('*')
          .eq('org_id', currentOrg.id)
          .order('name');
        
        if (spacesData) setSpaces(spacesData);
      }
    }
    loadSidebarData();
  }, [supabase]);

  return (
    <aside className="flex h-screen w-[260px] flex-col border-r border-white/[0.05] bg-black text-zinc-400">
      {/* Organization Header */}
      <div className="flex items-center gap-3 p-6 group cursor-pointer border-b border-white/[0.03]">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-black text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-300">
          {org?.name?.[0] || 'V'}
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <span className="truncate text-sm font-bold text-white tracking-tight leading-tight">
            {org?.name || 'VipFlow'}
          </span>
          <span className="truncate text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
            {org?.slug || 'agency'}
          </span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-zinc-700 group-hover:text-white transition-colors" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-10 custom-scrollbar">
        {/* Search Bar (Visual Only) */}
        <div className="px-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.05] rounded-full text-zinc-600 hover:bg-white/[0.05] transition-colors cursor-text group">
                <Search className="h-3.5 w-3.5 group-hover:text-zinc-400 transition-colors" />
                <span className="text-[11px] font-medium">Búsqueda rápida...</span>
            </div>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <span className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">Plataforma</span>
          <div className="space-y-1">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all duration-300",
                    isActive 
                      ? "bg-white/[0.08] text-white shadow-[0_0_15px_rgba(255,255,255,0.02)]" 
                      : "text-zinc-500 hover:bg-white/[0.03] hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-white" : "text-zinc-600 group-hover:text-zinc-300")} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Spaces Navigation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">Espacios</span>
            <button className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-white/10 text-zinc-600 hover:text-white transition-all">
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-1">
            {spaces.length > 0 ? (
              spaces.map((space) => {
                const isActive = pathname === `/dashboard/spaces/${space.id}`;
                return (
                  <Link
                    key={space.id}
                    href={`/dashboard/spaces/${space.id}`}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all group",
                      isActive 
                        ? "bg-white/[0.08] text-white" 
                        : "text-zinc-500 hover:bg-white/[0.03] hover:text-white"
                    )}
                  >
                    <div className={cn(
                        "h-2 w-2 rounded-full transition-all duration-500",
                        isActive ? "bg-white scale-125" : "bg-zinc-800 group-hover:bg-zinc-600"
                    )} />
                    <span className="flex-1 text-left truncate">{space.name}</span>
                    {isActive && (
                        <div className="h-1 w-1 rounded-full bg-white animate-pulse" />
                    )}
                  </Link>
                );
              })
            ) : (
              <p className="px-4 py-2 text-[10px] text-zinc-700 italic">No hay espacios activos</p>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-6 bg-black border-t border-white/[0.03] space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-4 px-4 h-11 text-zinc-600 hover:text-white hover:bg-white/[0.05] rounded-xl text-[13px] font-medium group transition-all">
          <Bell className="h-4 w-4 group-hover:scale-110 transition-transform" />
          <span>Actividad</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-4 px-4 h-11 text-zinc-600 hover:text-white hover:bg-white/[0.05] rounded-xl text-[13px] font-medium group transition-all">
          <Settings className="h-4 w-4 group-hover:rotate-45 transition-transform" />
          <span>Ajustes</span>
        </Button>
      </div>
    </aside>
  );
}
