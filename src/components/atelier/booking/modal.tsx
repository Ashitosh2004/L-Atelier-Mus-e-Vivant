"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Loader2,
  Minus,
  Plus,
  X,
} from "lucide-react";
import {
  EMPTY_TICKETS,
  MAX_PER_BOOKING,
  TICKET_TYPES,
  formatEur,
  formatPrettyDate,
  type BookingDTO,
  type DayAvailability,
  type TicketCounts,
  totalPrice,
  totalVisitors,
} from "@/lib/museum";
import { useBookingStore } from "../booking-store";
import { EASE } from "../reveal";
import { Calendar, SlotGrid } from "./calendar";
import {
  ErrorBand,
  Field,
  Ornament,
  StatusChip,
  StepRail,
  SummaryRow,
} from "./parts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function ticketSummary(t: TicketCounts): string {
  const parts: string[] = [];
  if (t.adult > 0)
    parts.push(`${t.adult} Adult${t.adult > 1 ? "s" : ""}`);
  if (t.senior > 0)
    parts.push(`${t.senior} Senior${t.senior > 1 ? "s" : ""}`);
  if (t.under26 > 0) parts.push(`${t.under26} Under 26`);
  if (t.children > 0) parts.push(`${t.children} Under 12`);
  return parts.join(" · ") || "—";
}

