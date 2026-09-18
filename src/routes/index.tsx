import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Activity, ArrowDown, Bot, Check, ChevronLeft, ChevronRight, CircleDollarSign,
  Clock3, Gauge, MapPin, Minus, Orbit, Plus, Radio, RotateCcw, Send, Shield,
  Sparkles, Thermometer, Users, Wind, X, Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "MARS 2100 — Private Interplanetary Expeditions" },
    { name: "description", content: "Configure a private luxury expedition from Earth to Mars in the year 2100." },
    { property: "og:title", content: "MARS 2100 — Private Interplanetary Expeditions" },
    { property: "og:description", content: "Your private passage to Mars begins here." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MarsApp,
});

type Journey = { origin: string; craft: string; destination: string; travelers: number; residence: string; perks: string[]; activities: string[] };
const initial: Journey = { origin: "New York", craft: "Ares Sovereign", destination: "Olympus Mons", travelers: 2, residence: "Horizon Villa", perks: ["Panoramic View"], activities: ["Low-G Flight"] };
const origins = ["New York", "London", "Dubai", "Singapore", "Tokyo", "Sydney"];
const crafts = [
  { name: "Ares Sovereign", speed: "112 days", price: 38, spec: "Private orbital suite" },
  { name: "Helios Clipper", speed: "86 days", price: 62, spec: "Fusion sail · 0.04g" },
  { name: "Valkyrie One", speed: "64 days", price: 95, spec: "Priority orbital lane" },
];
const destinations = [
  { name: "Olympus Mons", temp: "−63°C", distance: "225M km", access: "PLATINUM", pos: "left-[28%] top-[24%]" },
  { name: "Valles Marineris", temp: "−47°C", distance: "226M km", access: "ELITE", pos: "left-[62%] top-[45%]" },
  { name: "Elysium Planitia", temp: "−58°C", distance: "224M km", access: "PRIME", pos: "left-[44%] top-[68%]" },
  { name: "Jezero Oasis", temp: "−51°C", distance: "227M km", access: "SIGNATURE", pos: "left-[72%] top-[24%]" },
];
const residences = [
  { name: "Horizon Villa", price: 18, note: "Cliffside glass observatory" },
  { name: "Crater Estate", price: 31, note: "Subterranean private compound" },
  { name: "Orbital Penthouse", price: 48, note: "Phobos-facing orbital residence" },
];
const perks = [{ name: "Panoramic View", price: 4 }, { name: "Private Concierge", price: 7 }, { name: "Spa Access", price: 5 }];
const activities = ["Low-G Flight", "Canyon Descent", "Rover Safari", "Phobos Dinner", "Ice Cave Walk", "Red Dune Sail", "Solar Observatory"];
const steps = ["Origin", "Spacecraft", "Destination", "Travelers", "Residence", "Activities", "Review"];

