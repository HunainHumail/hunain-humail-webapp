"use client";

import { useEffect, useState } from "react";

const DUBAI_TZ = "Asia/Dubai";

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: DUBAI_TZ,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function formatDubaiClockLabel(date: Date): string {
  return `DUBAI · 25.20° N · ${timeFormatter.format(date)}`;
}

export function useDubaiClock(): string {
  const [label, setLabel] = useState(() => formatDubaiClockLabel(new Date()));

  useEffect(() => {
    const tick = () => setLabel(formatDubaiClockLabel(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return label;
}
