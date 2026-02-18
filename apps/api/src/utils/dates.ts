export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}
