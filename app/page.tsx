"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import CurrentWeather from "@/components/CurrentWeather";
import SearchBar from "@/components/SearchBar";
import Forecast from "@/components/Forecast";
import HourlyGraph from "@/components/HourlyGraph";
import Background from "@/components/Background";
import RainOverlay from "@/components/RainOverlay";
import AdvancedStats from "@/components/AdvancedStats";
import SunOrbit from "@/components/SunOrbit";
import SystemLogs from "@/components/SystemLogs";

const RadarMapWrapper = dynamic(
  () => import("@/components/RadarMapWrapper"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[550px] w-full bg-[#0a0a0f]/50 animate-pulse rounded-[2.5rem] lg:rounded-[4rem] border border-white/5 flex items-center justify-center">
        <span className="text-cyan-400/20 text-[10px] font-black uppercase tracking-[0.5em]">Initializing Satellite Mapping...</span>
      </div>
    )
  }
);

function HomeContent() {
  const searchParams = useSearchParams();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [hourlyData, setHourlyData] = useState<any>(null);
  const [dailyData, setDailyData] = useState<any>(null);
  const [aqiData, setAqiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const fetchAllData = async (query: string | { lat: number; lon: number }) => {
    setLoading(true);
    try {
      let currentUrl = "";
      if (typeof query === "string") {
        currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&appid=${apiKey}`;
      } else {
        currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${query.lat}&lon=${query.lon}&units=metric&appid=${apiKey}`;
      }

      const currentRes = await fetch(currentUrl);
      if (!currentRes.ok) throw new Error();
      const currentData = await currentRes.json();

      const { lat, lon } = currentData.coord;
      const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const forecastUrlOW = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,uv_index_max&timezone=auto`;

      const [aqiRes, owForecastRes, omForecastRes] = await Promise.all([
        fetch(aqiUrl),
        fetch(forecastUrlOW),
        fetch(openMeteoUrl)
      ]);

      setWeatherData(currentData);
      setAqiData(await aqiRes.json());
      setHourlyData(await owForecastRes.json());
      setDailyData(await omForecastRes.json());
    } catch (error) {
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cityParam = searchParams.get("city");
    const latParam = searchParams.get("lat");
    const lonParam = searchParams.get("lon");

    if (latParam && lonParam) {
      fetchAllData({ 
        lat: parseFloat(latParam), 
        lon: parseFloat(lonParam) 
      });
    } else if (cityParam) {
      fetchAllData(cityParam);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchAllData({ 
            lat: position.coords.latitude, 
            lon: position.coords.longitude 
          });
        },
        async () => {
          try {
            const res = await fetch("https://ipapi.co/json/");
            const data = await res.json();
            fetchAllData(data.city || "Vellore");
          } catch {
            fetchAllData("Vellore");
          }
        }
      );
    } else {
      fetchAllData("Vellore");
    }
  }, [searchParams]);

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start lg:justify-center p-4 sm:p-8 lg:p-12 overflow-x-hidden bg-[#020205]">
      <Background condition={weatherData?.weather[0]?.main} />
      <RainOverlay condition={weatherData?.weather[0]?.main} />
      
      <div className="z-10 w-full max-w-6xl flex flex-col items-center mt-10 lg:mt-0">
        <div className="w-full flex justify-end items-center mb-6 lg:mb-8 px-4">
          <div className="flex flex-col items-end text-white/40">
            <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] italic">{currentDate}</span>
          </div>
        </div>

        <SearchBar />
        
        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>
          </div>
        ) : !weatherData ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 px-6">
            <h2 className="text-5xl lg:text-7xl font-[1000] italic text-white/10 tracking-tighter uppercase leading-none">
              Signal Lost
            </h2>
          </div>
        ) : (
          <div className="w-full space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="lg:col-span-2">
                <CurrentWeather data={weatherData} />
              </div>
              <div className="group relative transition-all duration-700 hover:lg:-translate-y-3">
                <Forecast forecastData={dailyData} />
              </div>
              <div className="lg:col-span-1">
                <SunOrbit sunrise={weatherData.sys.sunrise} sunset={weatherData.sys.sunset} />
              </div>
              <div className="lg:col-span-1">
                <AdvancedStats aqiData={aqiData} uvData={dailyData} />
              </div>
              <div className="lg:col-span-1 group relative transition-all duration-700 hover:lg:-translate-y-3">
                <HourlyGraph forecastData={hourlyData} />
              </div>
              <div className="lg:col-span-3">
                <RadarMapWrapper lat={weatherData.coord.lat} lon={weatherData.coord.lon} />
              </div>
            </div>
            <SystemLogs />
          </div>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}