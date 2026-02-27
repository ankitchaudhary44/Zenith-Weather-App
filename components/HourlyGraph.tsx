"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function HourlyGraph({ forecastData }: { forecastData: any }) {
  if (!forecastData) return null;

  const data = forecastData.list.slice(0, 8).map((item: any) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp),
  }));

  const temps = data.map((d: any) => d.temp);
  const minTemp = Math.min(...temps) - 2;
  const maxTemp = Math.max(...temps) + 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] bg-[#0a0a0f]/60 backdrop-blur-[100px] border border-cyan-500/20 p-8 h-[400px] shadow-[0_0_50px_-10px_rgba(34,211,238,0.2)] group transition-all duration-700 hover:border-cyan-400/40"
    >
      <div className="flex justify-between items-center mb-6 relative z-20">
        <div>
          <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-1 italic">Holographic Telemetry</h3>
          <p className="text-white text-xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Hourly Temperature</p>
        </div>
        <div className="flex gap-2">
          <motion.div 
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.2, 1] }} 
            transition={{ duration: 2, repeat: Infinity }} 
            className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]" 
          />
        </div>
      </div>

      <div className="absolute inset-0 z-10 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_rgba(34,211,238,0.15),_transparent_70%)]" />

      <div className="h-[260px] w-full relative z-20">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 900 }} 
              dy={15}
            />
            <YAxis hide domain={[minTemp, maxTemp]} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#020205]/95 backdrop-blur-2xl border border-cyan-500/30 p-4 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                      <p className="text-white/40 text-[8px] font-black uppercase tracking-widest mb-1 italic">{payload[0].payload.time}</p>
                      <p className="text-cyan-400 text-2xl font-black italic drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">{payload[0].value}°</p>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: 'rgba(34,211,238,0.4)', strokeWidth: 2, strokeDasharray: '5 5' }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#22d3ee"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#neonGradient)"
              animationDuration={2500}
              dot={{ r: 4, fill: '#22d3ee', strokeWidth: 2, stroke: '#020205', opacity: 1 }}
              activeDot={{ r: 6, fill: '#fff', strokeWidth: 0, shadow: "0 0 15px #fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute bottom-8 left-10 right-10 flex justify-between items-end opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="text-[7px] font-mono text-cyan-400 tracking-[0.3em] font-bold uppercase">Signal_Link: Stable</div>
        <div className="text-[7px] font-mono text-cyan-400 tracking-[0.3em] font-bold uppercase">Data_Stream: Encrypted_AES256</div>
      </div>
    </motion.div>
  );
}