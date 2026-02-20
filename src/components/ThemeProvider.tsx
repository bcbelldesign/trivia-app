"use client";

import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ThemeName } from "@/types/game";

const GAME_ID_KEY = "trivia_gameId";

export function ThemeProvider() {
  useEffect(() => {
    const gameId =
      (typeof window !== "undefined" && localStorage.getItem(GAME_ID_KEY)) ||
      "allhands";

    const gameRef = doc(db, "games", gameId);
    const unsub = onSnapshot(gameRef, (snap) => {
      const theme = (snap.data()?.theme as ThemeName | undefined) ?? "default";
      document.documentElement.dataset.theme =
        theme === "tweakcn" ? "tweakcn" : "";
    });
    return () => unsub();
  }, []);

  return null;
}
