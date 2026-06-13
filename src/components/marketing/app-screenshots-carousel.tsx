"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

const LOOPED_SHOTS = [...SHOTS, ...SHOTS];
const GAP_PX = 20;
const AUTO_SCROLL_SPEED = 55;
const RESUME_DELAY_MS = 2000;

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
    <figure
      className="w-[220px] shrink-0 sm:w-[280px] md:w-[300px]"
      aria-hidden={hidden || undefined}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/50 sm:shadow-lg sm:shadow-slate-200/60">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-red-300" />
          <span className="h-2 w-2 rounded-full bg-amber-300" />
          <span className="h-2 w-2 rounded-full bg-green-300" />
          <span className="mx-auto text-[10px] text-slate-400">app.revo.coach</span>
        </div>
        <Image
          src={shot.src}
          alt={hidden ? "" : shot.caption}
          width={408}
          height={457}
          sizes="(max-width: 640px) 220px, (max-width: 768px) 280px, 300px"
          draggable={false}
          className="pointer-events-none h-auto w-full select-none object-cover"
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
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const isPausedRef = useRef(false);
  const isVisibleRef = useRef(false);
  const autoScrollEnabledRef = useRef(true);
  const dragState = useRef({ active: false, startX: 0, startOffset: 0 });
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  }, []);

  const normalizeOffset = useCallback(() => {
    const loopWidth = loopWidthRef.current;
    if (loopWidth <= 0) return;

    while (offsetRef.current <= -loopWidth) {
      offsetRef.current += loopWidth;
    }
    while (offsetRef.current > 0) {
      offsetRef.current -= loopWidth;
    }
  }, []);

  const measureLoopWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    loopWidthRef.current = track.scrollWidth / 2;
    normalizeOffset();
    applyTransform();
  }, [applyTransform, normalizeOffset]);

  const pauseAutoScroll = useCallback((temporary = false) => {
    isPausedRef.current = true;
    setIsAnimating(false);

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    if (temporary && autoScrollEnabledRef.current) {
      resumeTimerRef.current = setTimeout(() => {
        if (isVisibleRef.current) {
          isPausedRef.current = false;
          setIsAnimating(true);
        }
        resumeTimerRef.current = null;
      }, RESUME_DELAY_MS);
    }
  }, []);

  const resumeAutoScroll = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    if (isVisibleRef.current && autoScrollEnabledRef.current) {
      isPausedRef.current = false;
      setIsAnimating(true);
    }
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileViewport = window.matchMedia("(max-width: 767px)");

    const updateMotionPrefs = () => {
      autoScrollEnabledRef.current =
        !reducedMotion.matches && !mobileViewport.matches;
      if (!autoScrollEnabledRef.current) {
        isPausedRef.current = true;
        setIsAnimating(false);
      }
    };

    updateMotionPrefs();
    reducedMotion.addEventListener("change", updateMotionPrefs);
    mobileViewport.addEventListener("change", updateMotionPrefs);
    return () => {
      reducedMotion.removeEventListener("change", updateMotionPrefs);
      mobileViewport.removeEventListener("change", updateMotionPrefs);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          isPausedRef.current = true;
          setIsAnimating(false);
          return;
        }
        if (autoScrollEnabledRef.current && !dragState.current.active) {
          isPausedRef.current = false;
          setIsAnimating(true);
        }
      },
      { rootMargin: "80px", threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    measureLoopWidth();

    const observer = new ResizeObserver(() => measureLoopWidth());
    observer.observe(track);
    window.addEventListener("resize", measureLoopWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureLoopWidth);
    };
  }, [measureLoopWidth]);

  useEffect(() => {
    let animationFrame = 0;
    let lastTimestamp = performance.now();

    const tick = (timestamp: number) => {
      const deltaMs = Math.min(timestamp - lastTimestamp, 32);
      lastTimestamp = timestamp;

      if (
        autoScrollEnabledRef.current &&
        isVisibleRef.current &&
        !isPausedRef.current &&
        !dragState.current.active &&
        loopWidthRef.current > 0
      ) {
        offsetRef.current -= (AUTO_SCROLL_SPEED * deltaMs) / 1000;
        normalizeOffset();
        applyTransform();
        setIsAnimating(true);
      }

      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [applyTransform, normalizeOffset]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const getScrollStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 240;

    const firstFrame = track.querySelector("figure");
    if (!firstFrame) return 240;

    return firstFrame.getBoundingClientRect().width + GAP_PX;
  }, []);

  const scrollByStep = useCallback(
    (direction: "left" | "right") => {
      pauseAutoScroll(true);
      const delta = direction === "left" ? getScrollStep() : -getScrollStep();
      offsetRef.current += delta;
      normalizeOffset();
      applyTransform();
    },
    [applyTransform, getScrollStep, normalizeOffset, pauseAutoScroll]
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pauseAutoScroll();

    dragState.current = {
      active: true,
      startX: event.clientX,
      startOffset: offsetRef.current,
    };
    setIsDragging(true);
    setIsAnimating(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;

    const delta = event.clientX - dragState.current.startX;
    offsetRef.current = dragState.current.startOffset + delta;
    normalizeOffset();
    applyTransform();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;

    dragState.current.active = false;
    setIsDragging(false);
    setIsAnimating(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    pauseAutoScroll(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2"
      aria-label="Aperçu réel de l'application Revo"
    >
      <button
        type="button"
        onClick={() => scrollByStep("left")}
        aria-label="Voir la capture précédente"
        className="absolute left-3 top-[calc(50%-1.25rem)] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md transition hover:bg-white sm:left-5 sm:h-11 sm:w-11"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>

      <button
        type="button"
        onClick={() => scrollByStep("right")}
        aria-label="Voir la capture suivante"
        className="absolute right-3 top-[calc(50%-1.25rem)] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md transition hover:bg-white sm:right-5 sm:h-11 sm:w-11"
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>

      <div
        className={cn(
          "overflow-hidden py-2",
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={() => pauseAutoScroll()}
        onMouseLeave={() => {
          if (!dragState.current.active) resumeAutoScroll();
        }}
      >
        <div
          ref={trackRef}
          className={cn(
            "revo-marquee-track flex w-max gap-5",
            isAnimating && "will-change-transform"
          )}
        >
          {LOOPED_SHOTS.map((shot, index) => (
            <ScreenshotFrame
              key={`${shot.src}-${index}`}
              shot={shot}
              priority={index < 2}
              hidden={index >= SHOTS.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