function MarsApp() {
  const [journey, setJourney] = useState<Journey>(initial);
  const [step, setStep] = useState(0);
  const [hotspot, setHotspot] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [marsTime, setMarsTime] = useState("");
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  useEffect(() => { const tick = () => setMarsTime(new Date(Date.now() * 1.027491).toISOString().slice(11, 19)); tick(); const id = window.setInterval(tick, 1000); return () => window.clearInterval(id); }, []);
  const total = useMemo(() => {
    const craft = crafts.find(x => x.name === journey.craft)?.price ?? 0;
    const residence = residences.find(x => x.name === journey.residence)?.price ?? 0;
    const perk = perks.filter(x => journey.perks.includes(x.name)).reduce((a, x) => a + x.price, 0);
    return (craft + residence + perk + journey.activities.length * 2.4) * journey.travelers;
  }, [journey]);
  const update = <K extends keyof Journey>(key: K, value: Journey[K]) => setJourney(j => ({ ...j, [key]: value }));
  const scrollBuilder = () => document.getElementById("builder")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });

  if (confirmed) return <Confirmation journey={journey} total={total} onModify={() => setConfirmed(false)} onReset={() => { setJourney(initial); setStep(0); setConfirmed(false); }} />;

  return <main className="min-h-screen overflow-hidden bg-background text-foreground">
    <section onMouseMove={e => setPointer({ x: (e.clientX / innerWidth - .5) * 14, y: (e.clientY / innerHeight - .5) * 14 })} className="scan-grid relative flex min-h-[92vh] items-center overflow-hidden border-b border-border px-5 pb-24 pt-20 md:px-12">
      <div className="absolute inset-0 opacity-20"><div className="animate-scan h-px w-full bg-secondary" /></div>
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <p className="mb-5 font-display text-xs font-semibold uppercase tracking-[.3em] text-secondary">Interplanetary passage authority · 2100</p>
          <h1 className="font-display text-6xl font-bold tracking-[.12em] text-foreground sm:text-8xl">MARS<br/><span className="text-primary">2100</span></h1>
          <p className="mt-6 min-h-14 max-w-xl font-display text-lg uppercase tracking-[.12em] text-muted-foreground">Beyond Earth. Beyond ordinary. Your private passage awaits.</p>
          <Button variant="mars" size="lg" onClick={scrollBuilder} className="mt-8 h-12 px-7 font-display tracking-[.12em]">BUILD YOUR JOURNEY <ArrowDown /></Button>
        </motion.div>
        <div className="relative mx-auto aspect-square w-full max-w-[650px]" style={{ transform: `translate(${pointer.x}px, ${pointer.y}px)` }}>
          <div className="absolute inset-[7%] rounded-full border border-secondary/20" />
          <div className="absolute inset-[15%] rounded-full border border-primary/30" />
          <div className="mars-surface animate-mars absolute inset-[18%] rounded-full" />
          {destinations.map((d, i) => <Button key={d.name} aria-label={`Open ${d.name}`} title={d.name} variant="ghost" size="icon" onClick={() => setHotspot(i)} className={`absolute z-20 ${d.pos} rounded-full border border-secondary bg-secondary/20 text-secondary shadow-[0_0_20px_var(--glow-secondary)]`}><span className="animate-pulse-ring absolute inset-0 rounded-full border border-secondary"/><MapPin /></Button>)}
          <AnimatePresence mode="wait"><motion.div key={hotspot} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="hud-panel absolute bottom-0 right-0 z-30 w-64 p-5">
            <p className="font-display text-lg font-semibold text-primary">{destinations[hotspot].name}</p>
            <div className="my-4 grid grid-cols-3 gap-2 text-[10px] uppercase text-muted-foreground"><span>Distance<b className="mt-1 block text-foreground">{destinations[hotspot].distance}</b></span><span>Temp<b className="mt-1 block text-foreground">{destinations[hotspot].temp}</b></span><span>Access<b className="mt-1 block text-secondary">{destinations[hotspot].access}</b></span></div>
            <Button variant="hud" size="sm" className="w-full text-[10px]" onClick={() => { update("destination", destinations[hotspot].name); scrollBuilder(); }}>ADD TO EXPEDITION</Button>
          </motion.div></AnimatePresence>
        </div>
      </div>
    </section>

    <div className="sticky top-0 z-40 border-y border-border bg-background/90 px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-4">
        <Hud icon={<Radio/>} label="EARTH DISTANCE" value="225,041,883 KM" />
        <Hud icon={<Clock3/>} label="MARS TIME · MTC" value={marsTime || "00:00:00"} />
        <Hud icon={<Orbit/>} label="ORBITAL STATUS" value="WINDOW STABLE" pulse />
        <Hud icon={<Bot/>} label="AURA STATUS" value="ONLINE" pulse />
      </div>
    </div>

    <section id="builder" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <SectionHead code="01 / EXPEDITION DESIGN" title="Journey Builder" sub="Configure every stage. All estimates shown in millions of Earth credits." />
      <div className="mb-7 flex gap-1 overflow-x-auto pb-2">{steps.map((s, i) => <Button key={s} variant="hud" size="sm" onClick={() => setStep(i)} className={`shrink-0 border-t-2 ${step === i ? "border-t-primary text-primary" : "border-t-transparent"}`}><span className="text-[10px] text-muted-foreground">0{i+1}</span>{s}</Button>)}</div>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_330px]">
        <div className="hud-panel min-h-[520px] p-5 md:p-8">
          <AnimatePresence mode="wait"><motion.div key={step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}>
            <StepContent step={step} journey={journey} update={update} />
          </motion.div></AnimatePresence>
          <div className="mt-10 flex justify-between border-t border-border pt-5">
            <Button variant="hud" disabled={step === 0} onClick={() => setStep(s => s - 1)}><ChevronLeft/> BACK</Button>
            {step < 6 ? <Button variant="mars" onClick={() => setStep(s => s + 1)}>CONTINUE <ChevronRight/></Button> : <Button variant="mars" onClick={() => setConfirmed(true)}>CONFIRM EXPEDITION <Check/></Button>}
          </div>
        </div>
        <TripSummary journey={journey} total={total} onReset={() => setJourney(initial)} onConfirm={() => setConfirmed(true)} />
      </div>
    </section>

    <Aura journey={journey} update={update} />
    <RiskPanel />
    <footer className="border-t border-border px-5 py-10 text-center font-display text-xs tracking-[.2em] text-muted-foreground">MARS 2100 · PRIVATE PASSAGE NETWORK · EARTH / LUNA / MARS</footer>
  </main>;
}

