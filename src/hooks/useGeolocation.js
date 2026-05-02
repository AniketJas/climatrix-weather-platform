import { useEffect, useState } from "react";

export default function useGeolocation() {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Geolocation denied", err);
      }
    );
  }, []);

  return coords;
}