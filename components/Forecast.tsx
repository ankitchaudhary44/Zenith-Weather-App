"use client";

import { motion } from "framer-motion";
import { Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog } from "lucide-react";

export default function Forecast({ forecastData }: { forecastData: any }) {
  if (!forecastData || !forecastData.daily) return null;

  const getWeatherIcon = (code: number) => {
    if (code >= 95) return <CloudLightning className="text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]" size={24} />;
    if (code >= 51 && code <= 67) return <CloudRain className="text-blue-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]" size={24} />;
    if (code >= 71 && code <= 77) return <Snowflake className="text-blue-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" size={24} />;
    if (code >= 1 && code <= 3) return <Cloud className="text-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" size={24} />;
    if (code >= 45 && code <= 48) return <CloudFog className="text-gray-400" size={24} />;
    return <Sun className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" size={24} />;
  };

  const getConditionName = (code: number) => {
    if (code === 0) return "Clear";
    if (code <= 3) return "Cloudy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 95) return "Storm";
    return "Weather";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-[3rem] bg-[#0a0a0f]/40 backdrop-blur-[80px] border border-white/10 p-8 flex flex-col h-full shadow-2xl transition-all duration-700 hover:border-white/20"
    >
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] italic">7-Day Projection</h3>
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }} 
          transition={{ duration: 2, repeat: Infinity }} 
          className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
        />
      </div>

      <div className="space-y-1 relative z-10">
        {forecastData.daily.time.map((dateStr: string, index: number) => {
          const date = new Date(dateStr);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const temp = forecastData.daily.temperature_2m_max[index];
          const code = forecastData.daily.weather_code[index];

          return (
            <motion.div
              key={index}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group/item flex items-center justify-between py-3 px-4 rounded-2xl hover:bg-white/5 transition-all duration-300"
            >
              <span className="text-white/50 font-black italic text-[11px] tracking-tight w-10 group-hover/item:text-white transition-colors">
                {dayName.toUpperCase()}
              </span>
              
              <div className="flex items-center gap-4 flex-1 justify-center">
                {getWeatherIcon(code)}
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/10 group-hover/item:text-white/40 transition-colors">
                  {getConditionName(code)}
                </span>
              </div>

              <span className="text-white font-black italic text-lg tracking-tighter w-10 text-right">
                {Math.round(temp)}°
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}