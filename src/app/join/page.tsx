"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const GAME_ID_KEY = "trivia_gameId";
const PLAYER_ID_KEY = "trivia_playerId";

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get("game") ?? "allhands";

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      setError("Display name must be 2–20 characters.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const playerId = crypto.randomUUID();
      if (typeof window !== "undefined") {
        localStorage.setItem(GAME_ID_KEY, gameId);
        localStorage.setItem(PLAYER_ID_KEY, playerId);
      }
      const playerRef = doc(db, "games", gameId, "players", playerId);
      await setDoc(
        playerRef,
        {
          name: trimmed,
          score: 0,
          joinedAt: serverTimestamp(),
          answers: {},
        },
        { merge: true }
      );
      router.push(`/play?game=${gameId}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join Trivia</CardTitle>
          <CardDescription>
            Enter your display name to join the game.
            {gameId !== "allhands" && (
              <span className="block mt-1">Game: {gameId}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (2–20 chars)"
                minLength={2}
                maxLength={20}
                disabled={submitting}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Joining…" : "Join game"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center p-4"><p className="text-muted-foreground">Loading…</p></main>}>
      <JoinForm />
    </Suspense>
  );
}
