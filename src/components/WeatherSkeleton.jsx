export default function WeatherSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-40 bg-gray-200 rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 bg-gray-200 rounded-xl" />
        <div className="h-20 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}