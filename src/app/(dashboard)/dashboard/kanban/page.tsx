import KanbanBoard from "@/components/dashboard/kanban-board";

export default function KanbanPage() {
  return (
    <div className="h-full w-full bg-[#0a0a0c]">
      <div className="p-8 border-b border-white/[0.05] bg-black/40 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-2xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
          <div className="h-8 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(81,221,125,0.5)]" />
          Tablero Kanban
        </h1>
        <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-[0.2em] mt-1 ml-4">
          Gestión de Tareas y Flujo de Trabajo
        </p>
      </div>
      <KanbanBoard />
    </div>
  );
}
