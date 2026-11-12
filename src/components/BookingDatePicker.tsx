"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

function parseDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.getFullYear() === Number(match[1]) && date.getMonth() === Number(match[2]) - 1 && date.getDate() === Number(match[3]) ? date : undefined;
}
function dateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function BookingDatePicker({ value, onChange }: { value: string; onChange: (date: string) => void }) {
  const selected = parseDate(value);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(() => selected || new Date());
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = (focus = false) => { setOpen(false); if (focus) requestAnimationFrame(() => trigger.current?.focus()); };

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) close(); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); close(true); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);

  const formatted = selected?.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
  return <div className="relative" ref={root}>
    <span id="pickup-date-label" className="mb-1.5 block text-xs font-medium text-white/90">Date</span>
    <button ref={trigger} type="button" aria-labelledby="pickup-date-label pickup-date-value" aria-expanded={open} aria-controls="booking-date-calendar" onClick={() => { if (!open) setMonth(selected || new Date()); setOpen(!open); }} className={`flex min-h-[47px] w-full items-center gap-2 rounded-xl border bg-[#1E1F24] px-3.5 py-3 text-left text-xs text-white transition-colors hover:border-[#D4AF61] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF61] sm:text-sm ${open ? "border-[#D4AF61]" : "border-white/20"}`}>
      <CalendarDays className="h-4 w-4 shrink-0 text-[#D4AF61]" /><span id="pickup-date-value" className="flex-1 whitespace-nowrap">{formatted || "Select date"}</span><ChevronDown className={`h-4 w-4 shrink-0 text-white/55 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
    {open && <div id="booking-date-calendar" role="dialog" aria-label="Choose pickup date" className="booking-calendar absolute right-0 top-full z-50 mt-2 w-[min(19.5rem,calc(100vw-3rem))] rounded-2xl border border-[#D4AF61]/30 bg-[#151619] p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
      <div className="mb-1 flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF61]">Select pickup date</p><button type="button" onClick={() => close(true)} aria-label="Close date picker" className="rounded-md px-2 py-1 text-lg leading-none text-white/60 hover:bg-white/10 hover:text-white">×</button></div>
      <DayPicker mode="single" selected={selected} month={month} onMonthChange={setMonth} onSelect={(date) => { if (date) { onChange(dateValue(date)); close(true); } }} autoFocus showOutsideDays fixedWeeks navLayout="after" />
      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3 text-xs"><span className="text-white/50">Your local time</span><button type="button" onClick={() => { onChange(dateValue(new Date())); close(true); }} className="rounded-md px-2 py-1 font-semibold text-[#e6c575] hover:bg-white/10">Today</button></div>
    </div>}
  </div>;
}
