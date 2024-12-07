function parseTimeToMilliseconds(input) {
  const regex = /(?:(\d+)y)?\s*(?:(\d+)mo)?\s*(?:(\d+)w)?\s*(?:(\d+)d)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/;
  const match = input.match(regex);
  if (match) {
    const years = parseInt(match[1] || "0", 10) * 365 * 24 * 60 * 60 * 1000;
    const months = parseInt(match[2] || "0", 10) * 30 * 24 * 60 * 60 * 1000;
    const weeks = parseInt(match[3] || "0", 10) * 7 * 24 * 60 * 60 * 1000;
    const days = parseInt(match[4] || "0", 10) * 24 * 60 * 60 * 1000;
    const hours = parseInt(match[5] || "0", 10) * 60 * 60 * 1000;
    const minutes = parseInt(match[6] || "0", 10) * 60 * 1000;
    const seconds = parseInt(match[7] || "0", 10) * 1000;

    return years + months + weeks + days + hours + minutes + seconds;
  }
  return null;
}

module.exports = parseTimeToMilliseconds;
