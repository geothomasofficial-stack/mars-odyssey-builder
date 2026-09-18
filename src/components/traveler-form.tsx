import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Fingerprint, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nationalities, type TravelerInfo } from "@/lib/journey";

type Errors = Partial<Record<keyof TravelerInfo, string>>;

export type TravelerFormHandle = { validate: () => boolean };

function HudField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  mono = false,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  mono?: boolean;
  placeholder?: string;
  type?: string;
}) {
  const [focused, setFocused] = useState(false);
  const filled = focused || value.length > 0;
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-3 z-10 font-display uppercase tracking-[.18em] transition-all duration-200 ${
          filled ? "top-1.5 text-[9px] text-secondary" : "top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
        }`}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={focused ? placeholder : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onBlur();
        }}
        onChange={(e) => onChange(e.target.value)}
        className={`h-14 w-full border bg-background/70 px-3 pt-4 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/50 ${
          mono ? "font-mono tracking-wider" : ""
        } ${
          error
            ? "border-destructive"
            : focused
              ? "border-primary shadow-[0_0_18px_var(--glow-primary)]"
              : "border-input hover:border-border"
        }`}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 font-display text-[10px] uppercase tracking-[.12em] text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function BiometricScanner({ complete, onComplete }: { complete: boolean; onComplete: () => void }) {
  const reduce = useReducedMotion();
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(complete ? 100 : 0);
  const raf = useRef<number>(0);

  const start = () => {
    if (scanning || complete) return;
    setScanning(true);
    setProgress(0);
    const startTime = performance.now();
    const duration = reduce ? 200 : 2200;
    const step = (now: number) => {
      const pct = Math.min(100, ((now - startTime) / duration) * 100);
      setProgress(pct);
      if (pct < 100) raf.current = requestAnimationFrame(step);
      else {
        setScanning(false);
        onComplete();
      }
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const r = 34;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-5 border border-input bg-background/50 p-4">
      <button
        type="button"
        onClick={start}
        aria-label="Run biometric scan"
        className="relative grid size-24 shrink-0 place-items-center rounded-full outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-default"
        disabled={complete}
      >
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="var(--input)" strokeWidth="3" />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={complete ? "var(--secondary)" : "var(--primary)"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ - (progress / 100) * circ}
            style={{ transition: scanning ? "none" : "stroke-dashoffset .3s ease" }}
          />
        </svg>
        {complete ? (
          <Check className="size-8 text-secondary" />
        ) : (
          <Fingerprint className={`size-8 text-primary ${scanning ? "animate-pulse" : ""}`} />
        )}
        {scanning && !reduce && (
          <span className="pointer-events-none absolute inset-2 overflow-hidden rounded-full">
            <span className="animate-scan block h-px w-full bg-secondary" />
          </span>
        )}
      </button>
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-display text-sm uppercase tracking-[.12em]">
          <ScanLine className="size-4 text-secondary" /> Biometric Scan
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {complete
            ? "SIGNATURE CAPTURED · 100%"
            : scanning
              ? `SCANNING… ${Math.round(progress)}%`
              : "TAP SENSOR TO CAPTURE SIGNATURE"}
        </p>
      </div>
    </div>
  );
}

export function TravelerForm({
  value,
  onChange,
  errors,
  onFieldValidate,
}: {
  value: TravelerInfo;
  onChange: (next: TravelerInfo) => void;
  errors: Errors;
  onFieldValidate: (field: keyof TravelerInfo) => void;
}) {
  const set = <K extends keyof TravelerInfo>(key: K, v: TravelerInfo[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div>
      <p className="mb-2 font-display text-xs tracking-[.2em] text-secondary">TRAVELER MANIFEST</p>
      <h3 className="mb-2 font-display text-2xl uppercase tracking-[.08em]">Identity Registration</h3>
      <p className="mb-7 text-sm text-muted-foreground">
        Provide traveler credentials to issue your interplanetary passport. Mock registry — no real
        verification performed.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <HudField
          id="tf-name"
          label="Full Name"
          value={value.fullName}
          onChange={(v) => set("fullName", v)}
          onBlur={() => onFieldValidate("fullName")}
          error={errors.fullName}
          placeholder="e.g. Aria Vance"
        />
        <HudField
          id="tf-dob"
          label="Date of Birth"
          type="date"
          mono
          value={value.dob}
          onChange={(v) => set("dob", v)}
          onBlur={() => onFieldValidate("dob")}
          error={errors.dob}
        />

        <div className="relative">
          <label
            htmlFor="tf-nat"
            className="pointer-events-none absolute left-3 top-1.5 z-10 font-display text-[9px] uppercase tracking-[.18em] text-secondary"
          >
            Nationality
          </label>
          <select
            id="tf-nat"
            value={value.nationality}
            onChange={(e) => set("nationality", e.target.value)}
            onBlur={() => onFieldValidate("nationality")}
            className={`h-14 w-full appearance-none border bg-background/70 px-3 pt-4 text-sm outline-none transition-all duration-200 ${
              errors.nationality
                ? "border-destructive"
                : "border-input hover:border-border focus:border-primary focus:shadow-[0_0_18px_var(--glow-primary)]"
            }`}
          >
            <option value="" disabled>
              Select origin nation
            </option>
            {nationalities.map((n) => (
              <option key={n} value={n} className="bg-popover text-popover-foreground">
                {n}
              </option>
            ))}
          </select>
          <AnimatePresence>
            {errors.nationality && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-1 font-display text-[10px] uppercase tracking-[.12em] text-destructive"
              >
                {errors.nationality}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <HudField
          id="tf-passport"
          label="Earth Passport No."
          mono
          value={value.passportNumber}
          onChange={(v) => set("passportNumber", v.toUpperCase())}
          onBlur={() => onFieldValidate("passportNumber")}
          error={errors.passportNumber}
          placeholder="E.g. X1234567"
        />
        <div className="md:col-span-2">
          <HudField
            id="tf-emergency"
            label="Emergency Contact"
            value={value.emergencyContact}
            onChange={(v) => set("emergencyContact", v)}
            onBlur={() => onFieldValidate("emergencyContact")}
            error={errors.emergencyContact}
            placeholder="Name · relation · comms channel"
          />
        </div>
      </div>

      <div className="mt-5">
        <BiometricScanner complete={value.biometricComplete} onComplete={() => set("biometricComplete", true)} />
        <AnimatePresence>
          {errors.biometricComplete && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-1 font-display text-[10px] uppercase tracking-[.12em] text-destructive"
            >
              {errors.biometricComplete}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function validateTraveler(t: TravelerInfo): Errors {
  const e: Errors = {};
  if (!t.fullName.trim()) e.fullName = "Required";
  else if (t.fullName.trim().length < 2) e.fullName = "Enter full name";
  if (!t.dob) e.dob = "Required";
  if (!t.nationality) e.nationality = "Select a nationality";
  if (!t.passportNumber.trim()) e.passportNumber = "Required";
  else if (t.passportNumber.trim().length < 6) e.passportNumber = "Min 6 characters";
  if (!t.emergencyContact.trim()) e.emergencyContact = "Required";
  if (!t.biometricComplete) e.biometricComplete = "Complete the biometric scan";
  return e;
}
