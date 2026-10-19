/**
 * L'Atelier booking domain — shared between the booking UI (client) and
 * the API routes (server). Pure functions only, no imports.
 */

export const CAPACITY_PER_SLOT = 14; // visitors per entry slot
export const MAX_PER_BOOKING = 8; // max tickets in one reservation
export const MAX_MONTHS_AHEAD = 3; // calendar navigation window

/** Standard entry slots, Tue–Sun. Last entry 17:00, doors close 18:00. */
export const DAY_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

/** Extra evening slots for Nocturne Thursdays (open until 22:00). */
export const NOCTURNE_SLOTS = ["18:00", "19:00", "20:00", "21:00"];

export interface TicketType {
  id: "adult" | "senior" | "under26" | "children";
  label: string;
  detail: string;
  price: number; // whole euros
}

export const TICKET_TYPES: TicketType[] = [
  {
    id: "adult",
    label: "Adult",
    detail: "26 years and older",
    price: 14,
  },
  {
    id: "senior",
    label: "Senior",
    detail: "65+ · concession rate",
    price: 10,
  },
  {
    id: "under26",
    label: "Under 26",
    detail: "Always free — ID at the door",
    price: 0,
  },
  {
    id: "children",
    label: "Under 12",
    detail: "Always free — with an adult",
    price: 0,
  },
];

export type TicketCounts = Record<TicketType["id"], number>;

export const EMPTY_TICKETS: TicketCounts = {
  adult: 0,
  senior: 0,
  under26: 0,
  children: 0,
};

/* ------------------------------------------------------------------ */
/* Date helpers — all dates are plain "YYYY-MM-DD" strings, compared   */
/* lexically, so no timezone conversions can silently break things.    */
/* ------------------------------------------------------------------ */

export function todayStr(): string {
  const d = new Date();
  return toISODate(d);
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  // reject rollovers like 2026-02-31
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d)
    return null;
  return date;
}

export function isValidDateStr(s: unknown): s is string {
  return typeof s === "string" && parseISODate(s) !== null;
}

/** 0 = Sunday … 6 = Saturday */
export function weekdayOf(dateStr: string): number {
  const d = parseISODate(dateStr);
  return d ? d.getDay() : -1;
}

/** The museum is closed on Mondays (and past dates). */
export function isOpenDate(dateStr: string): boolean {
  return weekdayOf(dateStr) !== 1;
}

export function isNocturne(dateStr: string): boolean {
  return weekdayOf(dateStr) === 4;
}

/** Which entry slots exist on a given date (Thursday runs late). */
export function slotsForDate(dateStr: string): string[] {
  if (!isOpenDate(dateStr)) return [];
  return isNocturne(dateStr) ? [...DAY_SLOTS, ...NOCTURNE_SLOTS] : DAY_SLOTS;
}

/* ------------------------------------------------------------------ */
/* Tickets                                                             */
/* ------------------------------------------------------------------ */

export function totalVisitors(t: TicketCounts): number {
  return t.adult + t.senior + t.under26 + t.children;
}

export function totalPrice(t: TicketCounts): number {
  return (
    t.adult * TICKET_TYPES[0].price + t.senior * TICKET_TYPES[1].price
  );
}

export function formatEur(n: number): string {
  return n === 0 ? "Free" : `€${n}`;
}

/* ------------------------------------------------------------------ */
/* Wire types (shared client + server)                                 */
/* ------------------------------------------------------------------ */

export interface SlotAvailability {
  slot: string;
  capacity: number;
  booked: number;
  remaining: number;
}

export interface DayAvailability {
  date: string;
  open: boolean;
  nocturne: boolean;
  slots: SlotAvailability[];
}

export interface BookingDTO {
  reference: string;
  date: string;
  slot: string;
  name: string;
  email: string;
  phone: string | null;
  tickets: TicketCounts;
  visitors: number;
  total: number;
  status: string;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Reference codes — ATL-XXXXXX, no ambiguous characters               */
/* ------------------------------------------------------------------ */

const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateReference(rand: () => number = Math.random): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += REF_ALPHABET[Math.floor(rand() * REF_ALPHABET.length)];
  }
  return `ATL-${code}`;
}

export function isValidReference(s: unknown): s is string {
  return typeof s === "string" && /^ATL-[A-Z2-9]{6}$/.test(s);
}

/* ------------------------------------------------------------------ */
/* Display formatting                                                  */
/* ------------------------------------------------------------------ */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function monthLabel(year: number, month: number): string {
  return `${MONTHS[month]} ${year}`;
}

export function formatPrettyDate(dateStr: string): string {
  const d = parseISODate(dateStr);
  if (!d) return dateStr;
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatShortDate(dateStr: string): string {
  const d = parseISODate(dateStr);
  if (!d) return dateStr;
  return `${WEEKDAYS[d.getDay()].slice(0, 3)} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
}
