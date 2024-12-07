function formatMilliseconds(ms) {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;

  const totalDays = Math.floor(ms / (1000 * 60 * 60 * 24));

  const daysInYear = 365.25;
  const daysInMonth = 30.44;

  const years = Math.floor(totalDays / daysInYear);
  const remainingDaysAfterYears = totalDays % daysInYear;
  const months = Math.floor(remainingDaysAfterYears / daysInMonth);
  const days = Math.floor(remainingDaysAfterYears % daysInMonth);

  let result = [];
  if (years > 0) result.push(`${years}y`);
  if (months > 0) result.push(`${months}mo`);
  if (days > 0) result.push(`${days}d`);
  if (hours > 0) result.push(`${hours}h`);
  if (minutes > 0) result.push(`${minutes}m`);
  if (seconds > 0 || result.length === 0) result.push(`${seconds}s`);

  return result.join(" ");
}

module.exports = formatMilliseconds;
