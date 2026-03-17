import { BASE_FARES } from '@/constants/config';

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateFare(vehicleType: string, distanceKm: number): number {
  const perKm = BASE_FARES[vehicleType] ?? 12;
  return Math.round(perKm * 2 + distanceKm * perKm);
}

export function getETA(distanceKm: number, vehicleType: string): string {
  const speed = vehicleType === 'bike' ? 35 : vehicleType === 'auto' ? 25 : 30;
  const mins  = Math.round((distanceKm / speed) * 60);
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`;
}
