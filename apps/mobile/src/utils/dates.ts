// Mobile always uses real dates. The API controls mission date format
// (e.g. dev intervals via DEV_INTERVAL_MINUTES env var).

export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function formatDate(dateStr: string): string {
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
