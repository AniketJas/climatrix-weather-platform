export default function WeatherEffects({ type }) {
  if (type === "Rain") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-6 bg-blue-400 opacity-50 animate-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${0.5 + Math.random()}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "Snow") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-snow"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}