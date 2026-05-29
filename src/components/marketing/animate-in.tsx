"use client";

import { useEffect, useRef, useState } from "react";

interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
}

const TRANSLATE: Record<NonNullable<AnimateInProps["direction"]>, string> = {
  up:    "translateY(24px)",
  down:  "translateY(-24px)",
  left:  "translateX(-24px)",
  right: "translateX(24px)",
  none:  "none",
};

export function AnimateIn({
  children,
  className,
  style,
  delay = 0,
  direction = "up",
  duration = 0.55,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-60px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : TRANSLATE[direction],
        transition: visible
          ? `opacity ${duration}s cubic-bezier(0.25,0.4,0.25,1) ${delay}s, transform ${duration}s cubic-bezier(0.25,0.4,0.25,1) ${delay}s`
          : "none",
      }}
    >
      {children}
    </div>
  );
}

export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-stagger-visible={visible ? "true" : undefined}
      style={{ "--stagger-delay": `${staggerDelay}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`revo-stagger-item ${className ?? ""}`}>
      {children}
    </div>
  );
}
