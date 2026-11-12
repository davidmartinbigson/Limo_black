"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Clock3, X } from "lucide-react";

type TimeParts = { hour: number; minute: number; period: "AM" | "PM" };
function parseTime(value: string): TimeParts {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  const hour24 = match && Number(match[1]) < 24 ? Number(match[1]) : 0;
  const minute = match && Number(match[2]) < 60 ? Number(match[2]) : 0;
  return { hour: hour24 % 12 || 12, minute, period: hour24 >= 12 ? "PM" : "AM" };
}
function formatTime({ hour, minute, period }: TimeParts) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}
function timeValue({ hour, minute, period }: TimeParts) {
  return `${String(hour % 12 + (period === "PM" ? 12 : 0)).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export default function BookingTimePicker({ value, onChange }: { value: string; onChange: (time: string) => void }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<TimeParts>(() => parseTime(value));
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const minuteList = useRef<HTMLDivElement>(null);
  const close = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => trigger.current?.focus());
  };

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    if (minuteList.current) minuteList.current.scrollTop = Math.max(0, Math.floor(pending.minute / 4) * 36 - 36);
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) close(); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); close(true); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
    // Initialize the scroll position only when opening, not on each selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const choice = "flex h-8 items-center justify-center rounded-lg border border-transparent text-xs font-semibold text-white/75 transition-colors hover:bg-white/10 peer-checked:border-[#E6C575] peer-checked:bg-[#D4AF61] peer-checked:text-[#0B0B0D] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-[#E6C575]";
  return <div ref={root} className="relative">
    <span id={`${id}-label`} className="mb-1.5 block text-xs font-medium text-white/90">Time</span>
    <button ref={trigger} type="button" aria-labelledby={`${id}-label ${id}-value`} aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => { if (!open) setPending(parseTime(value)); setOpen(!open); }} className={`flex min-h-[47px] w-full items-center gap-2 rounded-xl border bg-[#1E1F24] px-3.5 py-3 text-left text-xs text-white transition-colors hover:border-[#D4AF61] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF61] sm:text-sm ${open ? "border-[#D4AF61]" : "border-white/20"}`}>
      <Clock3 className="h-4 w-4 shrink-0 text-[#D4AF61]" /><span id={`${id}-value`} className="flex-1 whitespace-nowrap">{value ? formatTime(parseTime(value)) : "Select time"}</span><ChevronDown className={`h-4 w-4 shrink-0 text-white/55 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
    {open && <div id={`${id}-panel`} role="dialog" aria-label="Choose pickup time" className="absolute right-0 top-full z-50 mt-2 w-[min(19.5rem,calc(100vw-3rem))] rounded-2xl border border-[#D4AF61]/30 bg-[#151619] p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
      <div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF61]">Select pickup time</p><button ref={closeButton} type="button" onClick={() => close(true)} aria-label="Close time picker" className="rounded-md p-1 text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF61]"><X className="h-4 w-4" /></button></div>
      <p className="mt-2 text-center text-2xl font-semibold tracking-wide text-[#F0D388]" aria-live="polite">{formatTime(pending)}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <fieldset className="min-w-0"><legend className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/50">Hour</legend><div className="grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-black/20 p-1">{Array.from({ length: 12 }, (_, i) => i + 1).map(hour => <label key={hour} className="cursor-pointer"><input className="peer sr-only" type="radio" name={`${id}-hour`} checked={pending.hour === hour} onChange={() => setPending(p => ({ ...p, hour }))} /><span className={choice}>{String(hour).padStart(2, "0")}</span></label>)}</div></fieldset>
        <fieldset className="min-w-0"><legend className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/50">Minute <span className="normal-case tracking-normal">· scroll</span></legend><div ref={minuteList} className="grid h-[148px] grid-cols-4 gap-1 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-1">{Array.from({ length: 60 }, (_, minute) => <label key={minute} className="cursor-pointer"><input className="peer sr-only" type="radio" name={`${id}-minute`} checked={pending.minute === minute} onChange={() => setPending(p => ({ ...p, minute }))} /><span className={choice}>{String(minute).padStart(2, "0")}</span></label>)}</div></fieldset>
      </div>
      <fieldset className="mt-3"><legend className="sr-only">AM or PM</legend><div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/20 p-1">{(["AM", "PM"] as const).map(period => <label key={period} className="cursor-pointer"><input className="peer sr-only" type="radio" name={`${id}-period`} checked={pending.period === period} onChange={() => setPending(p => ({ ...p, period }))} /><span className={choice}>{period}</span></label>)}</div></fieldset>
      <button type="button" onClick={() => { onChange(timeValue(pending)); close(true); }} className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#E2C275] to-[#B88F3B] px-4 py-3 text-sm font-bold text-[#0B0B0D] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6C575]">Confirm time</button>
    </div>}
  </div>;
}
