import { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Entrar | VipFlow",
  description: "Accede a tu panel de control de agencia en VipFlow.",
};

export default function LoginPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none  lg:px-0 bg-[#0a0a0c]">
      {/* <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r border-white/5">
        <div className="absolute inset-0 bg-[#141414]" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image src="/images/logo-VIP.png" alt="Logo" width={140} height={40} className="object-contain" />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;VipFlow ha transformado la manera en que nos comunicamos con nuestros clientes. Es el centro de operaciones que toda agencia necesita.&rdquo;
            </p>
            <footer className="text-sm font-semibold text-[#51DD7D]">Equipo Marketing VIP</footer>
          </blockquote>
        </div>
      </div> */}
      <div className="flex items-center justify-center w-full h-full">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Bienvenido de nuevo
            </h1>
            <p className="text-sm text-zinc-500">
              Introduce tu email para entrar a tu cuenta
            </p>
          </div>
          <AuthForm view="login" />
          <p className="px-8 text-center text-sm text-zinc-500">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="underline underline-offset-4 hover:text-[#51DD7D] transition-colors"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
