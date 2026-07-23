"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface FloatingTextProps extends HTMLMotionProps<"p"> {
  children: React.ReactNode;
  className?: string;
}

export function FloatingText({ children, className, ...props }: FloatingTextProps) {
  return (
    <motion.p
      initial={{ y: 0 }}
      animate={{ y: [-2, -8, -2] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.p>
  );
}
