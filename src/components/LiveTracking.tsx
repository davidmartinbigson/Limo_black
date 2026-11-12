'use client';
import { useEffect, useState } from 'react';
type Location = { latitude: number; longitude: number; accuracy: number; updatedAt: string };
export default function LiveTracking({ reference }: { reference: string }) {
  const [open, setOpen] = useState(false), [location, setLocation] = useState<Location | null>(null), [error, setError] = useState(''), [map, setMap] = useState(false);
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const load = async () => { try { const r = await fetch(`/api/tracking?reference=${encodeURIComponent(reference)}`, { cache: 'no-store' }); if (!r.ok) throw new Error('Tracking is temporarily unavailable.'); const data = await r.json(); if (!cancelled) { setLocation(data.location); setError(''); } } catch { if (!cancelled) { setLocation(null); setError('Tracking is temporarily unavailable.'); } } };
    void load(); const timer = setInterval(load, 15000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [open, reference]);
  const lat = location && Number(location.latitude), lng = location && Number(location.longitude);
  const mapUrl = location && `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(`${Number(lng) - 0.01},${Number(lat) - 0.006},${Number(lng) + 0.01},${Number(lat) + 0.006}`)}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lng}`)}`;
  return <div className="mt-4 rounded-xl border border-white/20 bg-[#111214] p-4 text-white"><button type="button" onClick={() => { setOpen(!open); setMap(false); }} className="font-semibold text-[#edc451]">{open ? 'Hide live tracking' : 'Live tracking'}</button>{open && <div className="mt-3 text-sm text-white/75" aria-live="polite">{error ? <p>{error}</p> : !location ? <p>No live location currently available. The assigned driver must start sharing. Updates may pause if their browser is closed or backgrounded.</p> : <><p>Latest location: {new Date(location.updatedAt).toLocaleString()} · GPS accuracy approximately {Math.round(Number(location.accuracy))} m</p><p className="mt-2 text-xs">Opening the map shares the location with OpenStreetMap. Map updates when a new location arrives.</p>{!map ? <button onClick={() => setMap(true)} className="mt-3 rounded-lg border border-[#d8ad3b] px-4 py-2 text-[#edc451]">Show map</button> : <iframe title="Driver's latest location on OpenStreetMap" src={mapUrl || undefined} className="mt-3 h-64 w-full rounded-lg border border-white/20" loading="lazy" referrerPolicy="no-referrer" />}</>}</div>}</div>;
}
