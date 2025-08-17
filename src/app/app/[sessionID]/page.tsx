"use client";

export default function SessionPage({ params }: { params: { sessionID: string } }) {
  const { sessionID } = params;
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Session {sessionID.slice(0,8)}…</h1>
      <p className="opacity-70 mt-2">Details coming next step.</p>
    </main>
  );
}