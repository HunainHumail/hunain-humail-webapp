export const HEALTH_TIME_ZONE = "Asia/Dubai";
export const HEALTH_TIME_LABEL = "Dubai";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: HEALTH_TIME_ZONE,
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatHealthTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return formatter.format(date);
}
