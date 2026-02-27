"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function SunOrbit({ sunrise, sunset }: { sunrise: number, sunset: number }) {
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ x: 50, y: 80, progress: 0, isDay: true });
  const [times, setTimes] = useState({ sunrise: "--:--", sunset: "--:--" });

  useEffect(() => {
    const calculateOrbit = () => {
      const now = Math.floor(Date.now() / 1000);
      const totalDaylight = sunset - sunrise;
      const elapsed = now - sunrise;
      const progress = Math.max(0, Math.min(1, elapsed / totalDaylight));
      
      const angle = Math.PI * (1 - progress); 
      const x = 50 + 40 * Math.cos(angle); 
      const y = 80 - 40 * Math.sin(angle);
      const isDay = now > sunrise && now < sunset;

      const fTime = (ts: number) => new Date(ts * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });

      setCoords({ x, y, progress, isDay });
      setTimes({ sunrise: fTime(sunrise), sunset: fTime(sunset) });
      setMounted(true);
    };

    calculateOrbit();
    const timer = setInterval(calculateOrbit, 60000);
    return () => clearInterval(timer);
  }, [sunrise, sunset]);

  if (!mounted) {
    return (
      <div className="relative overflow-hidden rounded-[3rem] bg-[#0a0a0f]/60 backdrop-blur-[120px] border border-white/20 p-10 h-full shadow-2xl animate-pulse">
        <div className="h-44 w-full bg-white/5 rounded-3xl" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden rounded-[3rem] bg-[#0a0a0f]/60 backdrop-blur-[120px] border border-white/20 p-10 h-full shadow-[0_20px_80px_-15px_rgba(0,0,0,0.9)] group"
    >
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex flex-col gap-1">
          <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] italic">Orbital Tracking</h3>
          <span className="text-cyan-400/30 font-mono text-[7px] tracking-widest">SATELLITE_LINK_01</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]" />
      </div>

      <div className="relative h-44 w-full flex items-center justify-center">
        <svg className="absolute w-full h-full overflow-visible opacity-30">
          <path 
            d="M 10 80 A 40 40 0 0 1 90 80" 
            fill="none" 
            stroke="cyan" 
            strokeWidth="2" 
            strokeDasharray="6 6"
            className="translate-x-[10%] translate-y-[10%] scale-[1.2] drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]"
          />
        </svg>

        <motion.div 
          animate={{ left: `${coords.x}%`, top: `${coords.y}%` }}
          transition={{ type: "spring", stiffness: 50 }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
        >
          {coords.isDay ? (
            <div className="relative">
              <Sun className="text-yellow-400 drop-shadow-[0_0_35px_rgba(250,204,21,1)]" size={32} />
              <div className="absolute inset-0 bg-yellow-400/30 blur-3xl rounded-full scale-150 animate-pulse" />
            </div>
          ) : (
            <div className="relative">
              <Moon className="text-blue-300 drop-shadow-[0_0_35px_rgba(147,197,253,1)]" size={32} />
              <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
            </div>
          )}
        </motion.div>

        <div className="absolute bottom-0 w-full flex justify-between px-2 text-[10px] font-black uppercase tracking-widest">
          <div className="flex flex-col items-start gap-1">
            <span className="text-cyan-400/60">Sunrise</span>
            <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">{times.sunrise}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-orange-400/60">Sunset</span>
            <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">{times.sunset}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex justify-between text-[9px] font-bold text-white/40 uppercase tracking-widest">
          <span>Daylight Intensity</span>
          <span className="text-cyan-400">{Math.round((1 - coords.progress) * 100)}%</span>
        </div>
        <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(1 - coords.progress) * 100}%` }}
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
          />
        </div>
      </div>
    </motion.div>
  );
}