"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    function updateScrollProgress() {
      const currentProgress = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        const percentage = Math.min(
          100,
          Math.max(0, (currentProgress / scrollHeight) * 100),
        );
        setCompletion(percentage);
      }
    }

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-border/30 backdrop-blur-sm pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(completion)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-link via-indigo-500 to-sky-400 transition-[width] duration-150 ease-out shadow-[0_0_10px_rgba(74,98,176,0.5)]"
        style={{ width: `${completion}%` }}
      />
    </div>
  );
}
