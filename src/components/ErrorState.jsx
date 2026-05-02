export default function ErrorState() {
  return (
    <div className="text-center py-10">
      <p className="text-red-500 font-medium">
        Unable to fetch weather data
      </p>
      <p className="text-sm text-gray-500">
        Try another city
      </p>
    </div>
  );
}