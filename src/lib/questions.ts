import type { Question } from "@/types/game";

export type QuestionSetName = "default" | "nineties";

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

export const NINETIES_QUESTIONS: Question[] = [
  {
    id: "n0",
    prompt: "Which 1994 film features a character famous for saying 'Life is like a box of chocolates'?",
    choices: ["The Shawshank Redemption", "Pulp Fiction", "Forrest Gump", "The Lion King"],
    correctIndex: 2,
  },
  {
    id: "n1",
    prompt: "What boy band released the hit 'Bye Bye Bye' in 2000?",
    choices: ["Backstreet Boys", "98 Degrees", "Boyz II Men", "*NSYNC"],
    correctIndex: 3,
  },
  {
    id: "n2",
    prompt: "Which 1997 blockbuster featured the line 'I'm the king of the world!'?",
    choices: ["Independence Day", "Titanic", "The Fifth Element", "Air Force One"],
    correctIndex: 1,
  },
  {
    id: "n3",
    prompt: "Which artist released the album 'Jagged Little Pill' in 1995?",
    choices: ["Sheryl Crow", "Fiona Apple", "Alanis Morissette", "Jewel"],
    correctIndex: 2,
  },
  {
    id: "n4",
    prompt: "What 90s TV show featured six friends living in New York City?",
    choices: ["Seinfeld", "Friends", "Fraser", "Will & Grace"],
    correctIndex: 1,
  },
  {
    id: "n5",
    prompt: "Which toy was the must-have holiday gift of 1996?",
    choices: ["Furby", "Tamagotchi", "Power Rangers Megazord", "Tickle Me Elmo"],
    correctIndex: 3,
  },
  {
    id: "n6",
    prompt: "What was the name of the Spice Girls' debut single?",
    choices: ["Say You'll Be There", "2 Become 1", "Wannabe", "Who Do You Think You Are"],
    correctIndex: 2,
  },
  {
    id: "n7",
    prompt: "Which video game console was the best-selling of the 1990s?",
    choices: ["Nintendo 64", "Sega Genesis", "Game Boy", "PlayStation"],
    correctIndex: 3,
  },
];

export const QUESTION_SETS: Record<QuestionSetName, Question[]> = {
  default: QUESTIONS,
  nineties: NINETIES_QUESTIONS,
};