function Hud({ icon, label, value, pulse=false }: { icon: React.ReactNode; label:string; value:string; pulse?:boolean }) { return <div className="flex items-center gap-3"><span className="text-secondary [&_svg]:size-4">{icon}</span><span><small className="block font-display text-[9px] tracking-[.15em] text-muted-foreground">{label}</small><b className="font-display text-xs font-medium text-foreground">{pulse && <i className="mr-2 inline-block size-1.5 animate-pulse rounded-full bg-secondary"/>}{value}</b></span></div> }
function SectionHead({ code, title, sub }: { code:string; title:string; sub:string }) { return <div className="mb-10"><p className="font-display text-xs tracking-[.25em] text-primary">{code}</p><h2 className="mt-2 font-display text-4xl font-semibold uppercase tracking-[.08em] md:text-5xl">{title}</h2><p className="mt-3 max-w-2xl text-sm text-muted-foreground">{sub}</p></div> }
function Choice({ active, title, meta, onClick }: { active:boolean; title:string; meta?:string; onClick:()=>void }) { return <Button variant="hud" onClick={onClick} className={`h-auto min-h-24 w-full whitespace-normal p-5 text-left ${active ? "border-primary bg-accent shadow-[0_0_20px_var(--glow-primary)]" : ""}`}><span className="block w-full"><span className="flex items-center justify-between font-display text-base uppercase tracking-[.08em]">{title}{active && <Check className="text-primary"/>}</span>{meta && <small className="mt-2 block text-xs font-normal text-muted-foreground">{meta}</small>}</span></Button> }

