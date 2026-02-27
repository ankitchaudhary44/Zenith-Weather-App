"use client";

import { useState, useEffect, useRef } from "react";
import { Search, History, MapPin, Mic, MicOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar() {
  const [city, setCity] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (city.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=en&format=json`);
        const data = await res.json();
        if (data.results) {
          setSuggestions(data.results);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Geocoding Error:", error);
      }
    };

    const timeoutId = setTimeout(fetchCities, 300);
    return () => clearTimeout(timeoutId);
  }, [city]);

  const handleSearch = (e?: React.FormEvent, selectedCity?: string) => {
    if (e) e.preventDefault();
    const targetCity = selectedCity || city;

    if (targetCity.trim() !== "") {
      const newHistory = [targetCity, ...history.filter(c => c !== targetCity)].slice(0, 3);
      setHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      router.push(`/?city=${encodeURIComponent(targetCity)}`);
      setCity("");
      setShowDropdown(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCity(transcript);
      handleSearch(undefined, transcript);
    };

    recognition.start();
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-8 md:mb-12 z-[110] relative px-4 md:px-0" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative group">
        <motion.div
          animate={isFocused || isListening ? { opacity: [0.1, 0.3, 0.1] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute -inset-1 rounded-[2.5rem] blur-2xl pointer-events-none bg-gradient-to-r ${isListening ? 'from-red-500 to-orange-500' : 'from-yellow-400 to-orange-500'}`}
        />
        
        <div className="relative flex items-center">
          <div className={`absolute left-5 md:left-6 transition-colors duration-300 ${isFocused ? 'text-yellow-400' : 'text-white/20'}`}>
            <Search size={20} strokeWidth={2.5} />
          </div>
          
          <input
            type="text"
            placeholder={isListening ? "Listening..." : "Search city..."}
            value={city}
            onFocus={() => { setIsFocused(true); if(city.length >= 2) setShowDropdown(true); }}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-28 md:pl-16 md:pr-40 py-4 md:py-5 rounded-[2.2rem] backdrop-blur-3xl outline-none focus:border-yellow-400/30 transition-all placeholder:text-white/10 text-sm md:text-lg font-bold italic tracking-tight shadow-2xl"
          />

          <div className="absolute right-2 md:right-3 flex items-center gap-1 md:gap-2">
            <button
              type="button"
              onClick={startListening}
              className={`p-2 md:p-3 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-white/20 hover:text-yellow-400 hover:bg-white/5'}`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button 
              type="submit" 
              className="bg-yellow-400 text-black px-4 md:px-8 py-2 md:py-3.5 rounded-[1.5rem] md:rounded-[1.8rem] font-black italic uppercase text-[9px] md:text-[11px] tracking-[0.1em] md:tracking-[0.15em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(250,204,21,0.3)]"
            >
              SEARCH
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute w-full mt-4 bg-[#0a0a0f]/95 backdrop-blur-[50px] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden z-[120]"
          >
            {suggestions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSearch(undefined, item.name)}
                className="px-6 md:px-8 py-4 md:py-5 cursor-pointer hover:bg-white/5 transition-all flex items-center gap-4 md:gap-5 border-b border-white/5 last:border-none group"
              >
                <div className="p-2 md:p-3 bg-white/5 rounded-xl md:rounded-2xl group-hover:bg-yellow-400/20 transition-colors">
                  <MapPin size={18} className="text-white/30 group-hover:text-yellow-400 transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-black italic text-base md:text-lg tracking-tight group-hover:translate-x-1 transition-transform">{item.name}</span>
                  <span className="text-white/30 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">
                    {item.admin1 ? `${item.admin1} • ` : ''}{item.country}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!showDropdown && history.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 md:mt-6 justify-center">
          {history.map((c) => (
            <motion.button 
              key={c} 
              whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.08)" }}
              onClick={() => handleSearch(undefined, c)} 
              className="text-[8px] md:text-[9px] uppercase font-black italic tracking-[0.2em] bg-white/5 border border-white/10 px-4 md:px-6 py-2 md:py-2.5 rounded-full text-white/30 hover:text-white transition-all flex items-center gap-2 shadow-lg"
            >
              <History size={12} className="opacity-40" /> {c}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}