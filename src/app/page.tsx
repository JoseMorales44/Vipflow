import { SignInPage } from "@/components/ui/sign-in-flow-1";
import { FeaturesSection } from "@/components/ui/features-section";
import { PricingSection } from "@/components/ui/pricing-section";
import { SiteFooter } from "@/components/site-footer";
import { LogosSection } from "@/components/ui/logos-section";
import { ProcessSection } from "@/components/ui/process-section";
import { FAQSection, FinalCTA } from "@/components/ui/final-sections";

import { Banner } from "@/components/ui/banner";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black scroll-smooth">
      <Banner id="welcome-promo" variant="rainbow" height="2.5rem">
        <span className="flex items-center gap-2">
          <span className="bg-primary text-black px-2 py-0.5 rounded text-[10px] font-black uppercase italic">Beta</span>
          VipFlow es GRATUITO por tiempo limitado. ¡Prueba la gestión premium ahora mismo! 🚀
        </span>
      </Banner>
      {/* Nuevo Hero Inmersivo con Flujo de Acceso */}
      <section id="home">
        <SignInPage />
      </section>

      <div className="relative z-10 bg-black">
        {/* Social Proof */}
        <LogosSection />

        {/* Proceso y Metodología */}
        <section id="process">
          <ProcessSection />
        </section>

        {/* Características Detalladas */}
        <section id="work">
          <FeaturesSection />
        </section>

        {/* Planes y Precios */}
        <section id="pricing">
          <PricingSection />
        </section>

        {/* Preguntas Frecuentes */}
        <FAQSection />

        {/* Último llamado a la acción */}
        <FinalCTA />

        {/* Footer */}
        <SiteFooter />
      </div>
    </main>
  );
}
