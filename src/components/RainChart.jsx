import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

// 🔹 Custom Tooltip
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="text-sm opacity-70">{label}</p>
      <p className="text-lg font-semibold">
        {payload[0].value}%
      </p>
    </div>
  );
}

export default function RainChart({ list }) {
  const data = list.slice(0, 10).map((item) => {
    const date = new Date(item.dt_txt);

    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      time,
      rain: Math.round((item.pop || 0) * 100),
    };
  });

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-4 shadow-xl">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
        Rain Probability (%)
      </h2>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          {/* 🔹 Gradient */}
          <defs>
            <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          {/* 🔹 Grid */}
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />

          {/* 🔹 X Axis */}
          <XAxis
            dataKey="time"
            tick={{ fill: "#374151" }}
            className="dark:[&_.recharts-cartesian-axis-tick-value]:fill-white"
            padding={{ left: 20, right: 20 }}
          />

          {/* 🔹 Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* 🔹 Area */}
          <Area
            type="monotone"
            dataKey="rain"
            stroke="none"
            fill="url(#rainGradient)"
          />

          {/* 🔹 Line */}
          <Line
            type="monotone"
            dataKey="rain"
            stroke="#38bdf8"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 5,
              stroke: "#38bdf8",
              strokeWidth: 2,
              fill: "#fff",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}