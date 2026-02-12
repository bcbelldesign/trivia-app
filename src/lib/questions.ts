import type { Question } from "@/types/game";

export const QUESTIONS: Question[] = [
  {
    id: "q0",
    prompt: "What is the capital of France?",
    choices: ["London", "Berlin", "Paris", "Madrid"],
    correctIndex: 2,
  },
  {
    id: "q1",
    prompt: "Which planet is known as the Red Planet?",
    choices: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctIndex: 1,
  },
  {
    id: "q2",
    prompt: "How many continents are there?",
    choices: ["5", "6", "7", "8"],
    correctIndex: 2,
  },
  {
    id: "q3",
    prompt: "What is the largest ocean on Earth?",
    choices: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctIndex: 3,
  },
  {
    id: "q4",
    prompt: "In which year did World War II end?",
    choices: ["1943", "1944", "1945", "1946"],
    correctIndex: 2,
  },
  {
    id: "q5",
    prompt: "What is the chemical symbol for gold?",
    choices: ["Go", "Gd", "Au", "Ag"],
    correctIndex: 2,
  },
  {
    id: "q6",
    prompt: "Which programming language is known for web browsers?",
    choices: ["Python", "Java", "JavaScript", "C++"],
    correctIndex: 2,
  },
  {
    id: "q7",
    prompt: "How many sides does a hexagon have?",
    choices: ["5", "6", "7", "8"],
    correctIndex: 1,
  },
];
