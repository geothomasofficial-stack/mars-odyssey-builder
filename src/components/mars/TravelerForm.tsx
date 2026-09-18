import { motion, useReducedMotion } from "motion/react";
import { Fingerprint, ScanLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { TravelerInfo } from "./types";

const countries = ["United States", "United Kingdom", "United Arab Emirates", "Singapore", "Japan", "Australia", "India", "Canada", "France", "Germany"];
const emptyTraveler: TravelerInfo = { fullName: "", dateOfBirth: "", nationality: "", passportNumber: "", emergencyContact: "", biometricVerified: false };

export function TravelerForm({ initialValue, onSubmit }: { initialValue?: TravelerInfo; onSubmit: (traveler: TravelerInfo) => void }) {
  const [traveler, setTraveler] = useState(initialValue ?? emptyTraveler);
  const [errors, setErrors] = useState<Partial<Record<keyof TravelerInfo, string>>>({});
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(initialValue?.biometricVerified ? 100 : 0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!scanning) return;
    const interval = window.setInterval(() => setProgress(value => Math.min(100, value + 4)), reduceMotion ? 8 : 45);
    return () => window.clearInterval(interval);
  }, [scanning, reduceMotion]);

  useEffect(() => {
    if (progress < 100 || !scanning) return;
    setScanning(false);
    setTraveler(value => ({ ...value, biometricVerified: true }));
    setErrors(value => ({ ...value, biometricVerified: undefined }));
  }, [progress, scanning]);

  const setField = (field: keyof TravelerInfo, value: string) => {
    setTraveler(current => ({ ...current, [field]: value }));
    if (value.trim()) setErrors(current => ({ ...current, [field]: undefined }));
  };

  const submit = () => {
    const nextErrors: typeof errors = {};
    if (!traveler.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!traveler.dateOfBirth) nextErrors.dateOfBirth = "Date of birth is required";
    if (!traveler.nationality) nextErrors.nationality = "Select a nationality";
    if (!traveler.passportNumber.trim()) nextErrors.passportNumber = "Passport number is required";
    if (!traveler.emergencyContact.trim()) nextErrors.emergencyContact = "Emergency contact is required";
    if (!traveler.biometricVerified) nextErrors.biometricVerified = "Complete the biometric scan";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSubmit(traveler);
  };

  const fieldClass = "peer h-14 w-full border border-input bg-background/70 px-3 pt-5 font-mono text-sm outline-none transition-all hover:border-secondary/70 focus:border-primary focus:shadow-[0_0_16px_var(--glow-primary)] active:border-primary";
  const labelClass = "pointer-events-none absolute left-3 top-2 font-display text-[9px] uppercase tracking-[.16em] text-muted-foreground transition-all peer-focus:text-primary";
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Full name" error={errors.fullName}><input aria-label="Full Name" value={traveler.fullName} onChange={e => setField("fullName", e.target.value)} className={fieldClass} placeholder="TRAVELER NAME"/><span className={labelClass}>Full name</span></Field>
      <Field label="Date of birth" error={errors.dateOfBirth}><input aria-label="Date of Birth" type="date" value={traveler.dateOfBirth} onChange={e => setField("dateOfBirth", e.target.value)} className={fieldClass}/><span className={labelClass}>Date of birth</span></Field>
      <Field label="Nationality" error={errors.nationality}><select aria-label="Nationality" value={traveler.nationality} onChange={e => setField("nationality", e.target.value)} className={fieldClass}><option value="">SELECT NATION</option>{countries.map(country => <option key={country}>{country}</option>)}</select><span className={labelClass}>Nationality</span></Field>
      <Field label="Earth passport number" error={errors.passportNumber}><input aria-label="Earth Passport Number" value={traveler.passportNumber} onChange={e => setField("passportNumber", e.target.value.toUpperCase())} className={fieldClass} placeholder="A00000000"/><span className={labelClass}>Earth passport number</span></Field>
      <Field label="Emergency contact" error={errors.emergencyContact}><input aria-label="Emergency Contact" value={traveler.emergencyContact} onChange={e => setField("emergencyContact", e.target.value)} className={fieldClass} placeholder="NAME · CONTACT"/><span className={labelClass}>Emergency contact</span></Field>
      <div className="border border-border bg-muted/30 p-4">
        <div className="flex items-center gap-4">
          <div className="relative grid size-16 place-items-center rounded-full border border-secondary/40">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64"><circle cx="32" cy="32" r="29" fill="none" stroke="var(--border)" strokeWidth="2"/><circle cx="32" cy="32" r="29" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeDasharray="182" strokeDashoffset={182 - 182 * progress / 100} className="transition-all"/></svg>
            {traveler.biometricVerified ? <Fingerprint className="text-secondary"/> : <ScanLine className={scanning ? "animate-pulse text-primary" : "text-muted-foreground"}/>} 
          </div>
          <div className="min-w-0 flex-1"><p className="font-display text-xs tracking-[.15em]">BIOMETRIC SIGNATURE</p><p className="mt-1 font-mono text-[10px] text-muted-foreground">{traveler.biometricVerified ? "SCAN VERIFIED · 99.98%" : scanning ? `SCANNING · ${progress}%` : "AWAITING PALM SCAN"}</p></div>
          <Button type="button" variant="hud" size="sm" disabled={scanning || traveler.biometricVerified} onClick={() => { setProgress(0); setScanning(true); }}>{traveler.biometricVerified ? "VERIFIED" : "SCAN"}</Button>
        </div>
        {errors.biometricVerified && <p role="alert" className="mt-2 text-xs text-destructive">{errors.biometricVerified}</p>}
      </div>
    </div>
    <Button variant="mars" size="lg" className="w-full active:scale-[.98]" onClick={submit}><Fingerprint/> GENERATE INTERPLANETARY PASSPORT</Button>
  </motion.div>;
}

function Field({ children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return <label className="relative block">{children}{error && <span role="alert" className="mt-1 block text-xs text-destructive">{error}</span>}</label>;
}