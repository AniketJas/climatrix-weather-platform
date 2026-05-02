import { CloudSun } from "lucide-react";

export default function Brand() {
  return (
    <div className="flex items-center gap-2 select-none group">

      {/* Animated Icon */}
      <div className="relative">
        <CloudSun
          size={22}
          className="text-indigo-500 animate-float group-hover:rotate-6 transition-transform duration-300"
        />

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-indigo-400 dark:bg-indigo-300 blur-md opacity-20 group-hover:opacity-40 transition"></div>
      </div>

      {/* Text */}
      <h1 className="text-lg md:text-xl font-bold tracking-tight text-gray-800 dark:text-white">
        Climatrix
      </h1>

      {/* Tagline */}
      <span className="hidden md:inline text-xs text-gray-500 dark:text-gray-400">
        Weather Intelligence
      </span>
    </div>
  );
}