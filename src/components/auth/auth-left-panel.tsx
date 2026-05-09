import Image from "next/image";
import { RevoWordmark } from "@/components/auth/revo-wordmark";

const SIGN_IN_COPY = {
  heading: "Revo",
  body: (
    <>
      Gérez vos clients.
      <br />
      Suivez leurs performances.
    </>
  ),
  quote:
    "La progression se mesure, la réussite se construit séance après séance.",
} as const;

const SIGN_UP_COPY = {
  heading: "Votre coaching, mieux cadré",
  body: (
    <>
      Créez un compte en quelques secondes et centralisez clients, programmes
      et séances — gratuit pour démarrer, sans engagement.
    </>
  ),
  quote:
    "Un espace clair pour vos athlètes, moins de friction pour vous.",
} as const;

export type AuthLeftPanelVariant = "sign-in" | "sign-up";

export function AuthLeftPanel({
  variant = "sign-in",
}: {
  variant?: AuthLeftPanelVariant;
}) {
  const copy = variant === "sign-up" ? SIGN_UP_COPY : SIGN_IN_COPY;

  return (
    <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
      <Image
        src="/auth-bg.jpg"
        alt=""
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/75 via-zinc-950/65 to-indigo-950/70" />

      <div className="relative z-10">
        <RevoWordmark tone="dark" size="lg" href="/" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-2 text-center">
        <div className="max-w-md space-y-3">
          <h1
            className={`font-[family-name:var(--font-display)] font-bold tracking-tight text-white drop-shadow-lg ${
              variant === "sign-up" ? "text-3xl sm:text-4xl" : "text-5xl"
            }`}
          >
            {copy.heading}
          </h1>
          <p className="text-base leading-relaxed text-zinc-200 drop-shadow md:text-lg">
            {copy.body}
          </p>
        </div>
      </div>

      <blockquote className="relative z-10 border-l-2 border-white/25 pl-4">
        <p className="text-sm italic leading-relaxed text-zinc-300">
          &ldquo;{copy.quote}&rdquo;
        </p>
      </blockquote>
    </div>
  );
}
