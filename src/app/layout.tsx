import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CoachTrack",
  description: "Gérez vos clients, séances et performances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr" className={`${jakarta.variable} h-full antialiased`}>
        <body
          className="min-h-full flex flex-col font-[family-name:var(--font-sans)]"
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