/* ================================================================== */
/* Booking modal — 4-step wizard + success + manage view               */
/* ================================================================== */
export function BookingModal() {
  const { open, view, close } = useBookingStore();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [tickets, setTickets] = useState<TicketCounts>({ ...EMPTY_TICKETS });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [avail, setAvail] = useState<DayAvailability | null>(null);
  const [availLoading, setAvailLoading] = useState(false);
  const [availError, setAvailError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingDTO | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);

  /* reset the flow each time it opens for booking */
  useEffect(() => {
    if (open && view === "book") {
      setStep(0);
      setDir(1);
      setDate(null);
      setSlot(null);
      setTickets({ ...EMPTY_TICKETS });
      setName("");
      setEmail("");
      setPhone("");
      setError(null);
      setBooking(null);
      setAvail(null);
      setAvailError(false);
    }
  }, [open, view]);

  /* scroll lock + escape */
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, submitting]);

  /* availability per selected date */
  useEffect(() => {
    if (view !== "book" || !date) {
      setAvail(null);
      return;
    }
    let cancelled = false;
    setAvailLoading(true);
    setAvailError(false);
    fetch(`/api/availability?date=${date}`)
      .then((r) => {
        if (!r.ok) throw new Error("bad status");
        return r.json() as Promise<DayAvailability>;
      })
      .then((data) => {
        if (!cancelled) setAvail(data);
      })
      .catch(() => {
        if (!cancelled) {
          setAvail(null);
          setAvailError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setAvailLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date, refreshKey, view]);

  /* invalidate a selected slot that has since filled up */
  useEffect(() => {
    if (!avail || !slot) return;
    const s = avail.slots.find((x) => x.slot === slot);
    if (!s || s.remaining === 0) setSlot(null);
  }, [avail, slot]);

  const visitors = totalVisitors(tickets);
  const price = totalPrice(tickets);
  const emailOk = EMAIL_RE.test(email.trim());
  const nameOk = name.trim().length >= 2;
  const canContinue =
    (step === 0 && !!date && !!slot && !availLoading) ||
    (step === 1 && visitors >= 1) ||
    (step === 2 && nameOk && emailOk) ||
    step === 3;

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
    setError(null);
  };

  const submit = async () => {
    if (!date || !slot) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, slot, name, email, phone, tickets }),
      });
      const data = (await res.json()) as {
        booking?: BookingDTO;
        error?: string;
        code?: string;
        remaining?: number;
      };
      if (!res.ok || !data.booking) {
        setError(data.error ?? "Something went wrong — please try again.");
        if (data.code === "SLOT_FULL") {
          setRefreshKey((k) => k + 1); // refetch live availability
          if ((data.remaining ?? 0) < visitors) {
            go(0);
          }
        }
        return;
      }
      setBooking(data.booking);
      setDir(1);
      setStep(4);
      panelRef.current?.scrollTo({ top: 0 });
    } catch {
      setError("The reservation desk is unreachable — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const stepKey =
    view === "manage" ? "manage" : step === 4 ? "success" : `step-${step}`;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110]" role="presentation">
          {/* backdrop */}
          <motion.button
            aria-label="Close reservation dialog"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />

          {/* sheet / panel */}
          <div className="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-6">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Museum reservation"
              initial={{ y: 64, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 64, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="relative flex max-h-[93svh] w-full flex-col overflow-hidden rounded-t-2xl border border-ink/15 bg-parchment text-ink shadow-[0_60px_140px_-30px_rgba(19,16,9,0.85)] sm:max-h-[88svh] sm:max-w-xl sm:rounded-none"
            >
              {/* grab handle (mobile) */}
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-ink/20 sm:hidden"
              />

              {/* header */}
              <div className="shrink-0 border-b border-ink/10 px-5 pb-4 pt-6 sm:px-8 sm:pt-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-sans text-[9px] font-bold uppercase tracking-[0.35em] text-terra">
                      {view === "manage" ? "Reservation Desk" : "L'Atelier — Réservation"}
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                      {view === "manage"
                        ? "Find your booking"
                        : step === 4
                          ? "Your visit is reserved"
                          : "Reserve your visit"}
                    </h3>
                  </div>
                  <button
                    onClick={close}
                    aria-label="Close"
                    className="flex h-9 w-9 shrink-0 items-center justify-center border border-ink/15 text-ink/60 transition-colors hover:border-ink/50 hover:text-ink"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {view === "book" && step < 4 && <StepRail step={step} />}
              </div>

              {/* scrollable content */}
              <div
                data-lenis-prevent
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8"
              >
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={stepKey}
                    custom={dir}
                    initial={{ opacity: 0, x: 28 * dir }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -28 * dir }}
                    transition={{ duration: 0.32, ease: EASE }}
                  >
                    {view === "manage" ? (
                      <ManagePanel />
                    ) : step === 0 ? (
                      <StepDate
                        date={date}
                        onSelectDate={(d) => {
                          setDate(d);
                          setSlot(null);
                        }}
                        slot={slot}
                        onSelectSlot={setSlot}
                        avail={avail}
                        availLoading={availLoading}
                        availError={availError}
                        onRetry={() => setRefreshKey((k) => k + 1)}
                      />
                    ) : step === 1 ? (
                      <StepTickets
                        tickets={tickets}
                        setTickets={setTickets}
                      />
                    ) : step === 2 ? (
                      <StepDetails
                        name={name}
                        setName={setName}
                        email={email}
                        setEmail={setEmail}
                        phone={phone}
                        setPhone={setPhone}
                        submitted={!!error}
                      />
                    ) : step === 3 ? (
                      <StepReview
                        date={date}
                        slot={slot}
                        tickets={tickets}
                        name={name}
                        email={email}
                        phone={phone}
                        onEdit={go}
                      />
                    ) : (
                      booking && (
                        <SuccessPanel
                          booking={booking}
                          onDone={close}
                          onAnother={() => {
                            setStep(0);
                            setDir(-1);
                            setDate(null);
                            setSlot(null);
                            setTickets({ ...EMPTY_TICKETS });
                            setBooking(null);
                            setError(null);
                          }}
                        />
                      )
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* footer CTA */}
              {view === "book" && step <= 3 && (
                <div className="shrink-0 border-t border-ink/10 bg-parchment px-5 py-4 sm:px-8">
                  {error && (
                    <div className="mb-3">
                      <ErrorBand>{error}</ErrorBand>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    {step > 0 && (
                      <button
                        onClick={() => go(step - 1)}
                        disabled={submitting}
                        aria-label="Previous step"
                        className="flex h-12 w-12 shrink-0 items-center justify-center border border-ink/20 text-ink/70 transition-colors hover:border-ink/60 hover:text-ink disabled:opacity-40"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => (step === 3 ? submit() : go(step + 1))}
                      disabled={!canContinue || submitting}
                      data-cursor={step === 3 ? "Reserve" : "Next"}
                      className="flex h-12 flex-1 items-center justify-center gap-2.5 bg-ink font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-parchment transition-colors duration-300 hover:bg-terra disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-ink"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Inscribing…
                        </>
                      ) : step === 3 ? (
                        <>Confirm Reservation{price > 0 ? ` · €${price}` : " · Free"}</>
                      ) : step === 2 ? (
                        "Review Reservation"
                      ) : (
                        "Continue"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ================================================================== */
/* Step I — date & hour                                                */
/* ================================================================== */
function StepDate({
  date,
  onSelectDate,
  slot,
  onSelectSlot,
  avail,
  availLoading,
  availError,
  onRetry,
}: {
  date: string | null;
  onSelectDate: (d: string) => void;
  slot: string | null;
  onSelectSlot: (s: string) => void;
  avail: DayAvailability | null;
  availLoading: boolean;
  availError: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-7">
      <div>
        <p className="mb-4 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-ink/50">
          Choose a day
        </p>
        <Calendar selected={date} onSelect={onSelectDate} />
      </div>

      <div>
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-ink/50">
            Choose an entry hour
          </p>
          {date && (
            <span className="font-accent text-sm italic text-ink/50">
              {formatPrettyDate(date)}
            </span>
          )}
        </div>

        {!date ? (
          <div className="border border-dashed border-ink/25 px-4 py-6 text-center">
            <p className="font-display text-base italic text-ink/45">
              Pick a day above — the hours will appear.
            </p>
          </div>
        ) : availError ? (
          <ErrorBand
            action={
              <button
                onClick={onRetry}
                className="shrink-0 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-terra underline underline-offset-4"
              >
                Retry
              </button>
            }
          >
            The availability board could not be reached.
          </ErrorBand>
        ) : (
          <SlotGrid
            avail={avail}
            loading={availLoading}
            selected={slot}
            onSelect={onSelectSlot}
          />
        )}

        <p className="mt-4 font-accent text-sm italic leading-relaxed text-ink/45">
          Entry within your hour — once inside, stay as long as the rooms hold
          you. We hold places for 15 minutes past the hour.
        </p>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Step II — tickets                                                   */
/* ================================================================== */
function StepTickets({
  tickets,
  setTickets,
}: {
  tickets: TicketCounts;
  setTickets: (t: TicketCounts) => void;
}) {
  const total = totalVisitors(tickets);
  const price = totalPrice(tickets);

  const bump = (id: keyof TicketCounts, delta: 1 | -1) => {
    const next = { ...tickets };
    const v = Math.min(MAX_PER_BOOKING, Math.max(0, next[id] + delta));
    // keep total within the group cap
    if (delta === 1 && total >= MAX_PER_BOOKING) return;
    next[id] = v;
    setTickets(next);
  };

  return (
    <div>
      <div className="border border-ink/12">
        {TICKET_TYPES.map((t, i) => (
          <div
            key={t.id}
            className={`flex items-center justify-between gap-4 px-4 py-4 sm:px-5 ${
              i > 0 ? "border-t border-ink/10" : ""
            }`}
          >
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold leading-tight text-ink">
                {t.label}
              </p>
              <p className="mt-0.5 truncate font-sans text-[11px] text-ink/50">
                {t.detail}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span
                className={`w-12 text-right font-display text-base ${
                  t.price === 0 ? "italic text-terra" : "text-ink/80"
                }`}
              >
                {formatEur(t.price)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => bump(t.id, -1)}
                  disabled={tickets[t.id] === 0}
                  aria-label={`Remove one ${t.label} ticket`}
                  className="flex h-9 w-9 items-center justify-center border border-ink/20 text-ink transition-colors hover:border-terra hover:text-terra disabled:opacity-25 disabled:hover:border-ink/20 disabled:hover:text-ink"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span
                  className={`w-5 text-center font-sans text-base font-bold ${
                    tickets[t.id] > 0 ? "text-ink" : "text-ink/25"
                  }`}
                >
                  {tickets[t.id]}
                </span>
                <button
                  onClick={() => bump(t.id, 1)}
                  disabled={total >= MAX_PER_BOOKING}
                  aria-label={`Add one ${t.label} ticket`}
                  className="flex h-9 w-9 items-center justify-center border border-ink/20 text-ink transition-colors hover:border-terra hover:text-terra disabled:opacity-25 disabled:hover:border-ink/20 disabled:hover:text-ink"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-baseline justify-between border-t-2 border-ink/60 pt-4">
        <div>
          <p className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-ink/45">
            {total} visitor{total === 1 ? "" : "s"}
          </p>
          <p className="mt-1 font-sans text-[10px] leading-relaxed text-ink/40">
            Up to {MAX_PER_BOOKING} per reservation — larger groups by phone.
          </p>
        </div>
        <p className="font-display text-2xl font-semibold text-ink">
          {price > 0 ? `€${price}` : <span className="italic text-terra">Free</span>}
        </p>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Step III — details                                                  */
/* ================================================================== */
function StepDetails({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  submitted,
}: {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  submitted: boolean;
}) {
  const nameOk = name.trim().length >= 2;
  const emailOk = EMAIL_RE.test(email.trim());
  return (
    <div className="space-y-6">
      <p className="font-accent text-base italic leading-relaxed text-ink/55">
        The reservation is held under a name — we keep everything else in our
        drawer, never beyond it.
      </p>
      <Field
        label="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Élise Marchand"
        autoComplete="name"
        maxLength={80}
        aria-invalid={submitted && !nameOk}
      />
      <Field
        label="Email"
        type="email"
        inputMode="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        maxLength={120}
        aria-invalid={submitted && !emailOk}
      />
      <Field
        label="Phone"
        optional
        type="tel"
        inputMode="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+33 …"
        autoComplete="tel"
        maxLength={40}
      />
      {submitted && (!nameOk || !emailOk) && (
        <ErrorBand>
          {!nameOk && "A name is needed for the reservation. "}
          {!emailOk && "A valid email lets us reach you about your visit."}
        </ErrorBand>
      )}
    </div>
  );
}

/* ================================================================== */
/* Step IV — review                                                    */
/* ================================================================== */
function StepReview({
  date,
  slot,
  tickets,
  name,
  email,
  phone,
  onEdit,
}: {
  date: string | null;
  slot: string | null;
  tickets: TicketCounts;
  name: string;
  email: string;
  phone: string;
  onEdit: (step: number) => void;
}) {
  const visitors = totalVisitors(tickets);
  const price = totalPrice(tickets);
  return (
    <div>
      <div className="border border-ink/12 px-4 sm:px-5">
        <SummaryRow label="Date" onEdit={() => onEdit(0)}>
          {date ? formatPrettyDate(date) : "—"}
        </SummaryRow>
        <SummaryRow label="Entry" onEdit={() => onEdit(0)}>
          {slot ?? "—"}
          <span className="ml-2 font-sans text-[10px] uppercase tracking-[0.2em] text-ink/40">
            within the hour
          </span>
        </SummaryRow>
        <SummaryRow label="Tickets" onEdit={() => onEdit(1)}>
          {ticketSummary(tickets)}
          <span className="ml-2 font-sans text-[10px] uppercase tracking-[0.2em] text-ink/40">
            {visitors} visitor{visitors === 1 ? "" : "s"}
          </span>
        </SummaryRow>
        <SummaryRow label="Under" onEdit={() => onEdit(2)}>
          {name}
          <span className="ml-2 font-sans text-[10px] tracking-wide text-ink/40">
            {email}
            {phone ? ` · ${phone}` : ""}
          </span>
        </SummaryRow>
        <SummaryRow label="Total">
          {price > 0 ? (
            <span className="text-xl font-semibold">€{price}</span>
          ) : (
            <span className="text-xl italic text-terra">Free</span>
          )}
          <span className="ml-2 font-sans text-[10px] uppercase tracking-[0.2em] text-ink/40">
            pay at the door
          </span>
        </SummaryRow>
      </div>
      <p className="mt-4 font-accent text-sm italic leading-relaxed text-ink/45">
        Cancellation is free at any moment — your spots simply return to the
        room. Keep your reference to find or cancel the visit later.
      </p>
    </div>
  );
}

/* ================================================================== */
/* Success                                                             */
/* ================================================================== */
function SuccessPanel({
  booking,
  onDone,
  onAnother,
}: {
  booking: BookingDTO;
  onDone: () => void;
  onAnother: () => void;
}) {
  return (
    <div className="pb-2 pt-2 text-center">
      <Ornament />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-terra text-terra"
      >
        <Check className="h-6 w-6" />
      </motion.div>

      <h4 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink">
        {booking.name.split(" ")[0]}, the doors are yours.
      </h4>
      <p className="mx-auto mt-3 max-w-sm font-sans text-sm leading-relaxed text-ink/60">
        {formatPrettyDate(booking.date)} at {booking.slot} — {booking.visitors}{" "}
        visitor{booking.visitors === 1 ? "" : "s"}. Present this reference at
        the entrance; we hold places for 15 minutes past the hour.
      </p>

      <div className="mx-auto mt-6 max-w-xs border border-dashed border-ink/35 bg-ink/[0.03] px-6 py-4">
        <p className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-ink/45">
          Booking reference
        </p>
        <p className="mt-1.5 select-all font-display text-3xl font-bold tracking-[0.18em] text-ink">
          {booking.reference}
        </p>
      </div>

      <div className="mx-auto mt-5 max-w-xs text-left">
        <SummaryRow label="Total">{booking.total > 0 ? `€${booking.total} — pay at the door` : "Free entry"}</SummaryRow>
        <SummaryRow label="Manage">Quote reference {booking.reference} any time below.</SummaryRow>
      </div>

      <div className="mt-7 flex flex-col gap-3">
        <button
          onClick={onDone}
          data-cursor="Done"
          className="h-12 bg-ink font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-parchment transition-colors duration-300 hover:bg-terra"
        >
          Done
        </button>
        <button
          onClick={onAnother}
          className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-terra underline decoration-terra/40 underline-offset-4 transition-colors hover:text-terra-deep"
        >
          Reserve another visit
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Manage — lookup + cancel                                            */
/* ================================================================== */
function ManagePanel() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState<BookingDTO | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const ref = reference.trim().toUpperCase();

  const lookup = async () => {
    if (!/^ATL-[A-Z2-9]{6}$/.test(ref) || !email.trim()) {
      setError("Enter your reference (ATL-XXXXXX) and the email you booked with.");
      return;
    }
    setLoading(true);
    setError(null);
    setFound(null);
    setConfirming(false);
    try {
      const res = await fetch(
        `/api/bookings/${encodeURIComponent(ref)}?email=${encodeURIComponent(email.trim())}`
      );
      const data = (await res.json()) as { booking?: BookingDTO; error?: string };
      if (!res.ok || !data.booking) {
        setError(data.error ?? "No reservation found for that reference and email.");
        return;
      }
      setFound(data.booking);
    } catch {
      setError("The reservation desk is unreachable — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    if (!found) return;
    setCancelling(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/bookings/${encodeURIComponent(found.reference)}?email=${encodeURIComponent(email.trim())}`,
        { method: "DELETE" }
      );
      const data = (await res.json()) as { booking?: BookingDTO; error?: string };
      if (!res.ok || !data.booking) {
        setError(data.error ?? "Could not cancel — please try again.");
        return;
      }
      setFound(data.booking);
      setConfirming(false);
    } catch {
      setError("The reservation desk is unreachable — please try again.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="font-accent text-base italic leading-relaxed text-ink/55">
        Kept your reference? Your visit is exactly where you left it — find,
        admire, or let it go.
      </p>

      <div className="space-y-5">
        <Field
          label="Booking reference"
          value={reference}
          onChange={(e) => setReference(e.target.value.toUpperCase())}
          placeholder="ATL-XXXXXX"
          maxLength={10}
          spellCheck={false}
          className="tracking-[0.2em]"
        />
        <Field
          label="Email"
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          maxLength={120}
        />
        <button
          onClick={lookup}
          disabled={loading}
          data-cursor="Find"
          className="flex h-12 w-full items-center justify-center gap-2.5 bg-ink font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-parchment transition-colors duration-300 hover:bg-terra disabled:opacity-40"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Searching the ledger…
            </>
          ) : (
            "Find my booking"
          )}
        </button>
      </div>

      {error && <ErrorBand>{error}</ErrorBand>}

      {found && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="border border-ink/15 bg-ink/[0.03] px-4 py-5 sm:px-5"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-xl font-bold tracking-[0.12em]">
              {found.reference}
            </p>
            <StatusChip status={found.status} />
          </div>

          <div className="mt-2">
            <SummaryRow label="Visit">
              {formatPrettyDate(found.date)} · {found.slot}
            </SummaryRow>
            <SummaryRow label="Party">
              {ticketSummary(found.tickets)} — {found.visitors} visitor
              {found.visitors === 1 ? "" : "s"}
            </SummaryRow>
            <SummaryRow label="Total">
              {found.total > 0 ? `€${found.total} — pay at the door` : "Free entry"}
            </SummaryRow>
          </div>

          {found.status === "CONFIRMED" ? (
            confirming ? (
              <div className="mt-4 border-l-2 border-terra bg-terra/10 px-4 py-3">
                <p className="font-sans text-[13px] text-terra-deep">
                  Release your {found.visitors} place
                  {found.visitors === 1 ? "" : "s"} back to the room?
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={cancel}
                    disabled={cancelling}
                    className="h-10 flex-1 bg-terra-deep font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-parchment transition-colors hover:bg-terra disabled:opacity-50"
                  >
                    {cancelling ? "Cancelling…" : "Yes, cancel visit"}
                  </button>
                  <button
                    onClick={() => setConfirming(false)}
                    className="h-10 flex-1 border border-ink/25 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70 transition-colors hover:border-ink/60"
                  >
                    Keep it
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="mt-4 font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-terra underline decoration-terra/40 underline-offset-4 transition-colors hover:text-terra-deep"
              >
                Cancel this visit
              </button>
            )
          ) : (
            <p className="mt-4 font-accent text-base italic text-ink/50">
              This visit was cancelled — the doors await another day.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
