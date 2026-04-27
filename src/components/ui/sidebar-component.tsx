"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search as SearchIcon,
  Dashboard,
  Task,
  UserMultiple,
  Analytics,
  Settings as SettingsIcon,
  User as UserIcon,
  ChevronDown as ChevronDownIcon,
  AddLarge,
  Time,
  View,
  StarFilled,
  FolderOpen,
  Share,
  Notification,
  Integration,
  Rocket,
  Building,
  Purchase,
  Report,
  ChartBar,
  Archive,
  Security,
} from "@carbon/icons-react";
import Image from "next/image";
import { Tables } from "@/types/database";

/** ======================================================================= */

// Softer spring animation curve
const softSpringEasing = "cubic-bezier(0.25, 1.1, 0.4, 1)";

/* ----------------------------- Brand / Logos ----------------------------- */

function VipFlowLogo({ isCollapsed }: { isCollapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-10 w-10 flex items-center justify-center shrink-0">
        <Image src="/images/logo-VIP.png" alt="VipFlow Logo" width={32} height={32} className="object-contain" />
      </div>
      {!isCollapsed && (
        <span className="font-['Lexend:SemiBold',_sans-serif] text-[18px] text-neutral-50 tracking-tight uppercase italic">
          VipFlow
        </span>
      )}
    </div>
  );
}

