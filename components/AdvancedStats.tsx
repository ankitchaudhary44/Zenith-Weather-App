"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Radiation } from "lucide-react";

export default function AdvancedStats({ aqiData, uvData }: { aqiData: any, uvData: any }) {
  const aqi = aqiData?.list[0]?.main?.aqi || 1;
  const uv = uvData?.daily?.uv_index_max[0] || 0;

  const aqiLabels: any = {
    1: { label: "EXCELLENT", color: "text-emerald-400", bg: "bg-emerald-400", glow: "shadow-[0_0_25px_rgba(52,211,153,0.6)]" },
    2: { label: "FAIR", color: "text-yellow-400", bg: "bg-yellow-400", glow: "shadow-[0_0_25px_rgba(250,204,21,0.6)]" },
    3: { label: "MODERATE", color: "text-orange-400", bg: "bg-orange-400", glow: "shadow-[0_0_25px_rgba(251,146,60,0.6)]" },
    4: { label: "POOR", color: "text-red-400", bg: "bg-red-400", glow: "shadow-[0_0_25px_rgba(248,113,113,0.6)]" },
    5: { label: "DANGEROUS", color: "text-purple-500", bg: "bg-purple-500", glow: "shadow-[0_0_35px_rgba(168,85,247,0.8)]" },
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <motion.div 
        whileHover={{ y: -5, scale: 1.01 }}
        className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] bg-[#0a0a0f]/60 backdrop-blur-[100px] border border-white/20 p-8 lg:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] flex-1 group"
      >
        <div className="flex justify-between items-start mb-6 z-10 relative">
          <div className="space-y-1">
            <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] italic">Atmospheric Toxicity</h3>
            <p className={`text-3xl font-[1000] italic ${aqiLabels[aqi].color} tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
              AQI: {aqi} ({aqiLabels[aqi].label})
            </p>
          </div>
          <ShieldAlert className={`${aqiLabels[aqi].color} drop-shadow-[0_0_20px_currentColor] opacity-80`} size={36} />
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden z-10 relative border border-white/10 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(aqi / 5) * 100}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
            className={`h-full ${aqiLabels[aqi].bg} ${aqiLabels[aqi].glow}`}
          />
        </div>
      </motion.div>

      <motion.div 
        whileHover={{ y: -5, scale: 1.01 }}
        className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] bg-[#0a0a0f]/60 backdrop-blur-[100px] border border-white/20 p-8 lg:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] flex-1 group"
      >
        <div className="flex justify-between items-start mb-6 z-10 relative">
          <div className="space-y-1">
            <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] italic">Solar Radiation Level</h3>
            <p className="text-3xl font-[1000] italic text-orange-400 tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(251,146,60,0.4)]">
              UV INDEX: {uv.toFixed(1)}
            </p>
          </div>
          <Radiation className="text-orange-400 animate-spin-slow drop-shadow-[0_0_20px_rgba(251,146,60,1)] opacity-80" size={36} />
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden z-10 relative border border-white/10 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((uv / 12) * 100, 100)}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="h-full bg-orange-400 shadow-[0_0_30px_rgba(251,146,60,0.8)]"
          />
        </div>
      </motion.div>
    </div>
  );
}