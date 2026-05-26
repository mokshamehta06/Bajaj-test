/**
 * Format ageMinutes into a human-readable string.
 * e.g. 192 → "3h 12m", 45 → "45m", 1500 → "1d 1h"
 */
export function formatAge(minutes) {
  if (minutes < 0) return '0m';

  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;

  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
}

/**
 * Get the SLA target label for a priority.
 */
export function getSLATarget(priority) {
  const targets = {
    urgent: '1h',
    high: '4h',
    medium: '24h',
    low: '72h'
  };
  return targets[priority] || '';
}