function StepContent({ step, journey, update }: { step:number; journey:Journey; update:<K extends keyof Journey>(k:K,v:Journey[K])=>void }) {
  const toggleList = (key: "perks"|"activities", item:string) => update(key, journey[key].includes(item) ? journey[key].filter(x=>x!==item) : [...journey[key], item]);
  return <div><p className="mb-2 font-display text-xs tracking-[.2em] text-secondary">STEP {step+1} OF 7</p><h3 className="mb-7 font-display text-2xl uppercase tracking-[.08em]">{["Select Earth departure", "Choose your vessel", "Choose Mars arrival", "Travel party", "Private residence", "Curate experiences", "Expedition review"][step]}</h3>
    {step===0 && <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{origins.map(x=><Choice key={x} title={x} active={journey.origin===x} onClick={()=>update("origin",x)}/>)}</div>}
    {step===1 && <div className="grid gap-3 md:grid-cols-3">{crafts.map(x=><Choice key={x.name} title={x.name} meta={`${x.speed} · ¤${x.price}M / traveler · ${x.spec}`} active={journey.craft===x.name} onClick={()=>update("craft",x.name)}/>)}</div>}
    {step===2 && <div className="grid gap-3 md:grid-cols-2">{destinations.map(x=><Choice key={x.name} title={x.name} meta={`${x.temp} · ${x.access} access`} active={journey.destination===x.name} onClick={()=>update("destination",x.name)}/>)}</div>}
    {step===3 && <div className="py-10"><div className="mb-10 flex items-end justify-between"><span className="font-display text-7xl text-primary">{journey.travelers.toString().padStart(2,"0")}</span><span className="mb-2 text-sm text-muted-foreground">PRIVATE TRAVELERS</span></div><input aria-label="Number of travelers" type="range" min="1" max="12" value={journey.travelers} onChange={e=>update("travelers",Number(e.target.value))} className="h-1 w-full cursor-pointer accent-primary"/><div className="mt-3 flex justify-between font-display text-xs text-muted-foreground"><span>1</span><span>6</span><span>12</span></div></div>}
    {step===4 && <div className="space-y-3"><div className="grid gap-3 md:grid-cols-3">{residences.map(x=><Choice key={x.name} title={x.name} meta={`¤${x.price}M · ${x.note}`} active={journey.residence===x.name} onClick={()=>update("residence",x.name)}/>)}</div><div className="mt-7 grid gap-3 sm:grid-cols-3">{perks.map(x=><Button key={x.name} variant="hud" onClick={()=>toggleList("perks",x.name)} className="justify-between"><span>{x.name} <small className="text-muted-foreground">+¤{x.price}M</small></span><span className={`h-5 w-9 border p-0.5 ${journey.perks.includes(x.name)?"border-primary bg-primary/20":"border-border"}`}><i className={`block size-3.5 bg-muted-foreground transition-transform ${journey.perks.includes(x.name)?"translate-x-4 bg-primary":""}`}/></span></Button>)}</div></div>}
    {step===5 && <div><p className="mb-5 text-sm text-muted-foreground">{journey.activities.length} experiences selected · ¤2.4M each / traveler</p><div className="flex flex-wrap gap-3">{activities.map(x=><Button key={x} variant={journey.activities.includes(x)?"mars":"hud"} onClick={()=>toggleList("activities",x)}>{journey.activities.includes(x)?<Minus/>:<Plus/>}{x}</Button>)}</div></div>}
    {step===6 && <div className="divide-y divide-border">{([ ["Origin",journey.origin,0], ["Spacecraft",journey.craft,1], ["Destination",journey.destination,2], ["Travelers",String(journey.travelers),3], ["Residence",journey.residence,4], ["Experiences",journey.activities.join(", ")||"None",5] ] as const).map(([a,b,n])=><div key={a} className="flex items-center justify-between gap-4 py-4"><span className="text-xs uppercase tracking-[.12em] text-muted-foreground">{a}</span><span className="text-right font-display text-sm">{b}</span><Button aria-label={`Edit ${a}`} variant="ghost" size="icon" onClick={()=>{ const el=document.querySelectorAll('[id="builder"]')[0]; el?.scrollIntoView(); window.dispatchEvent(new CustomEvent("noop")); /* handled by direct step controls */ }}><Zap/></Button></div>)}</div>}
  </div>
}

