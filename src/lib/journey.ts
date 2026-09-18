export type Journey = {
  origin: string;
  craft: string;
  destination: string;
  travelers: number;
  residence: string;
  perks: string[];
  activities: string[];
};

export type TravelerInfo = {
  fullName: string;
  dob: string;
  nationality: string;
  passportNumber: string;
  emergencyContact: string;
  biometricComplete: boolean;
};

export type Passport = {
  id: string;
  issueDate: string;
  departureDate: string;
  tier: string;
  authCode: string;
  biometricHash: string;
  traveler: TravelerInfo;
  journey: Journey;
};

export const emptyTraveler: TravelerInfo = {
  fullName: "",
  dob: "",
  nationality: "",
  passportNumber: "",
  emergencyContact: "",
  biometricComplete: false,
};

export const nationalities = [
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Singapore",
  "Japan",
  "Australia",
  "Germany",
  "France",
  "Canada",
  "Brazil",
  "India",
  "South Africa",
  "Lunar Colony",
  "Orbital Citizen",
];

const HEX = "0123456789ABCDEF";
const CODE = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";

function randChars(source: string, length: number) {
  let out = "";
  for (let i = 0; i < length; i++) out += source[Math.floor(Math.random() * source.length)];
  return out;
}

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "MX";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const tierByAccess: Record<string, string> = {
  Olympus: "PLATINUM CLEARANCE",
};

/** Deterministic-ish cell grid for a QR-style pattern derived from a seed string. */
export function qrCells(seed: string, size = 11) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const cells: boolean[] = [];
  for (let i = 0; i < size * size; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    cells.push((h & 7) > 3);
  }
  return cells;
}

/** Variable-width bars for a decorative barcode strip. */
export function barcodeBars(seed: string, count = 60) {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = (h * 33) ^ seed.charCodeAt(i);
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    h ^= h << 13;
    h ^= h >>> 7;
    bars.push(1 + (Math.abs(h) % 4));
  }
  return bars;
}

export function createPassport(traveler: TravelerInfo, journey: Journey, accessTier: string): Passport {
  const now = new Date();
  const departure = new Date(now.getTime() + (90 + Math.floor(Math.random() * 120)) * 86400000);
  return {
    id: `MARS-2100-${randChars(CODE, 4)}-${randChars(CODE, 4)}`,
    issueDate: now.toISOString().slice(0, 10),
    departureDate: departure.toISOString().slice(0, 10),
    tier: tierByAccess[accessTier] ?? `${accessTier} CLEARANCE`,
    authCode: `AUTH-${randChars(CODE, 6)}`,
    biometricHash: `${randChars(HEX, 8)}:${randChars(HEX, 8)}:${randChars(HEX, 8)}:${randChars(HEX, 8)}`,
    traveler,
    journey,
  };
}
