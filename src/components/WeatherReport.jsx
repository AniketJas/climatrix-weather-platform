import {
	Droplets,
	Wind,
	Eye,
	Gauge,
	Sunrise,
	Sunset,
	MapPin
} from "lucide-react";
import { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme";

export default function WeatherReport({ val }) {
	if (!val || val.cod !== 200) {
		return <p className="text-center text-red-500">City not found</p>;
	}

	const { setTheme } = useTheme();
	const [currentTime, setCurrentTime] = useState("");

	const weather = val.weather[0];

	const data = {
		city: val.name,
		country: val.sys.country,
		temp: val.main.temp,
		feels: val.main.feels_like,
		tempMin: val.main.temp_min,
		tempMax: val.main.temp_max,
		humidity: val.main.humidity,
		pressure: val.main.pressure,
		visibility: val.visibility,
		windSpeed: val.wind.speed,
		windDeg: val.wind.deg,
		clouds: val.clouds.all,
		sunrise: val.sys.sunrise,
		sunset: val.sys.sunset,
		timezone: val.timezone,
		dt: val.dt,
		icon: weather.icon,
		description: weather.description,
		lat: val.coord.lat,
		lon: val.coord.lon
	};

	const isNight = data.dt < data.sunrise || data.dt > data.sunset;

	// ✅ Safe auto theme
	useEffect(() => {
		if (!localStorage.theme && isNight !== undefined) {
			setTheme(isNight ? "dark" : "light");
		}
	}, [isNight]);

	// ✅ Live city clock
	useEffect(() => {
		if (!data.timezone) return;

		const updateTime = () => {
			const now = new Date();

			const utc = now.getTime() + now.getTimezoneOffset() * 60000;
			const cityTime = new Date(utc + data.timezone * 1000);

			setCurrentTime(
				cityTime.toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					hour12: true,
				})
			);
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, [data.timezone]);

	// ✅ Sunrise / Sunset (correct timezone)
	const formatTime = (ts) => {
		const date = new Date((ts + data.timezone) * 1000);

		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
			timeZone: "UTC",
		});
	};

	const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

	const getWindDir = (deg) => {
		const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
		return dirs[Math.round(deg / 45) % 8];
	};

	const bg = isNight
		? "from-slate-900 via-slate-800 to-slate-700 text-white"
		: "from-blue-100 via-indigo-100 to-purple-200 text-gray-800";

	return (
		<div className={`p-6 rounded-2xl bg-gradient-to-br ${bg} shadow-xl space-y-6`}>

			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<p className="text-xl font-semibold flex items-center gap-2">
						<MapPin size={18} />
						{data.city}, {data.country}
					</p>

					<p className="text-sm opacity-70 capitalize">
						{data.description}
					</p>

					{/* Live Clock */}
					<p className="text-sm opacity-70">
						{currentTime || "--:--"}
					</p>
				</div>

				<img
					src={iconUrl}
					alt="weather icon"
					className="w-20 h-20"
				/>
			</div>

			{/* Temperature */}
			<div className="text-center">
				<p className="text-5xl font-bold">{Math.round(data.temp)}°C</p>
				<p className="text-sm">
					Feels like {Math.round(data.feels)}°C
				</p>
				<p className="text-xs opacity-80">
					H: {Math.round(data.tempMax)}°C • L: {Math.round(data.tempMin)}°C
				</p>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm items-stretch">
				<Stat icon={<Droplets size={16} />} label="Humidity" value={`${data.humidity}%`} type="humidity" />
				<Stat icon={<Wind size={16} />} label="Wind" value={`${data.windSpeed} m/s (${getWindDir(data.windDeg)})`} type="wind" />
				<Stat icon={<Eye size={16} />} label="Visibility" value={`${(data.visibility / 1000).toFixed(1)} km`} type="visibility" />
				<Stat icon={<Gauge size={16} />} label="Pressure" value={`${data.pressure} hPa`} type="pressure" />
			</div>

			{/* Sun */}
			<div className="grid grid-cols-2 gap-4 text-sm items-stretch">
				<Stat icon={<Sunrise size={18} />} label="Sunrise" value={formatTime(data.sunrise)} type="sunrise" />
				<Stat icon={<Sunset size={18} />} label="Sunset" value={formatTime(data.sunset)} type="sunset" />
			</div>

			{/* Footer */}
			<div className="text-xs text-center opacity-70">
				Lat: {data.lat} • Lon: {data.lon} • Clouds: {data.clouds}%
			</div>
		</div>
	);
}

// 🔹 Stat Component
function Stat({ icon, label, value, type }) {
	const colorMap = {
		humidity: "text-blue-500",
		wind: "text-teal-500",
		visibility: "text-indigo-500",
		pressure: "text-purple-500",
		sunrise: "text-orange-400",
		sunset: "text-pink-400",
	};

	return (
		<div className="bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-xl p-3 flex flex-col gap-1">
			<div className="flex items-center gap-2">
				<div className="opacity-80">{icon}</div>
				<p className="text-xs opacity-70">{label}</p>
			</div>

			<p className={`text-lg md:text-xl font-bold ${colorMap[type] || "text-gray-800 dark:text-white"}`}>
				{value}
			</p>
		</div>
	);
}