function TripSummary({journey,total,onReset,onConfirm}:{journey:Journey;total:number;onReset:()=>void;onConfirm:()=>void}) { return <aside className="hud-panel top-24 p-6 lg:sticky"><p className="font-display text-xs tracking-[.2em] text-secondary">LIVE EXPEDITION PROFILE</p><div className="mt-6 space-y-4 text-sm"><Summary icon={<Orbit/>} label="Spacecraft" value={journey.craft}/><Summary icon={<MapPin/>} label="Destination" value={journey.destination}/><Summary icon={<Shield/>} label="Residence" value={journey.residence}/><Summary icon={<Users/>} label="Travelers" value={String(journey.travelers)}/><Summary icon={<Activity/>} label="Experiences" value={String(journey.activities.length)}/></div><div className="mt-7 border-y border-border py-5"><span className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">Total private passage</span><motion.p key={total} initial={{opacity:.4,y:4}} animate={{opacity:1,y:0}} className="mt-1 font-display text-4xl font-semibold text-primary">¤{total.toFixed(1)}M</motion.p></div><div className="mt-5 grid grid-cols-2 gap-2"><Button variant="hud" onClick={onReset}><RotateCcw/> RESET</Button><Button variant="mars" onClick={onConfirm}><Check/> CONFIRM</Button></div></aside> }
function Summary({icon,label,value}:{icon:React.ReactNode;label:string;value:string}) { return <div className="flex gap-3"><span className="text-primary [&_svg]:size-4">{icon}</span><span><small className="block text-[9px] uppercase tracking-[.15em] text-muted-foreground">{label}</small><b className="font-display text-xs font-medium">{value}</b></span></div> }

function Aura({journey,update}:{journey:Journey;update:<K extends keyof Journey>(k:K,v:Journey[K])=>void}) {
  const [messages,setMessages]=useState([`Welcome. I’m AURA. I’m monitoring your ${journey.destination} expedition.`]); const [input,setInput]=useState(""); const [typing,setTyping]=useState(false); const [suggestion,setSuggestion]=useState("Phobos Dinner");
  const send=(text:string)=>{ if(!text.trim())return; setMessages(m=>[...m,`You: ${text}`]);setInput("");setTyping(true);window.setTimeout(()=>{let s=text.toLowerCase().includes("romantic")?"Phobos Dinner":text.toLowerCase().includes("adventure")?"Canyon Descent":text.toLowerCase().includes("relax")?"Solar Observatory":"Rover Safari";setSuggestion(s);setMessages(m=>[...m,`AURA: You’ve selected ${journey.craft} for ${journey.travelers} travelers. I recommend ${s} for your ${journey.destination} stay.`]);setTyping(false)},700)};
  return <section className="border-y border-border bg-muted/30 px-5 py-24"><div className="mx-auto max-w-7xl"><SectionHead code="02 / INTELLIGENCE" title="AURA Concierge" sub="A private itinerary intelligence layer, tuned to your live expedition profile."/><div className="grid gap-6 lg:grid-cols-[.55fr_1fr]"><div className="hud-panel flex min-h-64 items-center justify-center overflow-hidden p-8"><div className="relative"><div className="absolute inset-[-35px] animate-pulse rounded-full border border-secondary/30"/><Bot className="size-28 stroke-1 text-secondary"/><span className="absolute -right-8 top-0 font-display text-[10px] text-secondary">ONLINE / 01</span></div></div><div className="hud-panel p-5"><div className="h-48 space-y-3 overflow-y-auto pr-2">{messages.map((m,i)=><motion.p initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} key={`${m}-${i}`} className={`max-w-[90%] border-l-2 p-3 text-sm ${m.startsWith("You")?"ml-auto border-primary bg-accent/40":"border-secondary bg-muted/50"}`}>{m}</motion.p>)}{typing&&<p className="text-secondary">AURA is thinking <span className="animate-pulse">•••</span></p>}</div><div className="mt-4 flex flex-wrap gap-2">{["Romantic","Adventure","Relaxation","Budget"].map(x=><Button key={x} variant="hud" size="sm" onClick={()=>send(x)}>{x}</Button>)}</div><div className="mt-3 flex gap-2"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)} aria-label="Message AURA" placeholder="Ask AURA about your expedition…" className="min-w-0 flex-1 border border-input bg-background px-3 text-sm outline-none focus:border-primary"/><Button variant="mars" size="icon" onClick={()=>send(input)} aria-label="Send"><Send/></Button></div><Button variant="hud" className="mt-3 w-full" disabled={journey.activities.includes(suggestion)} onClick={()=>update("activities",[...journey.activities,suggestion])}><Sparkles/> {journey.activities.includes(suggestion)?"RECOMMENDATION ADDED":`ADD ${suggestion.toUpperCase()}`}</Button></div></div></div></section>
}

