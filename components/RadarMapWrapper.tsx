"use client";

import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled to prevent window-related errors
const Map = dynamic(() => import('./RadarMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-[450px] w-full bg-white/5 animate-pulse rounded-[2.5rem] lg:rounded-[3.5rem] border border-white/10 flex items-center justify-center">
       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
         Initializing Satellite Mapping...
       </span>
    </div>
  )
});

export default function RadarMapWrapper({ lat, lon }: { lat: number, lon: number }) {
  return (
    <div className="w-full">
      <Map lat={lat} lon={lon} />
    </div>
  );
}