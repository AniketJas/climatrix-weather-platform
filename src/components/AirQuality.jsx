export default function AirQuality({ data }) {
  const aqi = data?.list?.[0]?.main?.aqi;
  const comp = data?.list?.[0]?.components;

  if (!aqi || !comp) return null;

  const levels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

  const colors = [
    "text-green-500",
    "text-lime-500",
    "text-yellow-500",
    "text-orange-500",
    "text-red-500",
  ];

  const bgColors = [
    "bg-green-500",
    "bg-lime-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-red-500",
  ];

  const advice = [
    "Air quality is excellent. Enjoy outdoor activities.",
    "Air is acceptable. Sensitive individuals should take care.",
    "Limit prolonged outdoor exertion if sensitive.",
    "Avoid outdoor activities. Consider wearing a mask.",
    "Stay indoors. Use air purifiers if possible.",
  ];

  const index = aqi - 1;

  // 🔹 pollutant thresholds (WHO-style simplified)
  const thresholds = {
    pm2_5: 25,
    pm10: 50,
    no2: 200,
    so2: 40,
    o3: 100,
    co: 10000,
  };

  // 🔹 normalize pollutants into array
  const pollutants = [
    { key: "pm2_5", label: "PM2.5", value: comp.pm2_5 },
    { key: "pm10", label: "PM10", value: comp.pm10 },
    { key: "no2", label: "NO₂", value: comp.no2 },
    { key: "so2", label: "SO₂", value: comp.so2 },
    { key: "o3", label: "O₃", value: comp.o3 },
    { key: "co", label: "CO", value: comp.co },
  ];

  // 🔹 sort by severity (ratio vs threshold)
  const sorted = pollutants
    .map((p) => ({
      ...p,
      ratio: p.value / thresholds[p.key],
    }))
    .sort((a, b) => b.ratio - a.ratio);

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-5 shadow-xl space-y-5">

      {/* AQI Header */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Air Quality Index
        </h2>

        <p className={`text-4xl font-bold ${colors[index]}`}>
          {aqi}
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          {levels[index]}
        </p>
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          className={`h-3 ${bgColors[index]} transition-all`}
          style={{ width: `${(aqi / 5) * 100}%` }}
        />
      </div>

      {/* Advice */}
      <div className="text-sm text-center text-gray-700 dark:text-gray-300 bg-white/40 dark:bg-gray-700/40 p-3 rounded-xl">
        {advice[index]}
      </div>

      {/* Pollutants */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Pollutants (ranked by severity)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sorted.map((p) => {
            const isDanger = p.value > thresholds[p.key];

            return (
              <div
                key={p.key}
                className={`rounded-lg p-3 text-center shadow-sm border
                  ${isDanger
                    ? "border-red-400 bg-red-50 dark:bg-red-900/30"
                    : "bg-white/60 dark:bg-gray-700/60 border-transparent"
                  }`}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {p.label}
                </p>

                <p
                  className={`font-semibold ${isDanger
                    ? "text-red-500"
                    : "text-gray-800 dark:text-white"
                    }`}
                >
                  {p.value} μg/m³
                </p>

                {isDanger && (
                  <p className="text-[10px] text-red-500">
                    High
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}