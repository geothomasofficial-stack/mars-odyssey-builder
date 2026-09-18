import { useEffect, useRef } from "react";

/**
 * Lightweight animated starfield rendered on a canvas. Fixed behind content,
 * pointer-events none. Honors prefers-reduced-motion by painting a single
 * static frame instead of animating.
 */
export function Starfield({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let stars: { x: number; y: number; z: number; r: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(160, Math.floor((window.innerWidth * window.innerHeight) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 0.6 + 0.4,
        r: Math.random() * 1.3 + 0.2,
      }));
    };

    const draw = (drift: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const s of stars) {
        const twinkle = 0.55 + 0.45 * Math.sin((drift + s.x + s.y) * 0.003 * s.z);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle =
          s.z > 0.8
            ? `oklch(0.85 0.09 55 / ${twinkle * 0.9})`
            : `oklch(0.82 0.11 210 / ${twinkle * 0.7})`;
        ctx.fill();
      }
    };

    let t = 0;
    const loop = () => {
      t += 16;
      for (const s of stars) {
        s.y += s.z * 0.12;
        if (s.y > window.innerHeight) s.y = 0;
      }
      draw(t);
      raf = window.requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduce) draw(0);
    else loop();

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
