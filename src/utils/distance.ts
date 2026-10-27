/**
 * Calculate distance between two lat/lng coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Format distance in Arabic or English friendly string (e.g. 350 م or 2.4 كم)
 */
export function formatDistance(distanceKm: number, isArabic = true): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return isArabic ? `${meters} متر` : `${meters} m`;
  }
  const rounded = distanceKm < 10 ? distanceKm.toFixed(1) : Math.round(distanceKm).toString();
  return isArabic ? `${rounded} كم` : `${rounded} km`;
}

/**
 * Estimate walking time (assumes 4.8 km/h average tourist pace)
 */
export function estimateWalkTimeMinutes(distanceKm: number): number {
  return Math.max(1, Math.round((distanceKm / 4.8) * 60));
}

/**
 * Estimate driving time (assumes 28 km/h city average including traffic)
 */
export function estimateDriveTimeMinutes(distanceKm: number): number {
  return Math.max(2, Math.round((distanceKm / 28) * 60));
}

/**
 * Format walking & driving time nicely
 */
export function formatTransitTime(distanceKm: number, isArabic = true): {
  walkText: string;
  driveText: string;
} {
  const walkMin = estimateWalkTimeMinutes(distanceKm);
  const driveMin = estimateDriveTimeMinutes(distanceKm);

  if (isArabic) {
    const walkText = walkMin >= 60
      ? `${Math.floor(walkMin / 60)} ساعة و ${walkMin % 60} دقيقة مشياً`
      : `${walkMin} دقيقة مشياً`;
    const driveText = driveMin >= 60
      ? `${Math.floor(driveMin / 60)} ساعة بالسيارة`
      : `${driveMin} دقيقة بالسيارة`;
    return { walkText, driveText };
  } else {
    const walkText = walkMin >= 60
      ? `${Math.floor(walkMin / 60)}h ${walkMin % 60}m walk`
      : `${walkMin} min walk`;
    const driveText = driveMin >= 60
      ? `${Math.floor(driveMin / 60)}h drive`
      : `${driveMin} min drive`;
    return { walkText, driveText };
  }
}
