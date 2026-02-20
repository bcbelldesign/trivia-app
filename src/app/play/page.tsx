"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { QUESTION_SETS } from "@/lib/questions";
import type { GameState, Player } from "@/types/game";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";
import { Stage } from "@/components/motion/Stage";
import { Pressable } from "@/components/motion/Pressable";

const GAME_ID_KEY = "trivia_gameId";
const PLAYER_ID_KEY = "trivia_playerId";

function parseGameDoc(snap: DocumentSnapshot): GameState | null {
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    state: (d.state as GameState["state"]) ?? "lobby",
    currentQuestionIndex: typeof d.currentQuestionIndex === "number" ? d.currentQuestionIndex : 0,
    showResults: !!d.showResults,
    lastScoredQuestionIndex: typeof d.lastScoredQuestionIndex === "number" ? d.lastScoredQuestionIndex : -1,
    responseCounts: (d.responseCounts as Record<string, number>) ?? undefined,
    questionSet: (d.questionSet as GameState["questionSet"]) ?? "default",
  };
}

function parsePlayerDoc(snap: DocumentSnapshot): Player | null {
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    name: d.name ?? "",
    score: typeof d.score === "number" ? d.score : 0,
    joinedAt: d.joinedAt ?? { seconds: 0, nanoseconds: 0 },
    answers: (d.answers as Record<string, number>) ?? {},
  };
}

