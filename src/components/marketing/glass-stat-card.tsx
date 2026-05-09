import { cn } from "@/lib/utils";

function buildTransform(
  rotateDeg: number,
  straddle?: "left" | "right" | "top" | "bottom" | "bottom-center"
) {
  if (straddle === "bottom-center") {
    return `translate(-50%, 50%) rotate(${rotateDeg}deg)`;
  }
  const parts: string[] = [];
  if (straddle === "left") parts.push("translateX(-50%)");
  if (straddle === "right") parts.push("translateX(50%)");
  if (straddle === "top") parts.push("translateY(-50%)");
  if (straddle === "bottom") parts.push("translateY(50%)");
  parts.push(`rotate(${rotateDeg}deg)`);
  return parts.join(" ");
}

/**
 * Carte vitrée positionnée sur un bord : la moitié chevauche la mascotte,
 * l'autre moitié déborde vers l'extérieur (utiliser straddle + absolute sur le bord visuel).
 */
export function GlassStatCard({
  className,
  rotateDeg = 0,
  straddle,
  children,
}: {
  className?: string;
  rotateDeg?: number;
  /** Centre la carte sur le bord du parent : moitié sur la mascotte, moitié vers l’extérieur. */
  straddle?: "left" | "right" | "top" | "bottom" | "bottom-center";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("revo-glass px-4 py-3 text-left pointer-events-none", className)}
      style={{ transform: buildTransform(rotateDeg, straddle) }}
    >
      {children}
    </div>
  );
}
