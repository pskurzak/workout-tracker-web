import React from "react";

// Server Component page: unwrap the Promise-based params
export default function SessionPage({
  params,
}: {
  params: Promise<{ sessionID: string }>;
}) {
  const { sessionID } = React.use(params); // ✅ Next 15 way to unwrap

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">
        Session {sessionID.slice(0, 8)}…
      </h1>
      <p className="opacity-70 mt-2">Details coming next step.</p>
    </main>
  );
}