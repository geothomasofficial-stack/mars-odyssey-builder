# MARS 2100 Passport and Interaction Upgrade

## Goal
Extend the existing expedition builder without restructuring it. The passport will use the current journey state and remain entirely mocked in-browser.

## Part 1 — Interplanetary Passport
1. Extend the shared journey model with traveler identity, departure date/tier display values, and the generated credential.
2. Add `TravelerForm.tsx` inside the Review stage, with inline validation, terminal-style fields, nationality selection, and a simulated biometric scan.
3. Add `PassportGenerator.tsx` for the staged 1–2 second verification and issuing sequence.
4. Add `DigitalPassport.tsx` with:
   - Live journey details and generated `MARS-2100-XXXX-XXXX` ID
   - Initials portrait, issue date, authority seal, verified badge, QR-like pattern, and barcode strip
   - Cursor-following holographic tilt and light sweep
   - Front/back flip for emergency, authorization, and biometric details
   - Real PNG download and clipboard sharing with toast feedback
5. Add a compact “MY PASSPORT” navigation action and “VIEW PASSPORT” on confirmation. Keep the generated passport available while the current journey remains active.
6. Verify the full form → scan → generate → flip → share → download → confirmation flow on desktop and mobile.

## Part 2 — Site-wide Interactivity
1. Add reusable magnetic-button, tilt-card, animated-number, reveal, toast, and lightweight starfield utilities/components.
2. Apply magnetic motion to primary actions and lift/tilt/glow to journey selection cards and the passport.
3. Animate journey-linked numbers, including travelers and total price, without changing calculations.
4. Add scroll reveals to existing major sections and retain smooth wizard transitions.
5. Audit hover, pressed, focus, disabled, slider, and toggle states across the page.
6. Respect reduced-motion settings for every new effect.
7. Verify key interactions and visual layout at desktop and mobile sizes.

## Technical Notes
- Add `html-to-image` for browser-side PNG export.
- Reuse the existing Button component, Motion package, semantic color tokens, and current single-page state flow.
- No backend, camera, real verification, payment, or external AI service.
