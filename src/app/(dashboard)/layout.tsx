import { TwoLevelSidebar } from "@/components/ui/sidebar-component";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0c]">
      {/* Sidebar Fijo con sombra lateral sutil */}
      <div className="z-50 shadow-[20px_0_50px_rgba(0,0,0,0.5)] h-full">
        <TwoLevelSidebar />
      </div>

      {/* Área de Contenido Principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Capa de grano sutil para textura premium */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
        
        {/* Contenido Dinámico con Scroll Independiente */}
        <div className="flex-1 overflow-auto custom-scrollbar relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
