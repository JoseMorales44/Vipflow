export default function BillingPage() {
  const plans = [
    { name: "Free", price: "$0", features: ["3 Espacios", "5 Miembros", "Tablero Kanban", "Chat básico"], current: true },
    { name: "Pro", price: "$29/mes", features: ["Espacios ilimitados", "25 Miembros", "Analytics avanzado", "Soporte prioritario", "Integraciones"], current: false },
    { name: "Agency", price: "$99/mes", features: ["Todo en Pro", "Miembros ilimitados", "API Access", "SLA garantizado", "Manager dedicado"], current: false },
  ];

  return (
    <div className="min-h-full bg-[#0a0a0c]">
      <div className="px-8 py-6 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-2xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
          <div className="h-8 w-1 bg-[#51DD7D] rounded-full" />
          Suscripción y Pagos
        </h1>
        <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-[0.2em] mt-1 ml-4">
          Gestiona tu plan y métodos de pago
        </p>
      </div>
      <div className="max-w-5xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-2xl border flex flex-col gap-4 transition-all ${
                plan.current
                  ? "bg-[#51DD7D]/5 border-[#51DD7D]/30 shadow-[0_0_40px_rgba(81,221,125,0.05)]"
                  : "bg-white/[0.02] border-white/[0.05] hover:border-white/10"
              }`}
            >
              {plan.current && (
                <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest text-[#51DD7D] bg-[#51DD7D]/10 px-2 py-1 rounded-lg">
                  Plan Actual
                </span>
              )}
              <div>
                <h3 className="text-lg font-black text-white">{plan.name}</h3>
                <div className="text-3xl font-black text-white mt-1">{plan.price}</div>
              </div>
              <ul className="space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="text-[#51DD7D] text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={plan.current}
                className={`w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  plan.current
                    ? "bg-white/5 text-zinc-600 cursor-not-allowed"
                    : "bg-[#51DD7D] text-black hover:bg-[#51DD7D]/90"
                }`}
              >
                {plan.current ? "Plan Activo" : `Cambiar a ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
