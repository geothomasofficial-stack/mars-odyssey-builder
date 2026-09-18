import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { Check, Copy, Download, Fingerprint, Rotate3D } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Journey, PassportCredential } from "./types";

export function DigitalPassport({ passport, journey, onNotify }: { passport: PassportCredential; journey: Journey; onNotify: (message: string) => void }) {
  const [back, setBack] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const rotateX = useTransform(my, [-.5, .5], [reduced ? 0 : 7, reduced ? 0 : -7]);
  const rotateY = useTransform(mx, [-.5, .5], [reduced ? 0 : -9, reduced ? 0 : 9]);
  const initials = passport.traveler.fullName.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
  const qr = useMemo(() => Array.from({ length: 121 }, (_, index) => ((index * 17 + passport.id.charCodeAt(index % passport.id.length)) % 7) < 3), [passport.id]);
  const move = (event: React.MouseEvent<HTMLDivElement>) => { const rect = event.currentTarget.getBoundingClientRect(); mx.set((event.clientX - rect.left) / rect.width - .5); my.set((event.clientY - rect.top) / rect.height - .5); };
  const download = async () => { if (!cardRef.current) return; const { toPng } = await import("html-to-image"); const url = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: "#081014" }); const link = document.createElement("a"); link.download = `${passport.id}.png`; link.href = url; link.click(); onNotify("Credential downloaded"); };
  const share = async () => { const link = `https://mars2100.example/credential/${passport.id}`; await navigator.clipboard.writeText(link); onNotify("Secure credential link copied"); };
  return <motion.div initial={{ opacity: 0, rotateY: 90, scale: .92 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} transition={{ type: "spring", stiffness: 120, damping: 18 }} className="space-y-5 [perspective:1200px]">
    <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} onMouseMove={move} onMouseLeave={() => { mx.set(0); my.set(0); }} className="relative mx-auto max-w-4xl">
      <div ref={cardRef} className="passport-shimmer hud-panel relative aspect-[1.58/1] min-h-[430px] overflow-hidden p-6 sm:p-8">
        <AnimatePresence mode="wait" initial={false}>
          {!back ? <motion.div key="front" initial={{ opacity: 0, rotateY: -70 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: 70 }} className="flex h-full flex-col">
            <header className="flex items-start justify-between gap-4 border-b border-border pb-4"><div><p className="font-display text-[10px] tracking-[.28em] text-secondary">MARS INTERPLANETARY AUTHORITY</p><h3 className="mt-1 font-display text-xl uppercase tracking-[.12em] sm:text-2xl">Digital Passage Credential</h3></div><Seal/></header>
            <div className="grid flex-1 gap-6 py-6 sm:grid-cols-[150px_1fr_116px]">
              <div><div className="grid aspect-square place-items-center rounded-full border border-primary bg-accent/70 shadow-[0_0_30px_var(--glow-primary)]"><span className="font-display text-4xl text-primary">{initials}</span></div><div className="mt-4 inline-flex items-center gap-2 border border-secondary/50 bg-secondary/10 px-2 py-1 font-display text-[9px] text-secondary"><Check className="size-3"/> CREDENTIAL VERIFIED</div></div>
              <div className="grid content-start grid-cols-2 gap-x-5 gap-y-4"><Data label="Traveler" value={passport.traveler.fullName}/><Data label="Passport ID" value={passport.id}/><Data label="Nationality" value={passport.traveler.nationality}/><Data label="Issue date" value={passport.issueDate}/><Data label="Spacecraft" value={journey.craft}/><Data label="Destination" value={journey.destination}/><Data label="Departure" value={journey.departureDate}/><Data label="Passage tier" value={journey.tier}/></div>
              <div><div className="grid grid-cols-11 gap-px border border-secondary/30 bg-background p-2">{qr.map((filled, index) => <i key={index} className={`aspect-square ${filled ? "bg-secondary" : "bg-transparent"}`}/>)}</div><p className="mt-2 text-center font-mono text-[8px] text-muted-foreground">QUANTUM PASS KEY</p></div>
            </div>
            <Barcode id={passport.id}/>
          </motion.div> : <motion.div key="back" initial={{ opacity: 0, rotateY: 70 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: -70 }} className="flex h-full flex-col justify-between">
            <div><p className="font-display text-[10px] tracking-[.28em] text-secondary">SECURE CREDENTIAL REVERSE</p><h3 className="mt-2 font-display text-2xl uppercase">Mission authorization</h3></div>
            <div className="grid gap-4 sm:grid-cols-2"><Data label="Emergency contact" value={passport.traveler.emergencyContact}/><Data label="Earth passport" value={passport.traveler.passportNumber}/><Data label="Authorization code" value={passport.authorizationCode}/><Data label="Biometric hash" value={passport.biometricHash}/></div>
            <div className="flex items-center gap-4 border border-secondary/30 bg-secondary/5 p-4"><Fingerprint className="size-9 text-secondary"/><div><p className="font-display text-xs tracking-[.16em] text-secondary">BIOMETRIC SIGNATURE LOCKED</p><p className="mt-1 font-mono text-[9px] text-muted-foreground">AUTHORIZED FOR EARTH–MARS TRANSIT · NON-TRANSFERABLE</p></div></div><Barcode id={passport.biometricHash}/>
          </motion.div>}
        </AnimatePresence>
      </div>
    </motion.div>
    <div className="flex flex-wrap justify-center gap-3"><Button variant="hud" onClick={() => setBack(value => !value)} className="active:scale-95"><Rotate3D/> {back ? "VIEW FRONT" : "FLIP CREDENTIAL"}</Button><Button variant="hud" onClick={share} className="active:scale-95"><Copy/> SHARE</Button><Button variant="mars" onClick={download} className="active:scale-95"><Download/> DOWNLOAD CREDENTIAL</Button></div>
  </motion.div>;
}

function Data({ label, value }: { label: string; value: string }) { return <div className="min-w-0"><small className="block font-display text-[8px] uppercase tracking-[.15em] text-muted-foreground">{label}</small><b className="mt-1 block truncate font-mono text-xs font-medium text-foreground sm:text-sm">{value}</b></div>; }
function Seal() { return <div className="relative grid size-14 shrink-0 place-items-center rounded-full border border-primary text-primary"><span className="absolute inset-1 rounded-full border border-dashed border-primary/60"/><span className="font-display text-xs font-bold">MIA</span></div>; }
function Barcode({ id }: { id: string }) { return <div><div className="flex h-8 items-stretch gap-px overflow-hidden opacity-70">{Array.from({ length: 70 }, (_, index) => <i key={index} className="bg-foreground" style={{ width: `${(id.charCodeAt(index % id.length) % 3) + 1}px` }}/>)}</div><p className="mt-1 font-mono text-[8px] tracking-[.22em] text-muted-foreground">{id.replaceAll("-", " ")} · MIA 2100</p></div>; }