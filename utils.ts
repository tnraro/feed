export function getRelativeTimeString(date: Date | number, locales = "ko"): string {
  const time = typeof date === "number" ? date : date.getTime();
  const deltaSeconds = Math.round((time - Date.now()) / 1000);
  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
  const units: Intl.RelativeTimeFormatUnit[] = ["second", "minute", "hour", "day", "week", "month", "year", "year"];
  const unitIndex = cutoffs.findIndex(cutoffs => cutoffs > Math.abs(deltaSeconds));
  const divider = unitIndex ? cutoffs[unitIndex - 1] : 1;
  const rtf = new Intl.RelativeTimeFormat(locales, { numeric: "auto" });
  return rtf.format(Math.floor(deltaSeconds / divider), units[unitIndex]);
}

export const resolveAbsoluteUrl = (url: string, baseurl: string) => (new URL(url, baseurl)).href;
export const resolvePageId = (url: string) => btoa(url).replaceAll(/=+/g, "");