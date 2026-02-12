export type GameStateValue = "lobby" | "question" | "results";

export interface GameState {
  state: GameStateValue;
  currentQuestionIndex: number;
  showResults: boolean;
  lastScoredQuestionIndex?: number;
  responseCounts?: Record<string, number>;
}

export interface Player {
  name: string;
  score: number;
  joinedAt: { seconds: number; nanoseconds: number };
  answers?: Record<string, number>;
}

export interface Question {
  id: string;
  prompt: string;
  choices: [string, string, string, string];
  correctIndex: number;
}
