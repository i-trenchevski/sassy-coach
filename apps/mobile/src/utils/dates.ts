// Must match the API's DEV_INTERVAL_MINUTES so both sides use the same date windows.
const DEV_INTERVAL_MINUTES = __DEV__ ? 2 : 0;
const DEV_INTERVAL_MS = DEV_INTERVAL_MINUTES * 60 * 1000;

export function getToday(): string {
  if (DEV_INTERVAL_MS > 0) {
    const window = Math.floor(Date.now() / DEV_INTERVAL_MS);
    return `dev-${window}`;
  }
  return new Date().toISOString().split("T")[0];
}

export function getYesterday(): string {
  if (DEV_INTERVAL_MS > 0) {
    const window = Math.floor(Date.now() / DEV_INTERVAL_MS) - 1;
    return `dev-${window}`;
  }
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function formatDate(dateStr: string): string {
  // Dev mode: window-based strings like "dev-8815000"
  if (dateStr.startsWith("dev-")) {
    if (DEV_INTERVAL_MS > 0) {
      const windowNum = parseInt(dateStr.split("-")[1]);
      const currentWindow = Math.floor(Date.now() / DEV_INTERVAL_MS);
      const diff = currentWindow - windowNum;
      if (diff === 0) return "Just now (dev)";
      if (diff === 1) return `${DEV_INTERVAL_MINUTES} min ago (dev)`;
      return `${diff * DEV_INTERVAL_MINUTES} min ago (dev)`;
    }
    return "Dev session";
  }

  const date = new Date(dateStr + "T00:00:00");
  const today = getToday();
  const yesterday = getYesterday();

  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
