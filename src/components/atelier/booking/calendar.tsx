"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MoonStar } from "lucide-react";
import {
  MAX_MONTHS_AHEAD,
  isNocturne,
  monthLabel,
  parseISODate,
  toISODate,
  todayStr,
  type DayAvailability,
} from "@/lib/museum";

/* ------------------------------------------------------------------ */
/* Monday-first month grid of "YYYY-MM-DD" strings (null = filler)     */
/* ------------------------------------------------------------------ */
function monthGrid(year: number, month: number): (string | null)[] {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(toISODate(new Date(year, month, d)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const WEEKDAY_HEADS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/* ------------------------------------------------------------------ */
export function Calendar({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (d: string) => void;
}) {
  const today = todayStr();
  const maxDate = useMemo(() => {
    const t = parseISODate(today)!;
    const x = new Date(t);
    x.setMonth(x.getMonth() + MAX_MONTHS_AHEAD);
    return toISODate(x);
  }, [today]);

  const [view, setView] = useState(() => {
    const t = parseISODate(today)!;
    return { y: t.getFullYear(), m: t.getMonth() };
  });

  const t = parseISODate(today)!;
  const maxD = parseISODate(maxDate)!;
  const canPrev = view.y * 12 + view.m > t.getFullYear() * 12 + t.getMonth();
  const canNext = view.y * 12 + view.m < maxD.getFullYear() * 12 + maxD.getMonth();

  const cells = useMemo(() => monthGrid(view.y, view.m), [view]);

  return (
    <div>
      {/* month nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 }))
          }
          disabled={!canPrev}
          aria-label="Previous month"
          className="flex h-9 w-9 items-center justify-center border border-ink/15 text-ink/70 transition-colors hover:border-ink/50 disabled:opacity-25"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-display text-lg font-semibold tracking-tight text-ink">
          {monthLabel(view.y, view.m)}
        </p>
        <button
          onClick={() =>
            setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 }))
          }
          disabled={!canNext}
          aria-label="Next month"
          className="flex h-9 w-9 items-center justify-center border border-ink/15 text-ink/70 transition-colors hover:border-ink/50 disabled:opacity-25"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* weekday heads */}
      <div className="mt-4 grid grid-cols-7 gap-1" aria-hidden="true">
        {WEEKDAY_HEADS.map((w) => (
          <span
            key={w}
            className="pb-1 text-center font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-ink/40"
          >
            {w}
          </span>
        ))}
      </div>

      {/* day grid */}
      <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Choose a date">
        {cells.map((d, i) => {
          if (!d) return <span key={`x${i}`} />;
          const past = d < today;
          const beyond = d > maxDate;
          const disabled = past || beyond;
          const isMonday = new Date(d + "T00:00:00").getDay() === 1;
          if (isMonday) {
            return (
              <span
                key={d}
                aria-label={`${d} — museum closed`}
                className="flex h-10 items-center justify-center font-sans text-sm text-ink/20"
              >
                {Number(d.slice(-2))}
              </span>
            );
          }
          const isSel = d === selected;
          const isToday = d === today;
          const noct = isNocturne(d);
          return (
            <button
              key={d}
              onClick={() => onSelect(d)}
              disabled={disabled}
              aria-pressed={isSel}
              aria-label={d}
              className={`relative flex h-10 items-center justify-center border font-sans text-sm transition-all duration-200 ${
                isSel
                  ? "border-ink bg-ink font-bold text-parchment"
                  : disabled
                    ? "border-transparent text-ink/20"
                    : "border-transparent text-ink hover:border-ink/30"
              }`}
            >
              {Number(d.slice(-2))}
              {isToday && !isSel && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-terra" />
              )}
              {noct && !isSel && !isToday && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-gold" />
              )}
            </button>
          );
        })}
      </div>

      {/* legend */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/10 pt-3">
        <span className="flex items-center gap-2 font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-ink/45">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Nocturne Thursday
        </span>
        <span className="flex items-center gap-2 font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-ink/45">
          <span className="h-1.5 w-1.5 rounded-full bg-terra" /> Today
        </span>
        <span className="font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-ink/30">
          Closed Mondays
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function SlotGrid({
  avail,
  loading,
  selected,
  onSelect,
}: {
  avail: DayAvailability | null;
  loading: boolean;
  selected: string | null;
  onSelect: (s: string) => void;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse border border-ink/10 bg-ink/[0.04]"
          />
        ))}
      </div>
    );
  }

  if (!avail || !avail.open || avail.slots.length === 0) {
    return (
      <div className="border border-dashed border-ink/25 px-4 py-6 text-center">
        <p className="font-display text-base italic text-ink/50">
          The museum keeps its doors closed on this day.
        </p>
        <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.25em] text-ink/35">
          We are open Tuesday — Sunday
        </p>
      </div>
    );
  }

  const day = avail.slots.filter((s) => s.slot < "18:00");
  const evening = avail.slots.filter((s) => s.slot >= "18:00");

  const chip = (s: DayAvailability["slots"][number]) => {
    const isSel = selected === s.slot;
    const full = s.remaining === 0;
    return (
      <button
        key={s.slot}
        onClick={() => onSelect(s.slot)}
        disabled={full}
        aria-pressed={isSel}
        className={`flex flex-col items-center justify-center border py-2.5 transition-all duration-200 ${
          isSel
            ? "border-terra bg-terra text-parchment"
            : full
              ? "border-ink/10 text-ink/25"
              : "border-ink/20 text-ink hover:border-ink/60"
        }`}
      >
        <span className="font-display text-base leading-none">{s.slot}</span>
        <span
          className={`mt-1.5 font-sans text-[8.5px] font-bold uppercase tracking-[0.14em] ${
            isSel
              ? "text-parchment/85"
              : full
                ? "text-ink/25"
                : s.remaining <= 3
                  ? "text-terra"
                  : "text-ink/40"
          }`}
        >
          {full ? "Full" : s.remaining <= 3 ? `${s.remaining} left` : `${s.remaining} spots`}
        </span>
      </button>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{day.map(chip)}</div>
      {evening.length > 0 && (
        <>
          <div className="mt-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-ink/10" />
            <span className="flex items-center gap-2 font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-gold-soft">
              <MoonStar className="h-3.5 w-3.5 text-gold" />
              Nocturne — open until 22:00
            </span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {evening.map(chip)}
          </div>
        </>
      )}
    </div>
  );
}
