import { useQuery } from "@tanstack/react-query";
import { fetchForecast } from "../services/weatherService";

export default function useForecast(city) {
  return useQuery({
    queryKey: ["forecast", city],
    queryFn: () => fetchForecast(city),
    enabled: !!city,
  });
}