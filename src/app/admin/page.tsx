"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  getDocs,
  updateDoc,
  increment,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { QUESTIONS } from "@/lib/questions";
import type { GameState, Player } from "@/types/game";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function parseGameDoc(data: Record<string, unknown> | undefined): GameState {
  if (!data)
    return {
      state: "lobby",
      currentQuestionIndex: 0,
      showResults: false,
      lastScoredQuestionIndex: -1,
    };
  return {
    state: (data.state as GameState["state"]) ?? "lobby",
    currentQuestionIndex:
      typeof data.currentQuestionIndex === "number" ? data.currentQuestionIndex : 0,
    showResults: !!data.showResults,
    lastScoredQuestionIndex:
      typeof data.lastScoredQuestionIndex === "number"
        ? data.lastScoredQuestionIndex
        : -1,
  };
}

function AdminDashboard() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("game") ?? "allhands";

  const [game, setGame] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Array<{ id: string; data: Player }>>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const gameRef = doc(db, "games", gameId);
    const unsubGame = onSnapshot(gameRef, (snap) => {
      setGame(parseGameDoc(snap.exists() ? snap.data() : undefined));
    });
    return () => unsubGame();
  }, [gameId]);

  useEffect(() => {
    const playersRef = collection(db, "games", gameId, "players");
    const unsubPlayers = onSnapshot(playersRef, (snap) => {
      const list: Array<{ id: string; data: Player }> = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          data: {
            name: d.name ?? "",
            score: typeof d.score === "number" ? d.score : 0,
            joinedAt: d.joinedAt ?? { seconds: 0, nanoseconds: 0 },
            answers: (d.answers as Record<string, number>) ?? {},
          },
        });
      });
      setPlayers(list);
    });
    return () => unsubPlayers();
  }, [gameId]);

  const gameRef = doc(db, "games", gameId);

  const startLobby = async () => {
    setBusy(true);
    try {
      await setDoc(
        gameRef,
        {
          state: "lobby",
          currentQuestionIndex: 0,
          showResults: false,
          lastScoredQuestionIndex: -1,
        },
        { merge: true }
      );
    } finally {
      setBusy(false);
    }
  };

  const startQuestion = async () => {
    setBusy(true);
    try {
      await setDoc(
        gameRef,
        {
          state: "question",
          showResults: false,
          responseCounts: { "0": 0, "1": 0, "2": 0, "3": 0 },
        },
        { merge: true }
      );
    } finally {
      setBusy(false);
    }
  };

  const revealResults = async () => {
    if (!game) return;
    const currentIndex = game.currentQuestionIndex;
    const lastScored = game.lastScoredQuestionIndex ?? -1;
    if (currentIndex === lastScored) {
      await setDoc(
        gameRef,
        { state: "results", showResults: true },
        { merge: true }
      );
      return;
    }
    setBusy(true);
    try {
      const question = QUESTIONS[currentIndex];
      const correctIndex = question.correctIndex;
      const playersRef = collection(db, "games", gameId, "players");
      const snap = await getDocs(playersRef);
      const updates: Promise<void>[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const answers = (data.answers as Record<string, number>) ?? {};
        if (answers[String(currentIndex)] === correctIndex) {
          updates.push(
            updateDoc(doc(db, "games", gameId, "players", docSnap.id), {
              score: increment(1),
            })
          );
        }
      });
      await Promise.all(updates);
      await setDoc(
        gameRef,
        {
          state: "results",
          showResults: true,
          lastScoredQuestionIndex: currentIndex,
        },
        { merge: true }
      );
    } finally {
      setBusy(false);
    }
  };

  const nextQuestion = async () => {
    if (!game) return;
    const next = Math.min(game.currentQuestionIndex + 1, QUESTIONS.length - 1);
    await setDoc(
      gameRef,
      { currentQuestionIndex: next, state: "question", showResults: false },
      { merge: true }
    );
  };

  const prevQuestion = async () => {
    if (!game) return;
    const prev = Math.max(game.currentQuestionIndex - 1, 0);
    await setDoc(
      gameRef,
      { currentQuestionIndex: prev, state: "question", showResults: false },
      { merge: true }
    );
  };

  const resetGame = async () => {
    setBusy(true);
    try {
      await setDoc(
        gameRef,
        {
          state: "lobby",
          currentQuestionIndex: 0,
          showResults: false,
          lastScoredQuestionIndex: -1,
        },
        { merge: true }
      );
      const playersRef = collection(db, "games", gameId, "players");
      const snap = await getDocs(playersRef);
      const batch = writeBatch(db);
      snap.forEach((docSnap) => {
        batch.update(docSnap.ref, { score: 0, answers: {} });
      });
      await batch.commit();
    } finally {
      setBusy(false);
    }
  };

  const currentIndex = game
    ? Math.min(
        Math.max(0, game.currentQuestionIndex),
        QUESTIONS.length - 1
      )
    : 0;
  const question = QUESTIONS[currentIndex];

  const distribution = [0, 1, 2, 3].map((choiceIndex) => {
    const count = players.filter(
      (p) => (p.data.answers ?? {})[String(currentIndex)] === choiceIndex
    ).length;
    return { choiceIndex, count };
  });
  const totalResponses = distribution.reduce((s, d) => s + d.count, 0);

  const leaderboard = [...players]
    .sort((a, b) => b.data.score - a.data.score)
    .slice(0, 5);

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Trivia Admin</h1>
          <p className="text-muted-foreground text-sm">
            Game: {gameId}
            {game && (
              <>
                {" "}
                · State: <Badge variant="outline">{game.state}</Badge>
              </>
            )}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>Start lobby first, then run questions.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button onClick={startLobby} disabled={busy}>
              Start Lobby
            </Button>
            <Button onClick={startQuestion} disabled={busy}>
              Start Question
            </Button>
            <Button onClick={revealResults} disabled={busy}>
              Reveal Results
            </Button>
            <Button variant="outline" onClick={prevQuestion} disabled={busy}>
              Prev
            </Button>
            <Button variant="outline" onClick={nextQuestion} disabled={busy}>
              Next
            </Button>
            <Button variant="destructive" onClick={resetGame} disabled={busy}>
              Reset Game
            </Button>
          </CardContent>
        </Card>

        {question && (
          <Card>
            <CardHeader>
              <CardTitle>Question {currentIndex + 1} of {QUESTIONS.length}</CardTitle>
              <CardDescription>{question.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {question.choices.map((choice, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-muted-foreground">{["A", "B", "C", "D"][idx]}</span>
                  <span>{choice}</span>
                  {idx === question.correctIndex && (
                    <Badge variant="secondary" className="text-xs">Correct</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Live response distribution</CardTitle>
            <CardDescription>
              Current question · {totalResponses} response{totalResponses !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {question &&
              distribution.map(({ choiceIndex, count }) => {
                const pct = totalResponses ? (count / totalResponses) * 100 : 0;
                const label = question.choices[choiceIndex];
                return (
                  <div key={choiceIndex} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{label}</span>
                      <span>
                        {count} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No players yet
                    </TableCell>
                  </TableRow>
                ) : (
                  leaderboard.map((p, i) => (
                    <TableRow key={p.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{p.data.name}</TableCell>
                      <TableCell className="text-right">{p.data.score}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<main className="min-h-screen p-4 flex items-center justify-center"><p className="text-muted-foreground">Loading…</p></main>}>
      <AdminDashboard />
    </Suspense>
  );
}
