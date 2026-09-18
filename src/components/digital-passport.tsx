import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { BadgeCheck, Download, RotateCw, Share2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { barcodeBars, initialsOf, qrCells, type Passport } from "@/lib/journey";

function Seal() {
  return (
    <div className="relative grid size-16 place-items-center" aria-hidden>
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin [animation-duration:26s]">
        <defs>
          <path id="seal-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-secondary font-display text-[8.5px] uppercase tracking-[.24em]">
          <textPath href="#seal-ring">
            MARS INTERPLANETARY AUTHORITY · 2100 ·
          </textPath>
        </text>
      </svg>
      <div className="grid size-9 place-items-center rounded-full border border-primary bg-primary/15 shadow-[0_0_16px_var(--glow-primary)]">
        <ShieldCheck className="size-5 text-primary" />
      </div>
    </div>
  );
}

function QrPattern({ seed }: { seed: string }) {
  const cells = qrCells(seed, 11);
  return (
    <div
      className="grid size-20 gap-px border border-secondary/30 bg-background/60 p-1"
      style={{ gridTemplateColumns: "repeat(11, 1fr)" }}
      aria-hidden
    >
      {cells.map((on, i) => (
        <span key={i} className={on ? "bg-foreground" : "bg-transparent"} />
      ))}
    </div>
  );
}

function Barcode({ seed }: { seed: string }) {
  const bars = barcodeBars(seed, 64);
  return (
    <div className="flex h-9 items-stretch gap-px overflow-hidden" aria-hidden>
      {bars.map((w, i) => (
        <span
          key={i}
          style={{ width: w }}
          className={i % 2 === 0 ? "bg-foreground" : "bg-transparent"}
        />
      ))}
    </div>
  );
}

function Field({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="font-display text-[8px] uppercase tracking-[.2em] text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-sm text-foreground ${mono ? "font-mono tracking-wide" : "font-display"}`}>
        {value}
      </p>
    </div>
  );
}

export function DigitalPassport({ passport }: { passport: Passport }) {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [exporting, setExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 18 });
  const sy = useSpring(py, { stiffness: 200, damping: 18 });
  const rotateX = useTransform(sy, [0, 1], [10, -10]);
  const rotateY = useTransform(sx, [0, 1], [-10, 10]);
  const sheenX = useTransform(sx, [0, 1], ["20%", "80%"]);
  const sheenBg = useTransform(
    sheenX,
    (x) => `linear-gradient(115deg, transparent 0%, oklch(0.85 0.12 200 / 18%) ${x}, transparent calc(${x} + 12%))`,
  );

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const download = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    reset();
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#0a0f14",
      });
      const link = document.createElement("a");
      link.download = `${passport.id}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Credential exported", { description: `${passport.id}.png saved` });
    } catch {
      toast.error("Export failed", { description: "Could not render the credential image." });
    } finally {
      setExporting(false);
    }
  };

  const share = async () => {
    const link = `https://mars2100.travel/credential/${passport.id}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Share link copied", { description: link });
    } catch {
      toast.error("Copy failed", { description: link });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="[perspective:1600px]">
        <motion.div
          initial={reduce ? false : { rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
        >
          <motion.div
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={reset}
            style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative"
          >
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 15 }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative h-[430px] w-[330px] sm:h-[460px] sm:w-[360px]"
            >
              {/* FRONT */}
              <div
                className="hud-panel absolute inset-0 flex flex-col overflow-hidden p-5 [backface-visibility:hidden]"
                style={{ backfaceVisibility: "hidden" }}
              >
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-20 mix-blend-screen"
                    style={{ background: sheenBg }}
                  />
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-[9px] uppercase tracking-[.22em] text-secondary">
                      Interplanetary Passport
                    </p>
                    <p className="font-display text-lg font-semibold uppercase tracking-[.12em] text-primary">
                      MARS 2100
                    </p>
                  </div>
                  <Seal />
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="relative grid size-16 shrink-0 place-items-center rounded-full border border-primary/60 bg-accent font-display text-xl font-semibold text-primary shadow-[0_0_20px_var(--glow-primary)]">
                    <span className="absolute inset-[-4px] animate-pulse rounded-full border border-primary/30" />
                    {initialsOf(passport.traveler.fullName)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-base uppercase tracking-[.08em] text-foreground">
                      {passport.traveler.fullName || "Unregistered"}
                    </p>
                    <p className="font-mono text-xs text-secondary">{passport.id}</p>
                    <span className="mt-1 inline-flex items-center gap-1 border border-secondary/50 bg-secondary/10 px-1.5 py-0.5 font-display text-[8px] uppercase tracking-[.14em] text-secondary">
                      <BadgeCheck className="size-3" /> Credential Verified
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-border py-4">
                  <Field label="Nationality" value={passport.traveler.nationality} mono={false} />
                  <Field label="Issue Date" value={passport.issueDate} />
                  <Field label="Spacecraft" value={passport.journey.craft} mono={false} />
                  <Field label="Destination" value={passport.journey.destination} mono={false} />
                  <Field label="Departure" value={passport.departureDate} />
                  <Field label="Tier" value={passport.tier} mono={false} />
                </div>

                <div className="mt-auto flex items-end justify-between gap-3">
                  <div>
                    <p className="font-display text-[8px] uppercase tracking-[.2em] text-muted-foreground">
                      Transit Vessel
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {passport.journey.origin} → {passport.journey.destination}
                    </p>
                  </div>
                  <QrPattern seed={passport.id} />
                </div>
                <div className="mt-3">
                  <Barcode seed={passport.authCode} />
                  <p className="mt-1 text-center font-mono text-[8px] tracking-[.3em] text-muted-foreground">
                    {passport.id.replace(/-/g, " ")}
                  </p>
                </div>
              </div>

              {/* BACK */}
              <div
                className="hud-panel absolute inset-0 flex flex-col gap-4 overflow-hidden p-5"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <p className="font-display text-[9px] uppercase tracking-[.22em] text-secondary">
                  Confidential · Authority Use
                </p>
                <div className="space-y-3 border-y border-border py-4">
                  <Field label="Date of Birth" value={passport.traveler.dob || "—"} />
                  <Field label="Earth Passport No." value={passport.traveler.passportNumber} />
                  <Field label="Emergency Contact" value={passport.traveler.emergencyContact} mono={false} />
                  <Field label="Mission Authorization" value={passport.authCode} />
                </div>
                <div>
                  <p className="font-display text-[8px] uppercase tracking-[.2em] text-muted-foreground">
                    Biometric Hash
                  </p>
                  <p className="mt-1 break-all font-mono text-[10px] leading-relaxed text-secondary">
                    {passport.biometricHash}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <Seal />
                  <QrPattern seed={passport.authCode} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="mars" onClick={download} disabled={exporting}>
          <Download /> {exporting ? "RENDERING…" : "DOWNLOAD CREDENTIAL"}
        </Button>
        <Button variant="hud" onClick={share}>
          <Share2 /> SHARE
        </Button>
        <Button variant="hud" onClick={() => setFlipped((f) => !f)}>
          <RotateCw /> {flipped ? "VIEW FRONT" : "FLIP TO BACK"}
        </Button>
      </div>
    </div>
  );
}
