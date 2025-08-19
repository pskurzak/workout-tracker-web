// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Workout Tracker</h1>

      <div className="space-x-4">
        <Link
          href="/app/"
          className="inline-block rounded px-4 py-2 border"
        >
          Open the app
        </Link>

        <a
          href="https://nextjs.org/docs"
          className="inline-block rounded px-4 py-2 border"
          target="_blank" rel="noreferrer"
        >
          Read the docs
        </a>
      </div>
    </main>
  );
}