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

async function getCityFromIP() {
  try {
    const res = await fetch("http://ip-api.com/json/", { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.status === "success" ? data.city : "Chennai";
  } catch {
    return "Chennai";
  }
}

async function getWeatherData(city: string) {
  const apiKey = process.env.WEATHER_API_KEY; 
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

  try {
    const currentRes = await fetch(currentUrl, { next: { revalidate: 60 } });
    if (!currentRes.ok) return null;
    const currentData = await currentRes.json();

    const { lat, lon } = currentData.coord;
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const forecastUrlOW = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,uv_index_max&timezone=auto`;
    
    const [aqiRes, owForecastRes, omForecastRes] = await Promise.all([
      fetch(aqiUrl),
      fetch(forecastUrlOW, { next: { revalidate: 60 } }),
      fetch(openMeteoUrl)
    ]);

    const aqiData = await aqiRes.json();
    const owForecastData = await owForecastRes.json();
    const omForecastData = await omForecastRes.json();

    return { 
      current: currentData, 
      aqi: aqiData,
      hourly: owForecastData, 
      daily: omForecastData 
    };
  } catch (error) {
    return null;
  }
}

export default async function Home({ searchParams }: { searchParams: Promise<{ city?: string }> }) {
  const params = await searchParams;
  const cityParam = params?.city;
  const city = cityParam || await getCityFromIP();
  const data = await getWeatherData(city);

  const weatherData = data?.current;
  const hourlyData = data?.hourly;
  const dailyData = data?.daily;
  const aqiData = data?.aqi;

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
        
        {!weatherData ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 px-6">
            <h2 className="text-5xl lg:text-7xl font-[1000] italic text-white/10 tracking-tighter uppercase leading-none">
              Signal Lost
            </h2>
            <div className="space-y-2">
              <p className="text-white/30 font-black tracking-[0.4em] uppercase text-[9px] lg:text-[10px]">Coordinate Data Not Found</p>
              <p className="text-white/10 text-[8px] lg:text-[9px] uppercase tracking-widest">Verify city name or try a major sector</p>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="lg:col-span-2">
                <CurrentWeather data={weatherData} />
              </div>
              
              <div className="group relative transition-all duration-700 hover:lg:-translate-y-3">
                <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[3rem] pointer-events-none border border-white/10 shadow-2xl"></div>
                <Forecast forecastData={dailyData} />
              </div>

              <div className="lg:col-span-1">
                <SunOrbit 
                  sunrise={weatherData.sys.sunrise} 
                  sunset={weatherData.sys.sunset} 
                />
              </div>

              <div className="lg:col-span-1">
                <AdvancedStats aqiData={aqiData} uvData={dailyData} />
              </div>
              
              <div className="lg:col-span-1 group relative transition-all duration-700 hover:lg:-translate-y-3">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] lg:rounded-[3.5rem] pointer-events-none z-10 border border-white/5 shadow-2xl"></div>
                <HourlyGraph forecastData={hourlyData} />
              </div>

              <div className="lg:col-span-3">
                <RadarMapWrapper 
                  lat={weatherData.coord.lat} 
                  lon={weatherData.coord.lon} 
                />
              </div>
            </div>
            
            <SystemLogs />
          </div>
        )}
      </div>
    </main>
  );
}