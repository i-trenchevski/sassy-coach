// DEV: 2-minute windows for rapid testing. Set to 0 to use real days.
const DEV_INTERVAL_MINUTES = parseInt(process.env.DEV_INTERVAL_MINUTES || "0");

export function getToday(): string {
  if (DEV_INTERVAL_MINUTES > 0) {
    const window = Math.floor(Date.now() / (DEV_INTERVAL_MINUTES * 60 * 1000));
    return `dev-${window}`;
  }
  return new Date().toISOString().split("T")[0];
}

export function getYesterday(): string {
  if (DEV_INTERVAL_MINUTES > 0) {
    const window = Math.floor(Date.now() / (DEV_INTERVAL_MINUTES * 60 * 1000)) - 1;
    return `dev-${window}`;
  }
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}
