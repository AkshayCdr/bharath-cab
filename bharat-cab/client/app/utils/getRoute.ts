export async function fetchRoutes(source, destination) {
    const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${source[1]},${source[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`
    );
    const data = await response.json();
    return data.routes.length > 0 ? data.routes[0] : null;
}
