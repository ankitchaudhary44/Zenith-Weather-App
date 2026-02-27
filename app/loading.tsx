"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden bg-[#020205]">
      
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="z-10 w-full max-w-6xl flex flex-col items-center">
        
        <div className="w-full flex justify-end mb-8 px-4">
          <div className="h-4 w-32 bg-white/5 rounded-full animate-pulse" />
        </div>

        
        <div className="w-full max-w-xl h-16 bg-white/5 rounded-[2.2rem] border border-white/10 mb-12 animate-pulse relative overflow-hidden">
           <motion.div 
             animate={{ x: ['-100%', '100%'] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-1/2"
           />
        </div>

        
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          
          <div className="lg:col-span-2 h-[450px] rounded-[3.5rem] bg-white/5 border border-white/10 p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="h-20 w-3/4 bg-white/10 rounded-3xl" />
              <div className="h-6 w-1/4 bg-white/5 rounded-full" />
            </div>
            <div className="h-40 w-1/2 bg-white/10 rounded-3xl self-start mt-8" />
            <div className="flex gap-4 mt-8">
              <div className="h-20 w-40 bg-white/5 rounded-3xl" />
              <div className="h-20 w-40 bg-white/5 rounded-3xl" />
            </div>
            
            <motion.div 
              animate={{ y: [0, 450, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-blue-400/20 blur-sm z-20"
            />
          </div>

          
          <div className="h-full rounded-[3rem] bg-white/5 border border-white/10 p-8 space-y-4">
            <div className="h-4 w-1/2 bg-white/10 rounded-full mb-6" />
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-12 w-full bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>

         
          <div className="rounded-[3.5rem] bg-white/5 border border-white/10 p-12 space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 w-20 bg-white/5 rounded-full" />
                <div className="h-8 w-16 bg-white/10 rounded-xl" />
              </div>
            ))}
          </div>

          
          <div className="lg:col-span-2 h-[400px] rounded-[3.5rem] bg-white/5 border border-white/10 p-8 relative overflow-hidden">
             <div className="h-4 w-32 bg-white/10 rounded-full mb-8" />
             <div className="absolute inset-x-8 bottom-8 top-24 border-b border-l border-white/10 flex items-end">
                <motion.div 
                  animate={{ height: ['20%', '60%', '40%', '80%', '30%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full bg-gradient-to-t from-cyan-400/20 to-transparent rounded-t-3xl"
                />
             </div>
          </div>

        </div>
      </div>

      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.p 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-400/60 italic"
        >
          Initializing Satellite Link...
        </motion.p>
      </div>
    </main>
  );
}