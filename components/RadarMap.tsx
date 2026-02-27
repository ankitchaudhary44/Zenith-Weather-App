"use client";

import { useEffect, useState, MouseEvent } from "react";
import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function RadarMap({ lat, lon }: { lat: number, lon: number }) {
  const [mounted, setMounted] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const backgroundGlow = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      rgba(34, 211, 238, 0.2),
      transparent 80%
    )
  `;

  useEffect(() => {
    setMounted(true);
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  if (!mounted) return <div className="h-[500px] w-full bg-white/5 animate-pulse rounded-[3.5rem]" />;

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] bg-[#020205] border border-cyan-500/40 shadow-[0_0_100px_-20px_rgba(34,211,238,0.5)] h-[550px] group transition-all duration-700"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] lg:rounded-[4rem] opacity-0 group-hover:opacity-100 transition duration-500 z-30"
        style={{ background: backgroundGlow }}
      />

      <div className="absolute top-10 left-12 z-[1000] space-y-2 pointer-events-none">
        <h3 className="text-white/50 text-[11px] font-black uppercase tracking-[0.6em] italic drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Global Intelligence Feed</h3>
        <div className="flex items-center gap-4">
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)]"
            />
            <p className="text-cyan-400 font-mono text-[10px] font-bold tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
              {lat.toFixed(4)}°N, {lon.toFixed(4)}°E // SECURE_UPLINK
            </p>
        </div>
      </div>

      <div className="absolute inset-4 rounded-[2rem] lg:rounded-[3.2rem] overflow-hidden border border-cyan-500/20 z-10 shadow-[inset_0_0_50px_rgba(34,211,238,0.2)]">
        <MapContainer 
          center={[lat, lon]} 
          zoom={10} 
          scrollWheelZoom={false} 
          style={{ height: "100%", width: "100%", filter: "invert(100%) hue-rotate(180deg) brightness(0.9) contrast(1.4) saturate(1.5)" }}
          attributionControl={false}
        >
          <ChangeView center={[lat, lon]} zoom={10} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <LayersControl position="topright">
            <LayersControl.Overlay checked name="Atmospheric Clouds">
              <TileLayer url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`} opacity={0.6} />
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Live Precipitation">
              <TileLayer url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`} opacity={0.7} />
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>

      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-[#020205]/40" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
      </div>

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent h-[15%] w-full animate-scan z-30 opacity-50" />
      
      <div className="absolute bottom-12 left-14 z-40 flex items-center gap-6">
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-2 border-dashed border-cyan-500/40 rounded-full flex items-center justify-center"
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,1)]" />
            </motion.div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[12px] md:text-[14px] font-[1000] text-white tracking-widest uppercase italic drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              Managed by <span className="text-cyan-400 underline decoration-cyan-500/50 underline-offset-4">Ankit Chaudhary</span>
            </span>
            
          </div>
      </div>
    </motion.div>
  );
}