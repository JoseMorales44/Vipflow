"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  layer: number;
}

function createBeam(width: number, height: number, layer: number): Beam {
  const angle = -35 + Math.random() * 10;
  const baseSpeed = 0.2 + layer * 0.2;
  const baseOpacity = 0.08 + layer * 0.05;
  const baseWidth = 10 + layer * 5;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    width: baseWidth,
    length: height * 2.5,
    angle,
    speed: baseSpeed + Math.random() * 0.2,
    opacity: baseOpacity + Math.random() * 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.01 + Math.random() * 0.015,
    layer,
  };
}

export const PremiumHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);

  const LAYERS = 3;
  const BEAMS_PER_LAYER = 12; // Aumentado para pantallas grandes


  useEffect(() => {
    const canvas = canvasRef.current;
    const noiseCanvas = noiseRef.current;
    if (!canvas || !noiseCanvas) return;
    const ctx = canvas.getContext("2d");
    const nCtx = noiseCanvas.getContext("2d");
    if (!ctx || !nCtx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      noiseCanvas.width = window.innerWidth * dpr;
      noiseCanvas.height = window.innerHeight * dpr;
      noiseCanvas.style.width = `${window.innerWidth}px`;
      noiseCanvas.style.height = `${window.innerHeight}px`;
      nCtx.setTransform(1, 0, 0, 1, 0, 0);
      nCtx.scale(dpr, dpr);

      beamsRef.current = [];
      for (let layer = 1; layer <= LAYERS; layer++) {
        for (let i = 0; i < BEAMS_PER_LAYER; i++) {
          beamsRef.current.push(createBeam(window.innerWidth, window.innerHeight, layer));
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const generateNoise = () => {
      const imgData = nCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const v = Math.random() * 255;
        imgData.data[i] = v;
        imgData.data[i + 1] = v;
        imgData.data[i + 2] = v;
        imgData.data[i + 3] = 6; // Sutil ruido
      }
      nCtx.putImageData(imgData, 0, 0);
    };

    const drawBeam = (beam: Beam) => {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      const pulsingOpacity = Math.min(1, beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.4));

      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
      gradient.addColorStop(0, `rgba(81, 221, 125, 0)`);
      gradient.addColorStop(0.2, `rgba(81, 221, 125, ${pulsingOpacity * 0.3})`);
      gradient.addColorStop(0.5, `rgba(81, 221, 125, ${pulsingOpacity * 0.6})`);
      gradient.addColorStop(0.8, `rgba(81, 221, 125, ${pulsingOpacity * 0.3})`);
      gradient.addColorStop(1, `rgba(81, 221, 125, 0)`);

      ctx.fillStyle = gradient;
      ctx.filter = `blur(${3 + beam.layer * 2}px)`;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    };

    const animate = () => {
      if (!canvas || !ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#000000");
      gradient.addColorStop(1, "#000000");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      beamsRef.current.forEach((beam) => {
        beam.y -= beam.speed * (beam.layer / LAYERS + 0.5);
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -50) {
          beam.y = window.innerHeight + 50;
          beam.x = Math.random() * window.innerWidth;
        }
        drawBeam(beam);
      });

      generateNoise();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);


  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas ref={noiseRef} className="absolute inset-0 z-0 pointer-events-none" />
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />

      <div className="absolute inset-0 z-[15] bg-black/40 pointer-events-none" />

      {/* Header / Logo */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="relative h-10 w-40 md:h-14 md:w-46">
          <Image
            src="/images/logo-VIP.png"
            alt="Marketing VIP Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-row gap-6 flex-wrap justify-center mt-4">
          <Link href="/login">
            <Button size="lg" className="gap-4 bg-[#51DD7D] text-black hover:bg-[#51DD7D]/90 px-12 py-6 font-bold rounded-none  md:h-12 md:text-lg">
              Entrar <MoveRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </nav>

      <div className="relative z-20 flex h-screen w-full items-center justify-center px-6 pt-30 text-center">
        <div className="flex flex-col items-center gap-10 text-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#51DD7D]/30 bg-[#51DD7D]/10 text-[#51DD7D] text-sm md:text-base font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#51DD7D] animate-pulse" />
            Agencia Creativa
          </div>

          <div className="flex flex-col items-center gap-0 md:gap-2">
            <h1 className="text-4xl md:text-8xl lg:text-9xl min-[2000px]:text-[12rem] tracking-tighter font-bold text-[#F8F6F5] leading-none">
              VipFlow
            </h1>
          </div>

          <p className="text-lg md:text-2xl lg:text-3xl leading-relaxed tracking-tight text-gray-300 max-w-4xl text-center">
            VipFlow es la plataforma definitiva para la comunicación entre agencias y clientes. Centraliza chats, tareas y archivos en un solo lugar profesional.
          </p>

          <div className="flex flex-row gap-6 flex-wrap justify-center mt-4">
            <Link href="/register">
              <Button size="lg" className="gap-4 bg-[#51DD7D] text-black hover:bg-[#51DD7D]/90 px-12 py-6 font-bold rounded-none  md:h-12 md:text-lg">
                Empezar Ahora <MoveRight className="w-6 h-6" />
              </Button>
            </Link>
          </div>

          <div className="mt-16 text-sm md:text-base text-gray-500 uppercase tracking-[0.4em] animate-bounce">
            Desplázate hacia abajo
          </div>
        </div>
      </div>
    </div>
  );
};