export default function PlayPage() {
  const router = useRouter();
  const [gameId, setGameId] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [game, setGame] = useState<GameState | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const gid = localStorage.getItem(GAME_ID_KEY);
    const pid = localStorage.getItem(PLAYER_ID_KEY);
    if (!gid || !pid) {
      router.replace("/join");
      return;
    }
    setGameId(gid);
    setPlayerId(pid);
  }, [router]);

  useEffect(() => {
    if (!gameId || !playerId) return;
    const gameRef = doc(db, "games", gameId);
    const unsubGame = onSnapshot(gameRef, (snap) => {
      setGame(parseGameDoc(snap));
      setLoading(false);
    });
    return () => unsubGame();
  }, [gameId, playerId]);

  useEffect(() => {
    if (!gameId || !playerId) return;
    const playerRef = doc(db, "games", gameId, "players", playerId);
    const unsubPlayer = onSnapshot(playerRef, (snap) => {
      setPlayer(parsePlayerDoc(snap));
    });
    return () => unsubPlayer();
  }, [gameId, playerId]);

  const submitAnswer = async (choiceIndex: number) => {
    if (!gameId || !playerId || game?.state !== "question") return;
    const currentIndex = game.currentQuestionIndex;
    const playerRef = doc(db, "games", gameId, "players", playerId);
    const snap = await getDoc(playerRef);
    const existing = snap.exists() ? (snap.data().answers as Record<string, number>) ?? {} : {};
    if (existing[String(currentIndex)] !== undefined) return;
    await setDoc(
      playerRef,
      { answers: { ...existing, [String(currentIndex)]: choiceIndex } },
      { merge: true }
    );
    const gameRef = doc(db, "games", gameId);
    await updateDoc(gameRef, {
      [`responseCounts.${choiceIndex}`]: increment(1),
    });
  };

  if (loading || !gameId || !playerId) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <p className="text-muted-foreground">Loading&hellip;</p>
      </main>
    );
  }

  if (!game) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <Stage stateKey="no-game">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>No game</CardTitle>
              <CardDescription>Waiting for host to start the game.</CardDescription>
            </CardHeader>
          </Card>
        </Stage>
      </main>
    );
  }

  if (game.state === "lobby") {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <Stage stateKey="lobby">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{player?.name ? `Welcome, ${player.name}!` : "You're in"}</CardTitle>
              <CardDescription>Waiting for host to start the game&hellip;</CardDescription>
            </CardHeader>
          </Card>
        </Stage>
      </main>
    );
  }

  const activeQuestions = QUESTION_SETS[game.questionSet ?? "default"];
  const questionIndex = Math.min(
    Math.max(0, game.currentQuestionIndex),
    activeQuestions.length - 1
  );
  const question = activeQuestions[questionIndex];
  const myAnswer = player?.answers?.[String(questionIndex)];
  const hasSubmitted = myAnswer !== undefined;
  const responseCounts = game.responseCounts;
  const totalResponses =
    responseCounts != null
      ? (responseCounts["0"] ?? 0) +
        (responseCounts["1"] ?? 0) +
        (responseCounts["2"] ?? 0) +
        (responseCounts["3"] ?? 0)
      : 0;

  if (game.state === "results" && game.showResults) {
    const correctChoice = question.choices[question.correctIndex];
    const myChoice = myAnswer !== undefined ? question.choices[myAnswer] : "—";
    const isCorrect = myAnswer === question.correctIndex;
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <Stage stateKey={`results-${questionIndex}`}>
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Question {questionIndex + 1} of {activeQuestions.length}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">{question.prompt}</p>
              <Separator />
              <p>
                Correct answer: <strong>{correctChoice}</strong>
              </p>
              <p>
                Your answer: <strong>{myChoice}</strong>{" "}
                {myAnswer !== undefined && (
                  <Badge variant={isCorrect ? "default" : "secondary"}>
                    {isCorrect ? "Correct" : "Incorrect"}
                  </Badge>
                )}
              </p>
              <p>
                Your score: <strong>{player?.score ?? 0}</strong>
              </p>
            </CardContent>
          </Card>
        </Stage>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Stage stateKey={`question-${questionIndex}`}>
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Question {questionIndex + 1} of {activeQuestions.length}</CardTitle>
            <CardDescription>{question.prompt}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.choices.map((choice, idx) => {
              const count = responseCounts?.[String(idx)] ?? 0;
              const pct =
                totalResponses > 0
                  ? Math.round((count / totalResponses) * 100)
                  : 0;
              const isCorrect = idx === question.correctIndex;
              const isMyAnswer = myAnswer === idx;
              const isWrongSelection = hasSubmitted && isMyAnswer && !isCorrect;

              return (
                <motion.button
                  key={idx}
                  className="relative w-full h-14 rounded-lg overflow-hidden text-left cursor-pointer disabled:cursor-default"
                  style={{
                    border: "1.5px solid #e5e7eb",
                    boxShadow: isWrongSelection ? "0 0 0 2px #fca5a5" : undefined,
                  }}
                  whileTap={hasSubmitted ? {} : { scale: 0.98 }}
                  transition={{ duration: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                  disabled={hasSubmitted}
                  onClick={() => submitAnswer(idx)}
                >
                  {/* Fill bar — remounts only when both submitted AND response data is ready */}
                  <motion.div
                    key={hasSubmitted && totalResponses > 0 ? `bar-ready-${idx}` : `bar-pending-${idx}`}
                    aria-hidden
                    className="absolute inset-y-0 left-0"
                    style={{
                      backgroundColor: isCorrect
                        ? "rgba(134, 239, 172, 0.55)"
                        : "rgba(0, 0, 0, 0.07)",
                    }}
                    initial={{ width: "0%" }}
                    animate={{ width: hasSubmitted && totalResponses > 0 ? `${pct}%` : "0%" }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 18,
                      mass: 0.8,
                      delay: idx * 0.06,
                    }}
                  />
                  {/* Text row — always present */}
                  <span className="relative flex items-center justify-between h-full px-4">
                    <span className="text-base font-medium text-foreground">
                      {choice}
                    </span>
                    {/* Percentage fades in once data is ready */}
                    <motion.span
                      key={hasSubmitted && totalResponses > 0 ? `pct-ready-${idx}` : `pct-pending-${idx}`}
                      className="text-sm font-semibold tabular-nums text-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hasSubmitted && totalResponses > 0 ? 1 : 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.06 + 0.1 }}
                    >
                      {pct}%
                    </motion.span>
                  </span>
                </motion.button>
              );
            })}
            <p className="text-sm text-muted-foreground h-5">
              {hasSubmitted ? "Answer submitted. Waiting for next question\u2026" : ""}
            </p>
          </CardContent>
        </Card>
      </Stage>
    </main>
  );
}
