import { useQuery } from "@tanstack/react-query";
import { fetchAirPollution } from "../services/weatherService";

export default function useAirPollution(lat, lon) {
  return useQuery({
    queryKey: ["air", lat, lon],
    queryFn: () => fetchAirPollution(lat, lon),
    enabled: !!lat && !!lon,
  });
}