import { RouteGeometry } from '../types';

export class NavigationService {
  /**
   * Calculate straight-line distance in kilometers using Haversine formula
   */
  public calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Fetch real route from OpenStreetMap OSRM public demo routing service
   * with graceful fallback to straight-line geometry if unavailable or rate-limited.
   */
  public async getRoute(
    startLat: number,
    startLng: number,
    destLat: number,
    destLng: number
  ): Promise<RouteGeometry> {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coords: [number, number][] = route.geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]] // OSRM gives [lng, lat], convert to [lat, lng]
          );
          const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
          const durationMinutes = Math.round(route.duration / 60);

          return {
            coordinates: coords,
            distanceKm,
            durationMinutes,
            summary: route.legs?.[0]?.summary || 'Road Route via OSRM'
          };
        }
      }
    } catch (e) {
      console.warn('OSRM routing request failed or timed out; using straight-line estimate.', e);
    }

    // Fallback: straight-line path with standard 45 km/h driving speed estimate
    const dist = this.calculateHaversineDistance(startLat, startLng, destLat, destLng);
    const estMinutes = Math.round((dist / 40) * 60) + 10; // 40 km/h avg speed + 10 min buffer

    return {
      coordinates: [
        [startLat, startLng],
        [destLat, destLng]
      ],
      distanceKm: dist,
      durationMinutes: estMinutes,
      summary: 'Direct Line (Driving estimate ~40 km/h)'
    };
  }

  /**
   * Build external navigation link (Google Maps)
   */
  public getGoogleMapsUrl(destLat: number, destLng: number, destName: string): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&destination_place_id=${encodeURIComponent(
      destName
    )}`;
  }

  /**
   * Build external navigation link (OpenStreetMap)
   */
  public getOpenStreetMapUrl(
    destLat: number,
    destLng: number,
    startLat?: number,
    startLng?: number
  ): string {
    if (startLat && startLng) {
      return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${startLat}%2C${startLng}%3B${destLat}%2C${destLng}`;
    }
    return `https://www.openstreetmap.org/?mlat=${destLat}&mlon=${destLng}#map=16/${destLat}/${destLng}`;
  }
}

export const navigationService = new NavigationService();
