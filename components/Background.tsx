"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Background({ condition }: { condition?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cond = condition?.toLowerCase() || "";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number; y: number; speed: number; length: number; opacity: number;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.speed = (cond.includes("rain") || cond.includes("drizzle")) ? Math.random() * 20 + 15 : Math.random() * 2 + 0.5;
        this.length = (cond.includes("rain") || cond.includes("drizzle")) ? Math.random() * 45 + 25 : Math.random() * 6 + 2;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.y += this.speed;
        if (cond.includes("rain") || cond.includes("drizzle")) this.x -= 3; 
        if (this.y > canvas!.height) {
          this.y = -20;
          this.x = Math.random() * canvas!.width;
        }
      }
      draw() {
        ctx!.beginPath();
        if (cond.includes("rain") || cond.includes("drizzle")) {
          ctx!.strokeStyle = `rgba(186, 230, 253, ${this.opacity})`;
          ctx!.lineWidth = 2;
          ctx!.moveTo(this.x, this.y);
          ctx!.lineTo(this.x - 3, this.y + this.length);
          ctx!.stroke();
        } else if (cond.includes("snow")) {
          ctx!.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
          ctx!.arc(this.x, this.y, this.length / 2, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    const init = () => {
      particles = [];
      const count = (cond.includes("rain") || cond.includes("drizzle")) ? 160 : cond.includes("snow") ? 100 : 0;
      for (let i = 0; i < count; i++) particles.push(new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [cond]);

  const getThemeColors = () => {
    if (cond.includes("clear")) return "from-orange-600/50 via-yellow-500/30 to-transparent";
    if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("thunder")) return "from-blue-900/70 via-[#050510] to-black";
    if (cond.includes("cloud")) return "from-gray-600/50 via-slate-800/40 to-transparent";
    if (cond.includes("snow")) return "from-blue-100/40 via-slate-300/30 to-white/10";
    if (cond.includes("mist") || cond.includes("fog") || cond.includes("haze")) return "from-teal-900/40 via-gray-800/40 to-transparent";
    return "from-indigo-950/50 via-purple-900/30 to-black";
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#010103]">
      <AnimatePresence mode="wait">
        <motion.div
          key={cond}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          {cond.includes("thunder") && (
            <motion.div
              animate={{ opacity: [0, 0, 0.5, 0, 0.8, 0.2, 0] }}
              transition={{ duration: 5, repeat: Infinity, times: [0, 0.8, 0.82, 0.84, 0.86, 0.9, 1] }}
              className="absolute inset-0 bg-white z-30 pointer-events-none mix-blend-overlay"
            />
          )}

          <div className={`absolute inset-0 opacity-80 blur-[130px] bg-gradient-to-br transition-colors duration-1000 ${getThemeColors()}`} />
        </motion.div>
      </AnimatePresence>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-20" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay z-10 pointer-events-none" />
    </div>
  );
}