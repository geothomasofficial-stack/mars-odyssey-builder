import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Loader2 } from "lucide-react";

const STAGES = [
  "VERIFYING IDENTITY",
  "ENCODING BIOMETRIC SIGNATURE",
  "ISSUING CREDENTIAL",
];

/**
 * Animated processing sequence shown after the traveler form is submitted.
 * Calls onDone once the sequence finishes so the parent can reveal the passport.
 */
export function PassportGenerator({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  // Keep the latest onDone without making it an effect dependency: a new
  // onDone reference from a parent re-render must not restart the sequence.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const total = reduce ? 300 : 1800;
    const start = performance.now();
    let raf = 0;
    let doneTimer: ReturnType<typeof setTimeout> | undefined;
    const tick = (now: number) => {
      const pct = Math.min(100, ((now - start) / total) * 100);
      setProgress(pct);
      setStage(Math.min(STAGES.length - 1, Math.floor((pct / 100) * STAGES.length)));
      if (pct < 100) raf = requestAnimationFrame(tick);
      else doneTimer = setTimeout(() => onDoneRef.current(), reduce ? 0 : 280);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (doneTimer) clearTimeout(doneTimer);
    };
  }, [reduce]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hud-panel mx-auto flex min-h-[420px] max-w-lg flex-col items-center justify-center gap-8 p-10 text-center"
    >
      <div className="relative grid size-28 place-items-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-primary/25 border-t-primary [animation-duration:1.4s]" />
        <span className="absolute inset-3 animate-pulse rounded-full border border-secondary/40" />
        <Loader2 className="size-9 animate-spin text-secondary" />
      </div>

      <div className="w-full">
        <p className="font-display text-lg uppercase tracking-[.16em] text-primary">
          {STAGES[stage]}
        </p>
        <div className="relative mt-5 h-1.5 w-full overflow-hidden bg-input">
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_14px_var(--glow-primary)]"
            style={{ width: `${progress}%` }}
          />
          {!reduce && (
            <span className="animate-scan absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />
          )}
        </div>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          {Math.round(progress)}% · SECURE MARS AUTHORITY LINK
        </p>
      </div>

      <ul className="w-full space-y-2 text-left">
        {STAGES.map((s, i) => (
          <li key={s} className="flex items-center gap-3 font-display text-xs uppercase tracking-[.1em]">
            <span
              className={`grid size-5 place-items-center border ${
                i < stage || progress === 100
                  ? "border-secondary text-secondary"
                  : i === stage
                    ? "border-primary text-primary"
                    : "border-input text-muted-foreground"
              }`}
            >
              {i < stage || progress === 100 ? <Check className="size-3" /> : i + 1}
            </span>
            <span className={i <= stage ? "text-foreground" : "text-muted-foreground"}>{s}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
