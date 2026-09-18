import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Starfield } from "@/components/starfield";
import { MagneticButton } from "@/components/magnetic-button";
import { AnimatedNumber } from "@/components/animated-number";
import { TravelerForm, validateTraveler } from "@/components/traveler-form";
import { PassportGenerator } from "@/components/passport-generator";
import { DigitalPassport } from "@/components/digital-passport";
import {
  createPassport,
  emptyTraveler,
  type Journey,
  type Passport,
  type TravelerInfo,
} from "@/lib/journey";

type Phase = "form" | "generating" | "passport";
type Errors = Partial<Record<keyof TravelerInfo, string>>;

export function RegistrationFlow({
  journey,
  total,
  accessTier,
  onBack,
  onReset,
}: {
  journey: Journey;
  total: number;
  accessTier: string;
  onBack: () => void;
  onReset: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("form");
  const [traveler, setTraveler] = useState<TravelerInfo>(emptyTraveler);
  const [errors, setErrors] = useState<Errors>({});
  const [passport, setPassport] = useState<Passport | null>(null);

  const validateField = (field: keyof TravelerInfo) => {
    const next = validateTraveler(traveler);
    setErrors((prev) => ({ ...prev, [field]: next[field] }));
  };

  const submit = () => {
    const next = validateTraveler(traveler);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById("register-top")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setPhase("generating");
  };

  const finishGenerating = () => {
    setPassport(createPassport(traveler, journey, accessTier));
    setPhase("passport");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Starfield className="pointer-events-none fixed inset-0 -z-0 opacity-70" />
      <div className="scan-grid pointer-events-none fixed inset-0 -z-0 opacity-40" />

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-16 md:px-8">
        <div id="register-top" className="mb-10 flex items-center justify-between">
          <Button variant="hud" size="sm" onClick={phase === "form" ? onBack : () => setPhase("form")} disabled={phase === "generating"}>
            <ChevronLeft /> {phase === "passport" ? "AMEND MANIFEST" : "BACK TO BUILDER"}
          </Button>
          <p className="font-display text-xs tracking-[.25em] text-secondary">
            {phase === "passport" ? "CREDENTIAL ISSUED" : "PASSAGE REGISTRATION"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {phase === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="grid items-start gap-6 lg:grid-cols-[1fr_300px]"
            >
              <div className="hud-panel p-6 md:p-8">
                <TravelerForm
                  value={traveler}
                  onChange={setTraveler}
                  errors={errors}
                  onFieldValidate={validateField}
                />
                <div className="mt-8 flex justify-end border-t border-border pt-6">
                  <MagneticButton>
                    <Button variant="mars" onClick={submit}>
                      ISSUE PASSPORT <ChevronRight />
                    </Button>
                  </MagneticButton>
                </div>
              </div>

              <aside className="hud-panel top-16 p-6 lg:sticky">
                <p className="font-display text-xs tracking-[.2em] text-secondary">EXPEDITION LOCKED</p>
                <dl className="mt-5 space-y-3 text-sm">
                  {[
                    ["Origin", journey.origin],
                    ["Vessel", journey.craft],
                    ["Destination", journey.destination],
                    ["Residence", journey.residence],
                    ["Travelers", String(journey.travelers)],
                    ["Access Tier", accessTier],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-3">
                      <dt className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">{k}</dt>
                      <dd className="text-right font-display text-xs">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 border-t border-border pt-5">
                  <span className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">
                    Private passage
                  </span>
                  <p className="mt-1 font-display text-3xl font-semibold text-primary">
                    <AnimatedNumber value={total} decimals={1} prefix="¤" suffix="M" />
                  </p>
                </div>
              </aside>
            </motion.div>
          )}

          {phase === "generating" && (
            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PassportGenerator onDone={finishGenerating} />
            </motion.div>
          )}

          {phase === "passport" && passport && (
            <motion.div
              key="passport"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-10"
            >
              <div className="text-center">
                <p className="font-display text-xs tracking-[.3em] text-secondary">WELCOME TO MARS 2100</p>
                <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-[.1em] md:text-6xl">
                  Passage <span className="text-primary">Confirmed</span>
                </h1>
                <p className="mt-4 text-sm text-muted-foreground">
                  {passport.traveler.fullName} · {journey.travelers} travelers ·{" "}
                  <span className="font-display text-primary">
                    <AnimatedNumber value={total} decimals={1} prefix="¤" suffix="M" />
                  </span>
                </p>
              </div>

              <DigitalPassport passport={passport} />

              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="hud" onClick={onBack}>
                  <ChevronLeft /> MODIFY EXPEDITION
                </Button>
                <Button variant="hud" onClick={onReset}>
                  <RotateCcw /> START AGAIN
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