function BrandBadge({ orgName }: { orgName: string }) {
  return (
    <div className="relative shrink-0 w-full px-2">
      <div className="flex items-center p-1 w-full bg-white/[0.03] rounded-xl border border-white/[0.05]">
        <div className="h-10 w-10 flex items-center justify-center shrink-0 bg-white rounded-lg">
           <span className="text-black font-black text-lg">{orgName?.[0] || 'V'}</span>
        </div>
        <div className="px-3 py-1 overflow-hidden">
          <div className="font-['Lexend:SemiBold',_sans-serif] text-[14px] text-neutral-50 truncate">
            {orgName}
          </div>
          <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest truncate">
            Organización
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Avatar -------------------------------- */

function AvatarCircle({ user }: { user: Tables<'profiles'> | null }) {
  return (
    <div className="relative rounded-full shrink-0 size-8 bg-neutral-800 overflow-hidden">
      {user?.avatar_url ? (
        <Image src={user.avatar_url} alt={user.full_name} fill className="object-cover" />
      ) : (
        <div className="flex items-center justify-center size-8">
          <UserIcon size={16} className="text-neutral-50" />
        </div>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-neutral-700 pointer-events-none"
      />
    </div>
  );
}

/* ------------------------------ Search Input ----------------------------- */

function SearchContainer() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="relative shrink-0 w-full px-2">
      <div className="bg-white/[0.03] h-10 relative rounded-lg flex items-center border border-white/[0.05] w-full">
        <div className="flex items-center justify-center shrink-0 px-1">
          <div className="size-8 flex items-center justify-center">
            <SearchIcon size={16} className="text-neutral-500" />
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <div className="flex flex-col justify-center size-full">
            <div className="flex flex-col gap-2 items-start justify-center pr-2 py-1 w-full">
              <input
                type="text"
                placeholder="Búsqueda rápida..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full bg-transparent border-none outline-none font-['Lexend:Regular',_sans-serif] text-[13px] text-neutral-50 placeholder:text-neutral-500 leading-[20px]"
                tabIndex={0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Types / Content Map -------------------------- */

interface MenuItemT {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  children?: MenuItemT[];
}
interface MenuSectionT {
  title: string;
  items: MenuItemT[];
}
interface SidebarContent {
  title: string;
  sections: MenuSectionT[];
}

function getSidebarContent(activeSection: string, spaces: Tables<'spaces'>[], role: string, pathname: string): SidebarContent {
  const isAdmin = role === 'admin' || role === 'owner';

  const contentMap: Record<string, SidebarContent> = {
    dashboard: {
      title: "Inicio",
      sections: [
        {
          title: "Acceso Directo",
          items: [
            { icon: <View size={16} />, label: "Resumen General", href: "/dashboard", isActive: pathname === "/dashboard" },
            { icon: <Notification size={16} />, label: "Bandeja de Entrada", href: "/dashboard/inbox", isActive: pathname === "/dashboard/inbox" },
            { icon: <Time size={16} />, label: "Actividad Reciente", href: "/dashboard/activity" },
          ],
        },
        isAdmin ? {
          title: "Gestión de Agencia",
          items: [
            { icon: <Analytics size={16} />, label: "Métricas", href: "/dashboard/analytics" },
            { icon: <Report size={16} />, label: "Reportes", href: "/dashboard/reports" },
            { icon: <Rocket size={16} />, label: "Flujo de Trabajo", href: "/dashboard/kanban" },
          ],
        } : null,
      ].filter(Boolean) as MenuSectionT[],
    },

    kanban: {
      title: "Tablero Kanban",
      sections: [
        {
          title: "Vistas de Tareas",
          items: [
            { icon: <View size={16} />, label: "Tablero Principal", href: "/dashboard/kanban", isActive: pathname === "/dashboard/kanban" },
            { icon: <ChartBar size={16} />, label: "Estado del Proyecto", href: "/dashboard/kanban/status" },
            { icon: <SettingsIcon size={16} />, label: "Configurar Tablero", href: "/dashboard/kanban/settings" },
          ],
        },
      ],
    },

    spaces: {
      title: "Espacios",
      sections: [
        {
          title: isAdmin ? "Clientes y Proyectos" : "Tus Canales",
          items: spaces.map(space => ({
            icon: <div className="h-2 w-2 rounded-full" style={{ backgroundColor: space.color || '#51DD7D' }} />,
            label: space.name,
            href: `/dashboard/spaces/${space.id}`,
            isActive: pathname === `/dashboard/spaces/${space.id}`
          })),
        },
        isAdmin ? {
          title: "Acciones",
          items: [
            { icon: <AddLarge size={16} />, label: "Nuevo Espacio", href: "/dashboard/spaces/new" },
            { icon: <SettingsIcon size={16} />, label: "Gestionar Espacios", href: "/dashboard/spaces/manage" },
          ],
        } : null,
      ].filter(Boolean) as MenuSectionT[],
    },

    inbox: {
      title: "Notificaciones",
      sections: [
        {
          title: "Centro de Mensajes",
          items: [
            { icon: <Share size={16} />, label: "Todas las menciones", href: "/dashboard/inbox" },
            { icon: <StarFilled size={16} />, label: "Importantes", href: "/dashboard/inbox/starred" },
            { icon: <Archive size={16} />, label: "Archivados", href: "/dashboard/inbox/archive" },
          ],
        },
      ],
    },

    teams: {
      title: "Equipo",
      sections: [
        {
          title: "Colaboradores",
          items: [
            { icon: <UserMultiple size={16} />, label: "Miembros Activos", href: "/dashboard/teams", isActive: pathname === "/dashboard/teams" },
            isAdmin ? { icon: <AddLarge size={16} />, label: "Invitar Persona", href: "/dashboard/teams/invite" } : null,
            isAdmin ? { icon: <Time size={16} />, label: "Historial de Invitaciones", href: "/dashboard/teams/invites" } : null,
          ].filter(Boolean) as MenuItemT[],
        },
      ],
    },

    settings: {
      title: "Configuración",
      sections: [
        {
          title: "Perfil y Cuenta",
          items: [
            { icon: <UserIcon size={16} />, label: "Mi Perfil", href: "/dashboard/settings" },
            { icon: <Notification size={16} />, label: "Preferencias", href: "/dashboard/settings/notifications" },
          ],
        },
        isAdmin ? {
          title: "Administración",
          items: [
            { icon: <Building size={16} />, label: "Agencia", href: "/dashboard/settings/agency" },
            { icon: <Security size={16} />, label: "Seguridad", href: "/dashboard/settings/security" },
            { icon: <Integration size={16} />, label: "Integraciones", href: "/dashboard/settings/integrations" },
            { icon: <Purchase size={16} />, label: "Suscripción y Pagos", href: "/dashboard/settings/billing" },
          ],
        } : null,
      ].filter(Boolean) as MenuSectionT[],
    },
  };

  return contentMap[activeSection] || contentMap.dashboard;
}

/* ---------------------------- Left Icon Nav Rail -------------------------- */

function IconNavButton({
  children,
  isActive = false,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`flex items-center justify-center rounded-lg size-10 min-w-10 transition-colors duration-500
        ${isActive ? "bg-neutral-800 text-neutral-50 shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300"}`}
      style={{ transitionTimingFunction: softSpringEasing }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function IconNavigation({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (section: string) => void;
  role: string;
}) {

  const navItems = [
    { id: "dashboard", icon: <Dashboard size={16} />, label: "Inicio" },
    { id: "kanban", icon: <Task size={16} />, label: "Kanban" },
    { id: "spaces", icon: <FolderOpen size={16} />, label: "Espacios" },
    { id: "inbox", icon: <Task size={16} />, label: "Inbox" },
    { id: "teams", icon: <UserMultiple size={16} />, label: "Equipo" },
  ];

  return (
    <aside className="bg-black flex flex-col gap-2 items-center p-4 w-16 h-full border-r border-white/[0.05]">
      {/* Logo */}
      <div className="mb-4 flex items-center justify-center">
        <VipFlowLogo isCollapsed={true} />
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col gap-3 w-full items-center">
        {navItems.map((item) => (
          <IconNavButton
            key={item.id}
            isActive={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          >
            {item.icon}
          </IconNavButton>
        ))}
      </div>

      <div className="flex-1" />

      {/* Bottom section */}
      <div className="flex flex-col gap-3 w-full items-center mb-2">
        <IconNavButton isActive={activeSection === "settings"} onClick={() => onSectionChange("settings")}>
          <SettingsIcon size={16} />
        </IconNavButton>
      </div>
    </aside>
  );
}

/* ------------------------------ Right Sidebar ----------------------------- */

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="w-full overflow-hidden px-2">
      <div className="flex items-center h-10">
        <div className="px-2 py-1">
          <div className="font-['Lexend:SemiBold',_sans-serif] text-[16px] text-neutral-50 leading-[24px] tracking-tight">
            {title}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailSidebar({ activeSection, spaces, role, user, org }: { activeSection: string; spaces: Tables<'spaces'>[]; role: string; user: Tables<'profiles'> | null; org: Tables<'organizations'> | null }) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const router = useRouter();
  const content = getSidebarContent(activeSection, spaces, role, pathname);

  const ROLE_LABELS: Record<string, string> = {
    owner: 'Propietario',
    admin: 'Administrador',
    worker: 'Colaborador',
    client: 'Cliente',
  };

  const toggleExpanded = (itemKey: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) next.delete(itemKey);
      else next.add(itemKey);
      return next;
    });
  };

  return (
    <aside className="bg-black flex flex-col gap-3 items-start py-4 px-2 border-r border-white/[0.05] h-full w-56 md:w-64 shrink-0">
      <BrandBadge orgName={org?.name || 'Mi Agencia'} />
      <SectionTitle title={content.title} />
      <SearchContainer />

      <div className="flex flex-col w-full overflow-y-auto flex-1 gap-3 items-start custom-scrollbar">
        {content.sections.map((section, index) => (
          <MenuSection
            key={`${activeSection}-${index}`}
            section={section}
            expandedItems={expandedItems}
            onToggleExpanded={toggleExpanded}
            onNavigate={(href) => router.push(href)}
          />
        ))}

        {/* Canales / Spaces — always visible */}
        {spaces.length > 0 && activeSection !== 'spaces' && (
          <div className="flex flex-col w-full mt-1">
            <div className="flex items-center justify-between h-8 px-4">
              <div className="text-[10px] text-neutral-600 uppercase tracking-[0.2em] font-bold">Canales</div>
              <button
                onClick={() => router.push('/dashboard/spaces/new')}
                className="text-neutral-600 hover:text-[#51DD7D] transition-colors"
                title="Nuevo canal"
              >
                <AddLarge size={12} />
              </button>
            </div>
            {spaces.map(space => (
              <div
                key={space.id}
                onClick={() => router.push(`/dashboard/spaces/${space.id}`)}
                className={`flex items-center gap-2.5 h-9 px-4 rounded-lg cursor-pointer transition-colors ${
                  pathname === `/dashboard/spaces/${space.id}`
                    ? 'bg-white/[0.08] text-white'
                    : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.03]'
                }`}
              >
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: space.color || '#51DD7D' }} />
                <span className="text-[13px] truncate">{space.name}</span>
              </div>
            ))}
            <button
              onClick={() => router.push('/dashboard/spaces/new')}
              className="flex items-center gap-2.5 h-9 px-4 text-neutral-600 hover:text-[#51DD7D] hover:bg-white/[0.03] rounded-lg transition-colors w-full"
            >
              <AddLarge size={12} />
              <span className="text-[12px] font-bold uppercase tracking-widest">Nuevo Canal</span>
            </button>
          </div>
        )}

        {spaces.length === 0 && (
          <div className="flex flex-col w-full mt-1">
            <div className="flex items-center h-8 px-4">
              <div className="text-[10px] text-neutral-600 uppercase tracking-[0.2em] font-bold">Canales</div>
            </div>
            <button
              onClick={() => router.push('/dashboard/spaces/new')}
              className="flex items-center gap-2.5 h-9 px-4 text-neutral-600 hover:text-[#51DD7D] hover:bg-white/[0.03] rounded-lg transition-colors w-full"
            >
              <AddLarge size={12} />
              <span className="text-[12px] font-bold uppercase tracking-widest">Crear primer canal</span>
            </button>
          </div>
        )}
      </div>

      <div className="w-full mt-auto pt-3 border-t border-white/[0.05]">
        <div
          onClick={() => router.push('/dashboard/settings')}
          className="flex items-center gap-3 px-2 py-2 group cursor-pointer hover:bg-white/[0.03] rounded-xl transition-colors"
        >
          <AvatarCircle user={user} />
          <div className="flex flex-col overflow-hidden flex-1 min-w-0">
            <span className="font-['Lexend:Regular',_sans-serif] text-[13px] text-neutral-50 truncate leading-tight">
              {user?.full_name || user?.email || 'Cargando...'}
            </span>
            <span className="text-[10px] text-neutral-500 truncate uppercase tracking-wider font-bold">
              {ROLE_LABELS[role] || role}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------ Menu Elements ---------------------------- */

function MenuItem({
  item,
  isExpanded,
  onToggle,
  onItemClick,
}: {
  item: MenuItemT;
  isExpanded?: boolean;
  onToggle?: () => void;
  onItemClick?: () => void;
}) {
  const handleClick = () => {
    if (item.hasDropdown && onToggle) onToggle();
    else onItemClick?.();
  };

  return (
    <div className="relative shrink-0 w-full">
      <div
        className={`rounded-xl cursor-pointer transition-all duration-200 flex items-center relative w-full h-9 px-4 py-2 ${
          item.isActive ? "bg-white/[0.08] text-white" : "hover:bg-white/[0.03] text-neutral-500 hover:text-neutral-300"
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center justify-center shrink-0">{item.icon}</div>
        <div className="flex-1 overflow-hidden ml-3">
          <div className="text-[13px] leading-[20px] truncate">{item.label}</div>
        </div>
        {item.hasDropdown && (
          <ChevronDownIcon
            size={14}
            className="transition-transform duration-300 ml-2 shrink-0"
            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        )}
      </div>
    </div>
  );
}

function SubMenuItem({ item, onItemClick }: { item: MenuItemT; onItemClick?: () => void }) {
  return (
    <div className="w-full pl-9 pr-1 py-[1px]">
      <div
        className="h-10 w-full rounded-lg cursor-pointer transition-colors hover:bg-white/[0.03] flex items-center px-3 py-1 text-neutral-400 hover:text-neutral-200"
        onClick={onItemClick}
      >
        <div className="flex-1 min-w-0">
          <div className="font-['Lexend:Regular',_sans-serif] text-[13px] leading-[18px] truncate">
            {item.label}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuSection({
  section,
  expandedItems,
  onToggleExpanded,
  onNavigate
}: {
  section: MenuSectionT;
  expandedItems: Set<string>;
  onToggleExpanded: (itemKey: string) => void;
  onNavigate: (href: string) => void;
}) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center h-8 px-4">
        <div className="font-['Lexend:Bold',_sans-serif] text-[10px] text-neutral-600 uppercase tracking-[0.2em]">
          {section.title}
        </div>
      </div>

      {section.items.map((item, index) => {
        const itemKey = `${section.title}-${index}`;
        const isExpanded = expandedItems.has(itemKey);
        return (
          <div key={itemKey} className="w-full flex flex-col">
            <MenuItem
              item={item}
              isExpanded={isExpanded}
              onToggle={() => onToggleExpanded(itemKey)}
              onItemClick={() => item.href && onNavigate(item.href)}
            />
            {isExpanded && item.children && (
              <div className="flex flex-col gap-1 mb-2">
                {item.children.map((child, childIndex) => (
                  <SubMenuItem
                    key={`${itemKey}-${childIndex}`}
                    item={child}
                    onItemClick={() => child.href && onNavigate(child.href)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------- Layout -------------------------------- */

import { useUserStore } from "@/store/useUserStore";

/* --------------------------------- Layout -------------------------------- */

export function TwoLevelSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, org, role, spaces, fetchUserData } = useUserStore();

  useEffect(() => {
    fetchUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derive active section from the current URL
  const currentSection = useMemo(() => {
    if (pathname.startsWith('/dashboard/spaces')) return 'spaces';
    if (pathname.startsWith('/dashboard/inbox')) return 'inbox';
    if (pathname.startsWith('/dashboard/kanban')) return 'kanban';
    if (pathname.startsWith('/dashboard/teams')) return 'teams';
    if (pathname.startsWith('/dashboard/settings')) return 'settings';
    return 'dashboard';
  }, [pathname]);

  // Navigate to the primary route of each section on icon click
  const handleSectionChange = (section: string) => {
    const primaryRoutes: Record<string, string> = {
      dashboard: '/dashboard',
      kanban: '/dashboard/kanban',
      spaces: spaces.length > 0 ? `/dashboard/spaces/${spaces[0].id}` : '/dashboard/spaces',
      inbox: '/dashboard/inbox',
      teams: '/dashboard/teams',
      settings: '/dashboard/settings',
    };
    router.push(primaryRoutes[section] || '/dashboard');
  };

  return (
    <div className="flex flex-row h-full">
      <IconNavigation 
        activeSection={currentSection} 
        onSectionChange={handleSectionChange} 
        role={role || 'worker'} 
      />
      <DetailSidebar 
        activeSection={currentSection} 
        spaces={spaces} 
        role={role || 'worker'} 
        user={user}
        org={org}
      />
    </div>
  );
}

/* ------------------------------- Root Frame ------------------------------ */

export function Frame760() {
  return (
    <div className="bg-[#1a1a1a] min-h-screen flex items-center justify-center p-4">
      <div className="h-[800px] border border-white/[0.05] rounded-2xl overflow-hidden shadow-2xl">
        <TwoLevelSidebar />
      </div>
    </div>
  );
}

export default Frame760;
