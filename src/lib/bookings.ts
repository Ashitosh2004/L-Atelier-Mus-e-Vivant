/**
 * Server-only booking service — Prisma access, validation, availability math.
 */
import { Prisma, PrismaClient } from "@prisma/client";
import {
  CAPACITY_PER_SLOT,
  MAX_PER_BOOKING,
  MAX_MONTHS_AHEAD,
  EMPTY_TICKETS,
  generateReference,
  isValidDateStr,
  parseISODate,
  slotsForDate,
  totalVisitors,
  totalPrice,
  type BookingDTO,
  type DayAvailability,
  type SlotAvailability,
  type TicketCounts,
} from "./museum";

export type { BookingDTO, DayAvailability, SlotAvailability } from "./museum";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
// BookingDTO / DayAvailability / SlotAvailability live in museum.ts
// (shared wire types) and are re-exported above.

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function toDTO(b: {
  reference: string;
  date: string;
  slot: string;
  name: string;
  email: string;
  phone: string | null;
  adults: number;
  seniors: number;
  under26: number;
  children: number;
  visitors: number;
  total: number;
  status: string;
  createdAt: Date;
}): BookingDTO {
  return {
    reference: b.reference,
    date: b.date,
    slot: b.slot,
    name: b.name,
    email: b.email,
    phone: b.phone,
    tickets: {
      adult: b.adults,
      senior: b.seniors,
      under26: b.under26,
      children: b.children,
    },
    visitors: b.visitors,
    total: b.total,
    status: b.status,
    createdAt: b.createdAt.toISOString(),
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validEmail(s: unknown): s is string {
  return typeof s === "string" && s.length <= 120 && EMAIL_RE.test(s.trim());
}

/* ------------------------------------------------------------------ */
/* Availability                                                        */
/* ------------------------------------------------------------------ */

export async function availabilityForDate(
  date: string
): Promise<DayAvailability> {
  const slots = slotsForDate(date);
  if (slots.length === 0) {
    return { date, open: false, nocturne: false, slots: [] };
  }

  const groups = await prisma.booking.groupBy({
    by: ["slot"],
    where: { date, status: "CONFIRMED" },
    _sum: { adults: true, seniors: true, under26: true, children: true },
  });

  const bookedBySlot = new Map<string, number>();
  for (const g of groups) {
    const s = g._sum;
    bookedBySlot.set(
      g.slot,
      (s.adults ?? 0) + (s.seniors ?? 0) + (s.under26 ?? 0) + (s.children ?? 0)
    );
  }

  return {
    date,
    open: true,
    nocturne: slots.length > 9,
    slots: slots.map((slot) => {
      const booked = Math.min(bookedBySlot.get(slot) ?? 0, CAPACITY_PER_SLOT);
      return {
        slot,
        capacity: CAPACITY_PER_SLOT,
        booked,
        remaining: Math.max(0, CAPACITY_PER_SLOT - booked),
      };
    }),
  };
}

/* ------------------------------------------------------------------ */
/* Validation shared by create                                         */
/* ------------------------------------------------------------------ */

export interface CreateBookingInput {
  date: string;
  slot: string;
  name: string;
  email: string;
  phone?: string | null;
  tickets: TicketCounts;
}

export type ValidationResult =
  | { ok: true; value: CreateBookingInput }
  | { ok: false; error: string };

export function validateBookingInput(raw: unknown): ValidationResult {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Invalid request body." };
  }
  const body = raw as Record<string, unknown>;

  if (!isValidDateStr(body.date)) {
    return { ok: false, error: "Please pick a valid date." };
  }
  const date = body.date;

  // not in the past (1 day grace for timezone skew between client & server)
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
  if (date < yStr) {
    return { ok: false, error: "That date has already passed." };
  }
  // within booking window
  const max = new Date(today);
  max.setMonth(max.getMonth() + MAX_MONTHS_AHEAD);
  const maxStr = `${max.getFullYear()}-${String(max.getMonth() + 1).padStart(2, "0")}-${String(max.getDate()).padStart(2, "0")}`;
  if (date > maxStr) {
    return { ok: false, error: `Bookings open ${MAX_MONTHS_AHEAD} months ahead.` };
  }

  const slots = slotsForDate(date);
  if (slots.length === 0) {
    return { ok: false, error: "The museum is closed on Mondays." };
  }
  if (typeof body.slot !== "string" || !slots.includes(body.slot)) {
    return { ok: false, error: "Please choose an entry time for that day." };
  }

  const name =
    typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  if (name.length < 2) {
    return { ok: false, error: "Please enter the name for the reservation." };
  }

  if (!validEmail(body.email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  const email = (body.email as string).trim().toLowerCase();

  let phone: string | null = null;
  if (body.phone != null && body.phone !== "") {
    if (typeof body.phone !== "string" || body.phone.trim().length > 40) {
      return { ok: false, error: "Phone number looks invalid." };
    }
    phone = body.phone.trim();
  }

  // tickets
  if (typeof body.tickets !== "object" || body.tickets === null) {
    return { ok: false, error: "Please select at least one ticket." };
  }
  const t = body.tickets as Record<string, unknown>;
  const tickets: TicketCounts = { ...EMPTY_TICKETS };
  for (const key of Object.keys(tickets) as (keyof TicketCounts)[]) {
    const v = t[key];
    const n = typeof v === "number" ? Math.floor(v) : NaN;
    if (!Number.isFinite(n) || n < 0 || n > MAX_PER_BOOKING) {
      return { ok: false, error: "Ticket quantities look invalid." };
    }
    tickets[key] = n;
  }
  const visitors = totalVisitors(tickets);
  if (visitors < 1) {
    return { ok: false, error: "Please select at least one ticket." };
  }
  if (visitors > MAX_PER_BOOKING) {
    return {
      ok: false,
      error: `Groups larger than ${MAX_PER_BOOKING} — book by phone.`,
    };
  }

  return {
    ok: true,
    value: { date, slot: body.slot, name, email, phone, tickets },
  };
}

/* ------------------------------------------------------------------ */
/* Create — with live capacity check in a transaction                  */
/* ------------------------------------------------------------------ */

export class BookingError extends Error {
  code: string;
  remaining?: number;
  constructor(code: string, message: string, remaining?: number) {
    super(message);
    this.code = code;
    this.remaining = remaining;
  }
}

export async function createBooking(
  input: CreateBookingInput
): Promise<BookingDTO> {
  const visitors = totalVisitors(input.tickets);
  const total = totalPrice(input.tickets);

  return prisma.$transaction(
    async (tx) => {
      const agg = await tx.booking.aggregate({
        where: { date: input.date, slot: input.slot, status: "CONFIRMED" },
        _sum: { adults: true, seniors: true, under26: true, children: true },
      });
      const s = agg._sum;
      const booked =
        (s.adults ?? 0) + (s.seniors ?? 0) + (s.under26 ?? 0) + (s.children ?? 0);
      const remaining = CAPACITY_PER_SLOT - booked;
      if (visitors > remaining) {
        throw new BookingError(
          "SLOT_FULL",
          `Only ${Math.max(0, remaining)} spot${remaining === 1 ? "" : "s"} left at ${input.slot}.`,
          Math.max(0, remaining)
        );
      }

      // unique reference with retry
      for (let attempt = 0; attempt < 5; attempt++) {
        const reference = generateReference();
        try {
          const booking = await tx.booking.create({
            data: {
              reference,
              date: input.date,
              slot: input.slot,
              name: input.name,
              email: input.email,
              phone: input.phone,
              adults: input.tickets.adult,
              seniors: input.tickets.senior,
              under26: input.tickets.under26,
              children: input.tickets.children,
              visitors,
              total,
              status: "CONFIRMED",
            },
          });
          return toDTO(booking);
        } catch (e) {
          const isUnique =
            e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
          if (!isUnique || attempt === 4) throw e;
        }
      }
      throw new BookingError("REFERENCE", "Could not allocate a reference.");
    },
    { timeout: 8000 }
  );
}

/* ------------------------------------------------------------------ */
/* Lookup & cancel                                                     */
/* ------------------------------------------------------------------ */

export async function lookupBooking(
  reference: string,
  email: string
): Promise<BookingDTO | null> {
  const booking = await prisma.booking.findUnique({
    where: { reference },
  });
  if (!booking) return null;
  // only the holder (matching email) may view/cancel
  if (booking.email.toLowerCase() !== email.trim().toLowerCase()) return null;
  return toDTO(booking);
}

export async function cancelBooking(
  reference: string,
  email: string
): Promise<BookingDTO | null> {
  const found = await lookupBooking(reference, email);
  if (!found) return null;
  if (found.status === "CANCELLED") return found;
  const booking = await prisma.booking.update({
    where: { reference },
    data: { status: "CANCELLED" },
  });
  return toDTO(booking);
}
