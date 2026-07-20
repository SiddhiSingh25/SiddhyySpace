"use client";

import { useEffect, useState } from "react";

export function ClockBadge() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center rounded-full border border-[#c5d0ef] bg-white/80 px-3.5 py-1.5 text-[13px] text-[#5a6280] shadow-sm backdrop-blur-sm">
      India{time ? ` · ${time}` : ""}
    </span>
  );
}
