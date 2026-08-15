"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingTextProps {
  items?: string[];
  children?: React.ReactNode;
  interval?: number;
  className?: string;
}

export function FloatingText({
  items,
  children,
  interval = 3000,
  className = "",
}: FloatingTextProps) {
  const textList: string[] = useMemo(() => {
    if (items && items.length > 0) return items;
    if (typeof children === "string") {
      return children
        .split(/•|\|/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }, [items, children]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (textList.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % textList.length);
    }, interval);

    return () => clearInterval(timer);
  }, [textList.length, interval]);

  if (textList.length === 0) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative h-6 overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -6, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="block whitespace-nowrap transform-gpu"
        >
          {textList[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

