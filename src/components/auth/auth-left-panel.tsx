import Image from "next/image";

export function AuthLeftPanel() {
  return (
    <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
      {/* Background image */}
      <Image
        src="/auth-bg.jpg"
        alt="Coach sportif"
        fill
        className="object-cover"
        priority
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-zinc-950/60" />

      {/* Logo top-left */}
      <div className="relative z-10 flex items-center gap-2">
        <span className="text-lg font-bold tracking-tight">CoachTrack</span>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-lg">
          CoachTrack
        </h1>
        <p className="text-lg text-zinc-200 drop-shadow">
          Gérez vos clients.
          <br />
          Suivez leurs performances.
        </p>
      </div>

      {/* Quote bottom */}
      <blockquote className="relative z-10 space-y-2">
        <p className="text-sm text-zinc-300">
          &ldquo;La progression se mesure, la réussite se construit séance
          après séance.&rdquo;
        </p>
      </blockquote>
    </div>
  );
}
