# Trivia (All-Hands)

Realtime trivia web app for an all-hands: audience joins from phones, answers 8 multiple-choice questions; host controls the game from the admin dashboard and sees live response distribution and leaderboard.

**Stack:** Next.js 14+ (App Router), Firebase Firestore, Tailwind CSS, shadcn/ui.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Firebase**

   - Create a project in the [Firebase Console](https://console.firebase.google.com).
   - Enable **Firestore Database** (Create database; start in test mode for demo).
   - In Project settings → Your apps, add a Web app and copy the config.
   - Copy `.env.example` to `.env.local` and fill in the `NEXT_PUBLIC_FIREBASE_*` variables.

3. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Running a game

1. **Host:** Open **Admin dashboard** ([/admin](http://localhost:3000/admin)). Click **Start Lobby** once to create/init the game doc (default game ID: `allhands`).
2. **Audience:** Share the **Join** link: [http://localhost:3000/join](http://localhost:3000/join). Players enter a display name (2–20 chars, no account) and are redirected to `/play`.
3. **Host:** Use **Start Question** → wait for answers → **Reveal Results** (this scores the current question). Use **Next** / **Prev** to change the question, then **Start Question** again. **Reset Game** clears state and all player scores/answers for a new run.

## Routes

| Route    | Purpose |
| -------- | ------- |
| `/`      | Home with links to Join and Admin. |
| `/join`  | Enter display name; creates player and redirects to `/play`. Optional: `?game=xyz` (default `allhands`). |
| `/play`  | Realtime game: lobby → question (4 options) → results. One answer per question. |
| `/admin` | Host dashboard: controls, current question, live response distribution, top 5 leaderboard. Optional: `?game=xyz`. |

## Firestore

- **`games/{gameId}`** — `state` (`lobby` \| `question` \| `results`), `currentQuestionIndex`, `showResults`, `lastScoredQuestionIndex`.
- **`games/{gameId}/players/{playerId}`** — `name`, `score`, `joinedAt`, `answers` (map of question index → choice index).

Security rules are left permissive for a controlled demo; tighten them (e.g. require auth or App Check) for production.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
