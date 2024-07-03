import { useEffect, useState } from "react";
import { fetchRoutes } from "~/utils/getRoute";

function getRouteMidpoint(route) {
  const midpointIndex = Math.floor(route.length / 2);
  return route[midpointIndex];
}

export default function useRoute(source, destination) {
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [midpoint, setMidpoint] = useState(null);

  useEffect(() => {
    if (!source || !destination) return;
    if (source && destination) {
      (async () => {
        const routeData = await fetchRoutes(source, destination);
        if (routeData) {
          const coords = routeData.geometry.coordinates.map((coord) => [
            coord[1],
            coord[0],
          ]);

          setRoute(coords);
          setDistance(routeData.distance / 1000);
          setMidpoint(getRouteMidpoint(coords));
        }
      })();
    }
  }, [source, destination]);

  return { route, distance, midpoint };
}
