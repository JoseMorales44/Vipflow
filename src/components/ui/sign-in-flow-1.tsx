"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { createClient } from "@/lib/supabase/client";

interface SignInPageProps {
  className?: string;
}

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a href={href} className="group relative inline-block overflow-hidden h-5 flex items-center text-sm">
      <div className="flex flex-col transition-transform duration-500 ease-out transform group-hover:-translate-y-1/2">
        <span className="text-gray-300">{children}</span>
        <span className="text-white">{children}</span>
      </div>
    </a>
  );
};

function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      // Small delay to avoid synchronous update in effect warning
      const id = setTimeout(() => setHeaderShapeClass('rounded-xl'), 0);
      return () => clearTimeout(id);
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const navLinksData = [
    { label: 'Work', href: '#1' },
    { label: 'Process', href: '#2' },
    { label: 'Pricing', href: '#3' },
  ];

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20
                       flex flex-col items-center
                       px-6 py-3 backdrop-blur-md
                       ${headerShapeClass}
                       border border-white/10 bg-black/40
                       w-[calc(100%-3rem)] max-w-7xl
                       transition-[border-radius] duration-300 ease-in-out`}>

      <div className="flex items-center justify-between w-full gap-x-20">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo-VIP.png" alt="VIP" width={40} height={20} className="h-5 w-auto" unoptimized />
        </Link>

        <nav className="hidden sm:flex items-center space-x-6 text-sm">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-xs text-gray-300 hover:text-white transition-colors">
            Acceder
          </Link>
          <Link href="/register" className="px-4 py-2 text-xs font-bold text-black bg-[#51DD7D] rounded-full hover:bg-[#51DD7D]/90 transition-colors">
            Empezar gratis
          </Link>
        </div>

        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300" onClick={toggleMenu}>
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden flex flex-col items-center w-full overflow-hidden"
          >
            <nav className="flex flex-col items-center space-y-4 pt-6 pb-4 w-full">
              {navLinksData.map((link) => (
                <Link key={link.href} href={link.href} className="text-gray-300 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 w-full pt-4">
                <Link href="/login" className="px-4 py-2 text-center text-sm text-gray-300 border border-white/10 rounded-full">
                  Acceder
                </Link>
                <Link href="/register" className="px-4 py-2 text-center text-sm font-bold text-black bg-[#51DD7D] rounded-full">
                  Empezar gratis
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export const SignInPage = ({ className }: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    console.log("Current step:", step, "mounted:", mounted);
  }, [step, mounted]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
      setStep("code");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al enviar el código";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (finalCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: finalCode,
        type: 'email',
      });

      if (error) throw error;

      // Éxito: Activar efectos visuales
      setReverseCanvasVisible(true);
      setTimeout(() => {
        setInitialCanvasVisible(false);
      }, 50);
      setTimeout(() => {
        setStep("success");
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Código inválido";
      setError(message);
      // Resetear código si falla
      setCode(["", "", "", "", "", ""]);
      codeInputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (step === "code") {
      const id = setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 500);
      return () => clearTimeout(id);
    }
  }, [step]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }

      if (index === 5 && value) {
        const isComplete = newCode.every(digit => digit.length === 1);
        if (isComplete) {
          verifyCode(newCode.join(""));
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackClick = () => {
    setStep("email");
    setCode(["", "", "", "", "", ""]);
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  return (
    <div className={cn("flex w-full flex-col min-h-screen bg-black relative", className)}>
      <div className="absolute inset-0 z-0 overflow-hidden">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[[81, 221, 125]]}
              dotSize={4}
              reverse={false}
            />
          </div>
        )}

        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-black"
              colors={[[81, 221, 125]]}
              dotSize={4}
              reverse={true}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.4)_0%,_rgba(0,0,0,1)_100%)]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <MiniNavbar />

        <div className="flex flex-1 flex-col justify-center items-center px-4">
          <div className="w-full max-w-sm">
            {mounted && (
              <AnimatePresence mode="wait">
                {step === "email" ? (
                  <motion.div
                    key="email-step"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8 text-center"
                  >
                    <div className="space-y-2">
                      <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white">VipFlow</h1>
                      <p className="text-lg text-white/50 font-light">El flujo creativo definitivo</p>
                    </div>

                    <div className="space-y-4">
                      <button className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-[#51DD7D]/30 hover:border-[#51DD7D]/60 rounded-full py-4 transition-all">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Continuar con Google
                      </button>

                      <div className="flex items-center gap-4 py-2">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-white/20 text-xs font-bold uppercase tracking-widest">O</span>
                        <div className="h-px bg-white/10 flex-1" />
                      </div>

                      {error && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-red-400 text-xs font-bold"
                        >
                          {error}
                        </motion.p>
                      )}

                      <form onSubmit={handleEmailSubmit} className="relative group">
                        <input
                          type="email"
                          placeholder="tu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/5 text-white border border-[#51DD7D]/30 rounded-full py-4 px-6 focus:outline-none focus:border-[#51DD7D]/70 text-center transition-all"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={cn(
                            "absolute right-2 top-2 text-black w-10 h-10 flex items-center justify-center rounded-full bg-[#51DD7D] hover:bg-[#51DD7D]/90 transition-colors",
                            isLoading && "opacity-50 cursor-wait"
                          )}
                        >
                          {isLoading ? "..." : "→"}
                        </button>
                      </form>
                    </div>

                    <p className="text-[10px] text-white/30 px-4 leading-relaxed">
                      Al continuar, aceptas nuestros <Link href="#" className="text-white/50 hover:text-white">Términos de Servicio</Link> y <Link href="#" className="text-white/50 hover:text-white">Política de Privacidad</Link>.
                    </p>
                  </motion.div>
                ) : step === "code" ? (
                  <motion.div
                    key="code-step"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8 text-center"
                  >
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tighter text-white">Verifica tu email</h1>
                      <p className="text-white/50 font-light text-xs">Hemos enviado un código a {email}</p>
                      {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      {code.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { codeInputRefs.current[i] = el; }}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleCodeChange(i, e.target.value)}
                          onKeyDown={e => handleKeyDown(i, e)}
                          className={cn(
                            "w-12 h-14 text-center text-2xl font-bold bg-white/5 text-white border border-[#51DD7D]/30 rounded-2xl focus:outline-none focus:border-[#51DD7D]/70 transition-all",
                            isLoading && "opacity-50"
                          )}
                          disabled={isLoading}
                        />
                      ))}
                    </div>

                    <div className="flex flex-col gap-4">
                      <button
                        type="button"
                        disabled={isLoading}
                        className="text-white/40 hover:text-white text-sm transition-colors"
                        onClick={handleEmailSubmit}
                      >
                        ¿No recibiste el código? Reenviar
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={handleBackClick}
                          disabled={isLoading}
                          className="flex-1 rounded-full bg-white/5 text-white border border-[#51DD7D]/30 py-3 hover:bg-white/10 hover:border-[#51DD7D]/60 transition-all disabled:opacity-50"
                        >
                          Atrás
                        </button>
                        <button
                          className={cn(
                            "flex-[2] rounded-full font-bold py-3 transition-all",
                            code.every(d => d !== "") && !isLoading
                              ? "bg-[#51DD7D] text-black cursor-pointer hover:bg-[#51DD7D]/90"
                              : "bg-white/5 text-white/20 cursor-not-allowed"
                          )}
                          disabled={!code.every(d => d !== "") || isLoading}
                          onClick={() => verifyCode(code.join(""))}
                        >
                          {isLoading ? "Verificando..." : "Continuar"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-step"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8 text-center"
                  >
                    <div className="mx-auto w-20 h-20 rounded-full bg-[#51DD7D] flex items-center justify-center">
                      <svg className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div className="space-y-2">
                      <h1 className="text-4xl font-bold tracking-tighter text-white">¡Estás dentro!</h1>
                      <p className="text-white/50">Preparando tu workspace personalizado...</p>
                    </div>
                    <Link href="/dashboard" className="block w-full rounded-full bg-white text-black font-bold py-4 hover:bg-gray-200 transition-all">
                      Ir al Dashboard
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
