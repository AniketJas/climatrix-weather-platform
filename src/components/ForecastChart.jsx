import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  ReferenceDot,
} from "recharts";

// 🔹 "Mon 03-05"
function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  const day = d.toLocaleDateString("en-US", { weekday: "short" });
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${day} ${dd}-${mm}`;
}

// 🔹 Custom tooltip
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const temp = payload[0].value;

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="text-sm opacity-70">{label}</p>
      <p className="text-lg font-semibold">{temp}°C</p>
    </div>
  );
}

export default function ForecastChart({ data }) {
  const formattedData = data.map((item) => ({
    ...item,
    label: formatDateLabel(item.date),
  }));

  // 🔹 find min / max for highlighting
  const temps = formattedData.map((d) => d.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-4 shadow-xl">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        5-Day Forecast
      </h2>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={formattedData}
          margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
        >
          {/* 🔹 Gradient */}
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          {/* 🔹 Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            className="opacity-30"
          />

          {/* 🔹 X Axis */}
          <XAxis
            dataKey="label"
            padding={{ left: 20, right: 20 }}
            tick={{ fill: "#374151" }}
            className="dark:[&_.recharts-cartesian-axis-tick-value]:fill-white"
          />

          {/* 🔹 Y Axis */}
          <YAxis
            tick={{ fill: "#374151" }}
            className="dark:[&_.recharts-cartesian-axis-tick-value]:fill-white"
          />

          {/* 🔹 Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* 🔹 Area (background fill) */}
          <Area
            type="monotone"
            dataKey="temp"
            stroke="none"
            fill="url(#tempGradient)"
          />

          {/* 🔹 Line */}
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#6366f1"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              stroke: "#6366f1",
              strokeWidth: 2,
              fill: "#fff",
            }}
          />

          {/* 🔹 Highlight min */}
          {formattedData.map(
            (d, i) =>
              d.temp === min && (
                <ReferenceDot
                  key={`min-${i}`}
                  x={d.label}
                  y={d.temp}
                  r={5}
                  fill="#22c55e"
                  stroke="white"
                />
              )
          )}

          {/* 🔹 Highlight max */}
          {formattedData.map(
            (d, i) =>
              d.temp === max && (
                <ReferenceDot
                  key={`max-${i}`}
                  x={d.label}
                  y={d.temp}
                  r={5}
                  fill="#ef4444"
                  stroke="white"
                />
              )
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}