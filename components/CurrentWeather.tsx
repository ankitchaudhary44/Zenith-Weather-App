"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Cloud, Droplets, Wind, Sun, CloudRain, CloudLightning, Snowflake, CloudFog } from "lucide-react";
import { MouseEvent } from "react";

export default function CurrentWeather({ data }: { data: any }) {
  const cond = data.weather[0]?.main?.toLowerCase() || "";
  const isClear = cond.includes("clear");
  const isRainy = cond.includes("rain") || cond.includes("drizzle");
  const isThunder = cond.includes("thunder");
  const isSnowy = cond.includes("snow");
  const isCloudy = cond.includes("cloud") || cond.includes("overcast");
  const isMist = cond.includes("mist") || cond.includes("fog") || cond.includes("haze");
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`md:col-span-2 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 flex flex-col justify-between relative overflow-hidden group border transition-all duration-1000 ${
        isRainy ? 'bg-[#080b14]/90 border-blue-500/50 shadow-[0_0_80px_-20px_rgba(56,189,248,0.6)]' :
        isSnowy ? 'bg-[#f8fafc]/10 border-blue-200/50 shadow-[0_0_80px_-20px_rgba(255,255,255,0.3)]' :
        'bg-[#0a0a0f]/80 border-white/20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]'
      } backdrop-blur-[60px] cursor-none`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] md:rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition duration-500"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              1000px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className={`absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 blur-[100px] md:blur-[150px] rounded-full opacity-40 pointer-events-none ${
        isClear ? 'bg-yellow-400' : isRainy ? 'bg-blue-400' : 'bg-cyan-400'
      }`} />

      <div className="flex justify-between items-start z-10">
        <div className="space-y-2 md:space-y-4">
          <motion.h2 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-5xl md:text-8xl font-black text-white tracking-tighter italic drop-shadow-[0_15px_30px_rgba(255,255,255,0.2)]"
          >
            {data.name}
          </motion.h2>
          <div className="flex items-center gap-2 md:gap-4">
             <motion.div 
               animate={{ 
                 scale: [1, 1.8, 1], 
                 opacity: [0.6, 1, 0.6],
                 backgroundColor: isClear ? "#facc15" : "#60a5fa"
               }}
               transition={{ duration: 3, repeat: Infinity }}
               className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${isClear ? 'shadow-[0_0_20px_rgba(250,204,21,1)]' : 'shadow-[0_0_20px_rgba(96,165,250,1)]'}`}
             />
             <p className="text-white/70 capitalize font-black text-lg md:text-2xl tracking-[0.2em] uppercase italic drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
               {data.weather[0]?.description}
             </p>
          </div>
        </div>

        <motion.div
          animate={{ 
            y: [-10, 10, -10], 
            rotate: [-5, 5, -5],
            filter: ["brightness(1) blur(0px)", "brightness(1.5) blur(2px)", "brightness(1) blur(0px)"] 
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-20"
        >
          {isThunder ? <CloudLightning size={100} className="md:w-[150px] md:h-[150px] text-purple-400 drop-shadow-[0_0_50px_rgba(192,132,252,1)]" /> :
           isRainy ? <CloudRain size={100} className="md:w-[150px] md:h-[150px] text-blue-400 drop-shadow-[0_0_50px_rgba(56,189,248,1)]" /> :
           isSnowy ? <Snowflake size={100} className="md:w-[150px] md:h-[150px] text-blue-100 drop-shadow-[0_0_50px_rgba(255,255,255,1)]" /> :
           isMist ? <CloudFog size={100} className="md:w-[150px] md:h-[150px] text-gray-400 drop-shadow-[0_0_50px_rgba(255,255,255,0.4)]" /> :
           isCloudy ? <Cloud size={100} className="md:w-[150px] md:h-[150px] text-gray-300 drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]" /> :
           <Sun size={100} className="md:w-[150px] md:h-[150px] text-yellow-400 drop-shadow-[0_0_60px_rgba(250,204,21,1)]" />}
        </motion.div>
      </div>

      <div className="mt-4 md:mt-6 z-10 relative">
        <h1 className="text-[7rem] sm:text-[11rem] md:text-[16rem] leading-[0.8] font-[1000] tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/20 drop-shadow-[0_20px_80px_rgba(255,255,255,0.4)]">
          {Math.round(data.main.temp)}°
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 md:gap-8 mt-6 md:mt-8 z-10">
        <motion.div 
          whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.15)" }}
          className="flex items-center gap-4 bg-white/10 px-6 py-4 md:px-10 md:py-6 rounded-[2rem] md:rounded-[2.5rem] border border-white/20 backdrop-blur-3xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all"
        >
          <Droplets size={28} className="text-blue-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.8)]" />
          <div className="flex flex-col">
            <span className="text-white text-xl md:text-3xl font-black italic">{data.main.humidity}%</span>
            <span className="text-white/40 text-[8px] md:text-[10px] uppercase font-bold tracking-widest">Humidity</span>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.15)" }}
          className="flex items-center gap-4 bg-white/10 px-6 py-4 md:px-10 md:py-6 rounded-[2rem] md:rounded-[2.5rem] border border-white/20 backdrop-blur-3xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all"
        >
          <Wind size={28} className="text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.8)]" />
          <div className="flex flex-col">
            <span className="text-white text-xl md:text-3xl font-black italic">{data.wind.speed}</span>
            <span className="text-white/40 text-[8px] md:text-[10px] uppercase font-bold tracking-widest">m/s Wind</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}