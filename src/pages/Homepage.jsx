import { useState, useEffect } from "react";
import useWeather from "../hooks/useWeather";
import useForecast from "../hooks/useForecast";
import useDebounce from "../hooks/useDebounce";
import useGeolocation from "../hooks/useGeolocation";
import useAirPollution from "../hooks/useAirPollution";

import WeatherReport from "../components/WeatherReport";
import WeatherSkeleton from "../components/WeatherSkeleton";
import ErrorState from "../components/ErrorState";
import ForecastChart from "../components/ForecastChart";
import ForecastCards from "../components/ForecastCards";
import RainChart from "../components/RainChart";
import AirQuality from "../components/AirQuality";
import WeatherMap from "../components/WeatherMap";
import WeatherEffects from "../components/WeatherEffects";
import ThemeToggle from "../components/ThemeToggle";

import { formatForecast } from "../utils/formatForecast";
import { Search, MapPin } from "lucide-react";
import Brand from "../components/Brand";

export default function HomePage() {
	const [input, setInput] = useState("");
	const [city, setCity] = useState("");

	const coords = useGeolocation();
	const debouncedInput = useDebounce(input);

	const { data, isLoading, error } = useWeather(
		debouncedInput || city
	);

	useEffect(() => {
		if (coords && !input) {
			setCity(`${coords.lat},${coords.lon}`);
		}
	}, [coords]);

	const { data: forecastData } = useForecast(data?.name);

	const formattedForecast =
		forecastData?.list
			? formatForecast(forecastData.list)
			: [];

	const { data: airData } = useAirPollution(
		data?.coord?.lat,
		data?.coord?.lon
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-slate-900 dark:to-slate-800 px-4 md:px-8 py-6 space-y-8">

			{/* 🌧 Weather Animation */}
			{data && <WeatherEffects type={data.weather[0].main} />}

			<div className="max-w-6xl mx-auto flex items-center justify-between gap-3">

				{/* Left: Branding */}
				<Brand />

				{/* Center: Search */}
				<div className="flex flex-1 max-w-md items-center bg-white dark:bg-gray-800 rounded-full shadow px-4 py-2 mx-4">
					<Search size={18} className="text-gray-500 dark:text-gray-300" />
					<input
						className="flex-1 px-2 outline-none bg-transparent text-gray-800 dark:text-white"
						placeholder="Search city..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
				</div>

				{/* Right: Controls */}
				<div className="flex items-center gap-2">
					<ThemeToggle />
				</div>

			</div>

			{/* 📍 Location Info */}
			{coords && !input && (
				<div className="text-center text-sm text-gray-600 dark:text-gray-300 flex justify-center items-center gap-1">
					<MapPin size={14} />
					Using your current location
				</div>
			)}

			{/* 📦 MAIN DASHBOARD */}
			<div className="max-w-6xl mx-auto space-y-8">

				{/* Loading / Error */}
				{isLoading && <WeatherSkeleton />}
				{error && <ErrorState />}

				{/* 🔥 TOP SECTION */}
				{data && (
					<div className="grid lg:grid-cols-3 gap-6">

						{/* Weather */}
						<div className="lg:col-span-2">
							<WeatherReport val={data} />
						</div>

						{/* AQI */}
						<div>
							{airData && <AirQuality data={airData} />}
						</div>
					</div>
				)}

				{/* 🗺 MAP */}
				{data && (
					<div>
						<WeatherMap
							lat={data.coord.lat}
							lon={data.coord.lon}
							city={data.name}
						/>
					</div>
				)}

				{/* 📊 FORECAST SECTION */}
				{formattedForecast.length > 0 && (
					<div className="space-y-6">

						{/* Cards */}
						<ForecastCards data={formattedForecast} />

						{/* Charts */}
						<div className="grid md:grid-cols-2 gap-6">
							<ForecastChart data={formattedForecast} />
							{forecastData?.list && (
								<RainChart list={forecastData.list} />
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}