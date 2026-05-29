import Image from "next/image";

type Shot = {
  src: string;
  caption: string;
};

const SHOTS: Shot[] = [
  { src: "/screenshots/shot-dashboard.png", caption: "Tableau de bord" },
  { src: "/screenshots/shot-exercices-grid.png", caption: "76 exercices illustrés" },
  { src: "/screenshots/shot-activite.png", caption: "Activité & séances" },
  { src: "/screenshots/shot-clients.png", caption: "Suivi des clients" },
  { src: "/screenshots/shot-tendance.png", caption: "Tendances mensuelles" },
  { src: "/screenshots/shot-exercices.png", caption: "Bibliothèque complète" },
];

function ScreenshotFrame({
  shot,
  priority = false,
  hidden = false,
}: {
  shot: Shot;
  priority?: boolean;
  hidden?: boolean;
}) {
  return (
    <figure className="w-[240px] shrink-0 sm:w-[300px]" aria-hidden={hidden || undefined}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-red-300" />
          <span className="h-2 w-2 rounded-full bg-amber-300" />
          <span className="h-2 w-2 rounded-full bg-green-300" />
          <span className="mx-auto text-[10px] text-slate-400">app.revo.coach</span>
        </div>
        <Image
          src={shot.src}
          alt={shot.caption}
          width={408}
          height={457}
          className="h-auto w-full object-cover"
          loading={priority ? "eager" : "lazy"}
        />
      </div>
      <figcaption className="mt-3 text-center text-xs font-medium text-slate-500">
        {shot.caption}
      </figcaption>
    </figure>
  );
}

export function AppScreenshotsCarousel() {
  /*
   * Sur mobile : scroll natif (CSS overflow-x: auto) → 6 images seulement
   * Sur desktop : boucle infinie CSS (doubled pour la continuité de l'animation)
   * La distinction est gérée côté CSS (.revo-marquee / .revo-marquee-mask).
   * On ajoute aria-hidden sur les doublons pour éviter la redondance screen reader.
   */
  return (
    <div
      className="revo-marquee-mask group relative"
      aria-label="Aperçu réel de l'application Revo"
    >
      <div className="revo-marquee w-max py-2 sm:flex">
        {SHOTS.map((shot, index) => (
          <ScreenshotFrame key={shot.src} shot={shot} priority={index < 2} />
        ))}
        {/* Doublons pour la boucle CSS sur desktop — masqués aux lecteurs d'écran */}
        {SHOTS.map((shot) => (
          <ScreenshotFrame key={`${shot.src}-dup`} shot={shot} hidden />
        ))}
      </div>
    </div>
  );
}
