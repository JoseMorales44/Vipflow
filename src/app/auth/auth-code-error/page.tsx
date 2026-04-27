import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AuthCodeError() {
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const message = searchParams.get("message") || "No se pudo completar el inicio de sesión.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0c] p-6 text-center">
      <div className="bg-red-500/10 p-4 rounded-full mb-6">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Error de Autenticación</h1>
      <p className="text-zinc-400 max-w-md mb-8">
        {message}
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
            Volver al Login
          </Button>
        </Link>
        <Link href="/">
          <Button className="bg-[#51DD7D] text-black hover:bg-[#51DD7D]/90 font-bold">
            Ir a la Inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
