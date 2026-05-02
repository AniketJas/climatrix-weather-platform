const BASE = import.meta.env.VITE_OPEN_WEATHER_API_BASE;
const KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

export async function fetchWeather(city) {
  const res = await fetch(`${BASE}weather?q=${city}&units=metric&APPID=${KEY}`);
  if (!res.ok) throw new Error("Weather fetch failed");
  return res.json();
}

export async function fetchForecast(city) {
  const res = await fetch(`${BASE}forecast?q=${city}&units=metric&APPID=${KEY}`);
  if (!res.ok) throw new Error("Forecast fetch failed");
  return res.json();
}

export async function fetchAirPollution(lat, lon) {
  const res = await fetch(
    `${BASE}air_pollution?lat=${lat}&lon=${lon}&appid=${KEY}`
  );
  if (!res.ok) throw new Error("AQI fetch failed");
  return res.json();
}