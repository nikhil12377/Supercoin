export default function timestampToHours(timestamp) {
  const secondsPerDay = 86400;
  const secondsPerHour = 3600;

  const hours = Math.floor((timestamp % secondsPerDay) / secondsPerHour);

  return `${hours}h ago`;
}
