import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { PassportCredential, TravelerInfo } from "./types";

const statuses = ["VERIFYING IDENTITY", "ENCODING BIOMETRIC SIGNATURE", "ISSUING CREDENTIAL"];

const code = (length: number) => Array.from({ length }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

export function PassportGenerator({ traveler, onComplete }: { traveler: TravelerInfo; onComplete: (passport: PassportCredential) => void }) {
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const duration = reduceMotion ? 80 : 1600;
    const start = performance.now();
    let frame = 0;
    const run = (now: number) => {
      const next = Math.min(100, ((now - start) / duration) * 100);
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(run);
      else onComplete({ id: `MARS-2100-${code(4)}-${code(4)}`, issueDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(), authorizationCode: `AUTH-${code(4)}-${code(6)}`, biometricHash: `${code(8)}-${code(8)}-${code(8)}`, traveler });
    };
    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [onComplete, reduceMotion, traveler]);
  const status = statuses[Math.min(2, Math.floor(progress / 34))];
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hud-panel overflow-hidden p-8 text-center">
    <div className="mx-auto mb-7 grid size-24 place-items-center rounded-full border border-secondary/40"><span className="font-display text-2xl text-secondary">{Math.round(progress)}%</span><span className="absolute size-20 animate-ping rounded-full border border-primary/30"/></div>
    <p className="font-display text-sm tracking-[.2em] text-primary">{status}</p>
    <div className="mx-auto mt-5 h-1 max-w-xl overflow-hidden bg-muted"><motion.div className="h-full bg-secondary shadow-[0_0_16px_var(--glow-secondary)]" animate={{ width: `${progress}%` }}/></div>
    <p className="mt-4 font-mono text-[10px] text-muted-foreground">MIA SECURE IDENTITY CHANNEL · ENCRYPTION ACTIVE</p>
  </motion.div>;
}