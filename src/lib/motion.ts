const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

export const duration = {
  fast: 0.12,
  medium: 0.18,
  slow: 0.22,
} as const;

export const transition = {
  default: {
    duration: duration.medium,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  },
  fast: {
    duration: duration.fast,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  },
  slow: {
    duration: duration.slow,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  },
} as const;

export const variants = {
  page: {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: prefersReducedMotion ? 0 : -6 },
  },
  panel: {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: prefersReducedMotion ? 0 : -4 },
  },
} as const;

export const pressConfig = {
  whileTap: prefersReducedMotion ? {} : { scale: 0.98 },
  transition: { duration: duration.fast, ease: [0.25, 0.1, 0.25, 1] },
} as const;
