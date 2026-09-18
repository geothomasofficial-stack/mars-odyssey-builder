# Mars Odyssey Builder

Since Lovable burns credits per generation/revision, the goal is one dense, unambiguous prompt that builds the whole core experience correctly on the first pass — rather than a sprawling wishlist that needs 10 follow-up fixes. I cut scope to what's achievable in one strong build, mocked the AI (a real Claude API call adds backend complexity that eats credits fast and is worth adding after the core works), and front-loaded exact specs so Lovable doesn't have to guess.

Prompt to paste into Lovable:

Build "MARS 2100" — an interactive luxury Mars tourism web app set in 2100, 
for ultra-wealthy Earth travelers. This must feel like a futuristic travel 
operating system, not a scrolling brochure. Every section needs a real 
interaction (click, drag, slider, toggle) — no static cards or filler text.

STACK: React + TypeScript + Tailwind CSS + Framer Motion + lucide-react icons.
Single shared journey state (React context or useState lifted to App level) 
that every section reads/writes — selections in one section must visibly 
affect others.

VISUAL STYLE: Near-black space background, Mars-rust orange primary accent, 
cyan secondary accent, glassmorphism panels with thin borders and subtle glow, 
HUD-style corner brackets on panels, wide-letter-spacing sans-serif headings. 
No generic rounded Bootstrap cards, no neon overload, no large text blocks.

BUILD THESE IN ORDER — do not skip ahead, and keep every step fully working 
before adding the next:

1. HERO: Full-screen dark Mars scene (CSS/SVG, no external images needed — 
   use gradients/canvas). Mars rotates slowly; cursor movement adds subtle 
   parallax. 3-4 glowing clickable hotspots on the planet. Clicking one opens 
   a floating glass panel with destination stats (distance, temp, access 
   level) and an "ADD TO EXPEDITION" button that writes to shared state. 
   Animated tagline (typewriter effect). CTA scrolls to Journey Builder.

2. LIVE HUD BAR: Fixed strip showing EARTH DISTANCE, MARS TIME (a real 
   ticking clock), ORBITAL STATUS, AI STATUS — small looping animations, 
   not just static numbers.

3. JOURNEY BUILDER (the core — most credits here): Multi-step wizard with a 
   clickable HUD-style stepper: Origin city (6 options) → Spacecraft (3 cards, 
   click to compare specs/price/speed, visible selected state) → Destination 
   (reuse hero's 4 destinations as selectable cards) → Travelers (custom 
   slider 1-12, not a dropdown) → Accommodation (3 residence options with 
   ON/OFF toggles for perks like Panoramic View, Private Concierge, Spa 
   Access — each toggle changes price) → Activities (7 options, add/remove 
   chips with running count) → Review (editable summary of every choice).
   A PERSISTENT SIDE PANEL shows live trip summary (spacecraft, destination, 
   residence, traveler count, activity count, TOTAL PRICE) that updates 
   instantly — animate the price number changing — on every single selection 
   anywhere in the wizard. Include RESET and CONFIRM buttons.

4. AURA (AI concierge) — MOCK THIS, don't call a real API. Build a chat panel 
   with a typing-indicator animation. Use a rule-based response function: 
   read the current journey state and current user input keywords 
   (romantic/adventure/relaxation/budget) and return a templated response 
   referencing their actual selections by name (e.g., "You've selected 
   [spacecraft] for [travelers] travelers — want me to add [suggested 
   activity]?"). Include an "ADD RECOMMENDATION" button that writes the 
   suggestion into journey state. Also include 4 quick-prompt chips.

5. RISK/WEATHER PANEL: A row of clickable cards (Radiation, Gravity, Dust 
   Storms, etc.) that expand on click to show a short animated stat 
   comparison (e.g., gravity bar: Earth 100% vs Mars 38%).

6. CONFIRMATION SCREEN: On CONFIRM, show a full-screen animated summary of 
   the whole journey (Earth → Spacecraft → Mars → Residence → Experiences) 
   with total cost, then "EXPEDITION PROFILE CREATED — WELCOME TO MARS 2100" 
   with VIEW / MODIFY / START AGAIN buttons. No real payment anywhere.

MICRO-INTERACTIONS throughout: button hover glow/scale, card lift-on-hover, 
smooth scroll-triggered fade/slide-ins, animated counters for price/stats. 
Respect prefers-reduced-motion.

SKIP FOR NOW (do not build): real backend, real AI API calls, mission-control 
launch sequence, gamified progress %, intro cinematic sequence. These can be 
added in a later pass once the core above works end-to-end.

Use realistic mock data throughout. Prioritize a fully working, polished 
steps 1-4 over partially-built steps 1-6.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0e8478c3-c349-4aaf-a14d-46dc602d43b2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
