"use client";

import * as React from "react"
import { Moon, Sun, ArrowUp } from "lucide-react"
import { useTheme } from "next-themes"

function handleScrollTop() {
  if (typeof window !== 'undefined') {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }
}

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Evitar error de hidratación: el componente solo muestra el estado del tema en el cliente
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
          <div className="p-2 text-zinc-400">
            <Sun className="h-4 w-4" />
          </div>
          <div className="mx-2 p-1 text-zinc-400">
            <ArrowUp className="h-3 w-3" />
          </div>
          <div className="p-2 text-zinc-400">
            <Moon className="h-4 w-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
        <button
          onClick={() => setTheme("light")}
          className={`rounded-full p-2 transition-all ${theme === 'light' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
        >
          <Sun className="h-4 w-4" strokeWidth={2} />
          <span className="sr-only">Modo Claro</span>
        </button>

        <button 
          type="button" 
          onClick={handleScrollTop}
          className="mx-2 p-1 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowUp className="h-3 w-3" />
          <span className="sr-only">Subir</span>
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={`rounded-full p-2 transition-all ${theme === 'dark' ? 'bg-[#51DD7D] text-[#1d1e20]' : 'text-zinc-400 hover:text-white'}`}
        >
          <Moon className="h-4 w-4" strokeWidth={2} />
          <span className="sr-only">Modo Oscuro</span>
        </button>
      </div>
    </div>
  );
};
