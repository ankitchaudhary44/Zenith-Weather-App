"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CurrentWeather from "@/components/CurrentWeather";
import SearchBar from "@/components/SearchBar";
import Forecast from "@/components/Forecast";
import HourlyGraph from "@/components/HourlyGraph";
import Background from "@/components/Background";
import RainOverlay from "@/components/RainOverlay";
import AdvancedStats from "@/components/AdvancedStats";
import SunOrbit from "@/components/SunOrbit";
import SystemLogs from "@/components/SystemLogs";
import RadarMapWrapper from "@/components/RadarMapWrapper";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("city");

  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function getWeatherData(query: string | { lat: number; lon: number }) {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    let currentUrl = "";

    if (typeof query === "string") {
      currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&appid=${apiKey}`;
    } else {
      currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${query.lat}&lon=${query.lon}&units=metric&appid=${apiKey}`;
    }

    try {
      const currentRes = await fetch(currentUrl);
      if (!currentRes.ok) return null;
      const currentData = await currentRes.json();

      const { lat, lon } = currentData.coord;
      const city = currentData.name;
      const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const forecastUrlOW = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
      const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,uv_index_max&timezone=auto`;

      const [aqiRes, owForecastRes, omForecastRes] = await Promise.all([
        fetch(aqiUrl),
        fetch(forecastUrlOW),
        fetch(openMeteoUrl),
      ]);

      return {
        current: currentData,
        aqi: await aqiRes.json(),
        hourly: await owForecastRes.json(),
        daily: await omForecastRes.json(),
      };
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const initWeather = async () => {
      setLoading(true);

      if (cityParam) {
        const data = await getWeatherData(cityParam);
        setWeatherData(data);
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const data = await getWeatherData({ lat: latitude, lon: longitude });
            setWeatherData(data);
          },
          async () => {
            const res = await fetch("http://ip-api.com/json/");
            const ipData = await res.json();
            const fallbackCity = ipData.status === "success" ? ipData.city : "Chennai";
            const data = await getWeatherData(fallbackCity);
            setWeatherData(data);
          }
        );
      }
      setLoading(false);
    };

    initWeather();
  }, [cityParam]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (loading) return <div className="min-h-screen bg-[#020205]" />;

  const data = weatherData?.current;
  const hourlyData = weatherData?.hourly;
  const dailyData = weatherData?.daily;
  const aqiData = weatherData?.aqi;

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start lg:justify-center p-4 sm:p-8 lg:p-12 overflow-x-hidden bg-[#020205]">
      <Background condition={data?.weather[0]?.main} />
      <RainOverlay condition={data?.weather[0]?.main} />

      <div className="z-10 w-full max-w-6xl flex flex-col items-center mt-10 lg:mt-0">
        <div className="w-full flex justify-end items-center mb-6 lg:mb-8 px-4">
          <div className="flex flex-col items-end text-white/40">
            <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] italic">
              {currentDate}
            </span>
          </div>
        </div>

        <SearchBar />

        {!data ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 px-6">
            <h2 className="text-5xl lg:text-7xl font-[1000] italic text-white/10 tracking-tighter uppercase leading-none">
              Signal Lost
            </h2>
            <div className="space-y-2">
              <p className="text-white/30 font-black tracking-[0.4em] uppercase text-[9px] lg:text-[10px]">
                Coordinate Data Not Found
              </p>
              <p className="text-white/10 text-[8px] lg:text-[9px] uppercase tracking-widest">
                Verify city name or try a major sector
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="lg:col-span-2">
                <CurrentWeather data={data} />
              </div>

              <div className="group relative transition-all duration-700 hover:lg:-translate-y-3">
                <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[3rem] pointer-events-none border border-white/10 shadow-2xl"></div>
                <Forecast forecastData={dailyData} />
              </div>

              <div className="lg:col-span-1">
                <SunOrbit sunrise={data.sys.sunrise} sunset={data.sys.sunset} />
              </div>

              <div className="lg:col-span-1">
                <AdvancedStats aqiData={aqiData} uvData={dailyData} />
              </div>

              <div className="lg:col-span-1 group relative transition-all duration-700 hover:lg:-translate-y-3">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] lg:rounded-[3.5rem] pointer-events-none z-10 border border-white/5 shadow-2xl"></div>
                <HourlyGraph forecastData={hourlyData} />
              </div>

              <div className="lg:col-span-3">
                <RadarMapWrapper lat={data.coord.lat} lon={data.coord.lon} />
              </div>
            </div>

            <SystemLogs />
          </div>
        )}
      </div>
    </main>
  );
}