"use client";

import { useEffect, useRef } from "react";

export default function RainOverlay({ condition }: { condition?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cond = condition?.toLowerCase() || "";
  const isRainy = cond.includes("rain") || cond.includes("drizzle") || cond.includes("thunder");

  useEffect(() => {
    if (!isRainy) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: RainDrop[] = [];

    const resize = () => {
      if (typeof window !== 'undefined') {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    class RainDrop {
      x: number;
      y: number;
      speed: number;
      length: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * -canvas!.height;
        this.speed = Math.random() * 25 + 20;
        this.length = Math.random() * 35 + 35;
        this.opacity = Math.random() * 0.4 + 0.2;
      }

      update() {
        this.y += this.speed;
        this.x -= 3;
        if (this.y > canvas!.height) {
          this.y = -50;
          this.x = Math.random() * canvas!.width;
        }
      }

      draw() {
        ctx!.beginPath();
        const gradient = ctx!.createLinearGradient(this.x, this.y, this.x - 3, this.y + this.length);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.5, `rgba(186, 230, 253, ${this.opacity})`);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.7)");
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = 2;
        ctx!.moveTo(this.x, this.y);
        ctx!.lineTo(this.x - 3, this.y + this.length);
        ctx!.stroke();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 140; i++) {
        particles.push(new RainDrop());
      }
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
  }, [cond, isRainy]);

  if (!isRainy) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
    />
  );
}