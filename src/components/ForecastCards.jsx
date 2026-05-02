export default function ForecastCards({ data }) {
  // 🔹 format date → "Mon 03-05"
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);

    const day = d.toLocaleDateString("en-US", {
      weekday: "short",
    });

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");

    return `${day} ${dd}-${mm}`;
  };

  const today = new Date().toDateString();

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {data.map((d, index) => {
        const isToday =
          new Date(d.date).toDateString() === today;

        return (
          <div
            key={d.date}
            className={`rounded-2xl p-4 text-center shadow-lg backdrop-blur-lg transition-transform hover:scale-105
              ${isToday
                ? "bg-indigo-500 text-white"
                : "bg-white/70 dark:bg-gray-800/70"
              }`}
          >
            {/* Today Badge */}
            {isToday && (
              <p className="text-xs font-medium mb-1">
                Today
              </p>
            )}

            {/* Date */}
            <p
              className={`text-sm font-medium ${isToday
                ? "text-white"
                : "text-gray-700 dark:text-gray-300"
                }`}
            >
              {formatDate(d.date)}
            </p>

            {/* Icon */}
            <img
              src={`https://openweathermap.org/img/wn/${d.icon}@2x.png`}
              alt="weather icon"
              className="mx-auto w-14 h-14"
            />

            {/* Weather label */}
            <p
              className={`text-xs capitalize ${isToday
                ? "text-white/90"
                : "text-gray-500 dark:text-gray-400"
                }`}
            >
              {d.main || "—"}
            </p>

            {/* Temperature */}
            <p
              className={`text-lg font-semibold ${isToday
                ? "text-white"
                : "text-gray-800 dark:text-white"
                }`}
            >
              {d.temp}°C
            </p>

            {/* Min / Max */}
            <p
              className={`text-xs ${isToday
                ? "text-white/80"
                : "text-gray-500 dark:text-gray-400"
                }`}
            >
              H: {d.temp_max ?? d.temp}° L: {d.temp_min ?? d.temp}°
            </p>
          </div>
        );
      })}
    </div>
  );
}