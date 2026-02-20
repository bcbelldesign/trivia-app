"use client";

import { motion } from "motion/react";
import { pressConfig } from "@/lib/motion";

interface PressableProps {
  children: React.ReactNode;
  className?: string;
}

export function Pressable({ children, className }: PressableProps) {
  return (
    <motion.div
      whileTap={pressConfig.whileTap}
      transition={pressConfig.transition}
      className={className}
      style={{ display: "contents" }}
    >
      {children}
    </motion.div>
  );
}
