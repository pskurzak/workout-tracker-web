export default function Page() {
  return (
    <main className="min-h-dvh grid place-items-center p-8 text-center">
      <div>
        <h1 className="text-3xl font-bold">Workout Tracker</h1>
        <p className="mt-2 opacity-80">Simple. Fast. Yours.</p>
        <a className="mt-6 inline-block underline" href="/app">Open the app →</a>
        <footer className="mt-10 text-xs opacity-60">
          <a className="underline" href="/privacy">Privacy Policy</a> · <a className="underline" href="mailto:you@domain.com">Contact</a>
        </footer>
      </div>
    </main>
  );
}