function RiskPanel(){const risks=[{name:"Radiation",icon:<Zap/>,earth:12,mars:68,unit:"mSv index"},{name:"Gravity",icon:<Gauge/>,earth:100,mars:38,unit:"relative force"},{name:"Dust Storms",icon:<Wind/>,earth:8,mars:72,unit:"seasonal risk"},{name:"Thermal Range",icon:<Thermometer/>,earth:24,mars:81,unit:"variance"}];const [open,setOpen]=useState(1);return <section className="mx-auto max-w-7xl px-5 py-24"><SectionHead code="03 / ENVIRONMENT" title="Risk & Weather" sub="Live comparative modeling for your selected landing season."/><div className="grid gap-3 md:grid-cols-4">{risks.map((r,i)=><Button key={r.name} variant="hud" onClick={()=>setOpen(i)} className={`h-auto flex-col items-stretch whitespace-normal p-5 text-left ${open===i?"border-secondary":""}`}><span className="flex items-center gap-3 font-display uppercase tracking-[.08em] text-secondary">{r.icon}{r.name}</span><AnimatePresence>{open===i&&<motion.span initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="mt-6 block overflow-hidden"><small className="mb-2 flex justify-between">EARTH <b>{r.earth}%</b></small><i className="mb-4 block h-1 bg-muted"><motion.i initial={{width:0}} animate={{width:`${r.earth}%`}} className="block h-full bg-muted-foreground"/></i><small className="mb-2 flex justify-between">MARS <b>{r.mars}%</b></small><i className="block h-1 bg-muted"><motion.i initial={{width:0}} animate={{width:`${r.mars}%`}} className="block h-full bg-primary"/></i><em className="mt-4 block text-[10px] not-italic text-muted-foreground">{r.unit} · mitigated by expedition systems</em></motion.span>}</AnimatePresence></Button>)}</div></section>}

function Confirmation({journey,total,onModify,onReset}:{journey:Journey;total:number;onModify:()=>void;onReset:()=>void}){return <main className="scan-grid flex min-h-screen items-center justify-center bg-background p-5 text-foreground"><motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} className="w-full max-w-5xl"><p className="text-center font-display text-xs tracking-[.3em] text-secondary">EXPEDITION PROFILE CREATED</p><h1 className="mt-4 text-center font-display text-5xl font-bold tracking-[.1em] md:text-7xl">WELCOME TO <span className="text-primary">MARS 2100</span></h1><div className="my-12 flex flex-wrap items-center justify-center gap-3 font-display text-sm uppercase"><span>{journey.origin}</span><ChevronRight className="text-primary"/><span>{journey.craft}</span><ChevronRight className="text-primary"/><span>{journey.destination}</span><ChevronRight className="text-primary"/><span>{journey.residence}</span><ChevronRight className="text-primary"/><span>{journey.activities.length} experiences</span></div><div className="hud-panel mx-auto max-w-xl p-7 text-center"><CircleDollarSign className="mx-auto mb-3 size-8 text-secondary"/><small className="tracking-[.2em] text-muted-foreground">PRIVATE PASSAGE ESTIMATE</small><p className="mt-2 font-display text-5xl text-primary">¤{total.toFixed(1)}M</p><p className="mt-3 text-sm text-muted-foreground">{journey.travelers} travelers · {journey.destination} · dossier M21-{Date.now().toString().slice(-6)}</p></div><div className="mt-10 flex flex-wrap justify-center gap-3"><Button variant="mars" onClick={onModify}>VIEW / MODIFY</Button><Button variant="hud" onClick={onReset}><RotateCcw/> START AGAIN</Button></div></motion.div></main>}