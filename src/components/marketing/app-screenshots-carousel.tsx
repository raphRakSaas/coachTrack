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

function ScreenshotFrame({ shot }: { shot: Shot }) {
  return (
    <figure className="w-[260px] shrink-0 sm:w-[300px]">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40">
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
        />
      </div>
      <figcaption className="mt-3 text-center text-xs font-medium text-slate-500">
        {shot.caption}
      </figcaption>
    </figure>
  );
}

export function AppScreenshotsCarousel() {
  const doubled = [...SHOTS, ...SHOTS];
  return (
    <div
      className="revo-marquee-mask group relative overflow-hidden"
      aria-label="Aperçu réel de l'application Revo"
    >
      <div className="revo-marquee flex w-max gap-5 py-2">
        {doubled.map((shot, index) => (
          <ScreenshotFrame key={`${shot.src}-${index}`} shot={shot} />
        ))}
      </div>
    </div>
  );
}
