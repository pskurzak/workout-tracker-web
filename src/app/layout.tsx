export const metadata = { title: "Workout Tracker", description: "Track sessions fast" };

import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}