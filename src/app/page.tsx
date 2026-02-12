import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-2xl font-bold">Trivia</h1>
      <p className="text-muted-foreground text-center max-w-md">
        Realtime trivia for all-hands. Share the join link with your audience; run the admin dashboard to control the game.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/join"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground font-medium hover:bg-primary/90"
        >
          Join game
        </Link>
        <Link
          href="/admin"
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 font-medium hover:bg-accent hover:text-accent-foreground"
        >
          Admin dashboard
        </Link>
      </div>
    </main>
  );
}
