"use client";

import { AnimatePresence, motion } from "motion/react";
import { variants, transition } from "@/lib/motion";

interface StageProps {
  stateKey: string;
  children: React.ReactNode;
}

export function Stage({ stateKey, children }: StageProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stateKey}
        initial={variants.page.initial}
        animate={variants.page.animate}
        exit={variants.page.exit}
        transition={transition.default}
        style={{ width: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
