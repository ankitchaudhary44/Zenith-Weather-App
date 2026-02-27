"use client";

import { motion } from "framer-motion";

export default function SystemLogs() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0a0a0f]/60 backdrop-blur-md border-t border-white/5 py-2 px-6 flex justify-between items-center z-[100]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3] }} 
            transition={{ duration: 2, repeat: Infinity }} 
            className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
          />
          <span className="text-[7px] font-black text-emerald-500/50 uppercase tracking-[0.3em]">System Health: Optimal</span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">SSL_Link: Encrypted_AES256</span>
      </div>
      
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="text-[7px] font-black text-cyan-500/30 uppercase tracking-[0.2em] italic whitespace-nowrap">
           <motion.div
             animate={{ x: [200, -400] }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           >
             Scanning Satellite Streams... Fetching Local Telemetry... Syncing Coordinates...
           </motion.div>
        </div>
      </div>

      <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.4em]">V.2.0.26_LINK_SECURED</span>
    </div>
  );
}