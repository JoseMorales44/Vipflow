"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ view = "login" }: { view?: "login" | "register" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      setMessage({ 
        type: 'success', 
        text: '¡Enlace enviado! Revisa tu bandeja de entrada.' 
      });
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Ocurrió un error al intentar enviar el enlace.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: `Error con ${provider}: ${error.message}` 
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleEmailLogin}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label className="text-zinc-400" htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              placeholder="nombre@agencia.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white h-12 focus:ring-[#51DD7D]"
            />
          </div>
          
          {message && (
            <p className={`text-sm font-medium ${message.type === 'error' ? 'text-red-500' : 'text-[#51DD7D]'}`}>
              {message.text}
            </p>
          )}

          <Button 
            type="submit"
            className="bg-[#51DD7D] text-black hover:bg-[#51DD7D]/90 h-12 font-bold" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                Procesando...
              </span>
            ) : (
              view === "login" ? "Entrar con Email" : "Crear Cuenta con Email"
            )}
          </Button>
        </div>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#0a0a0c] px-2 text-zinc-500 font-bold tracking-widest">O continúa con</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button 
            variant="outline" 
            type="button" 
            disabled={isLoading} 
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white h-12"
            onClick={() => handleSocialLogin('github')}
        >
          <Github className="mr-2 h-4 w-4" />
          Github
        </Button>
        <Button 
            variant="outline" 
            type="button" 
            disabled={isLoading}
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white h-12"
            onClick={() => handleSocialLogin('google')}
        >
          <GoogleIcon className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
    </svg>
  );
}
