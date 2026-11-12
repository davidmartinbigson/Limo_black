'use client';
import { useEffect, useRef, useState } from 'react';
export default function DriverTracking({ reference, status }: { reference: string; status: string }) {
  const [sharing, setSharing] = useState(false), [message, setMessage] = useState(''), [busy, setBusy] = useState(false);
  const state = useRef<{ id: string; watch: number | null; timer: ReturnType<typeof setInterval> | null; stopped: boolean; last: number; pending: boolean } | null>(null);
  const stop = () => {
    const s = state.current; if (!s) return;
    s.stopped = true; if (s.watch !== null) navigator.geolocation.clearWatch(s.watch); if (s.timer !== null) clearInterval(s.timer);
    state.current = null; setSharing(false); setBusy(false);
    void fetch('/api/tracking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'stop', reference, sessionId: s.id }), keepalive: true }).catch(() => {});
  };
  useEffect(() => () => { const s = state.current; if (s) { s.stopped = true; if (s.watch !== null) navigator.geolocation.clearWatch(s.watch); if (s.timer !== null) clearInterval(s.timer); void fetch('/api/tracking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'stop', reference, sessionId: s.id }), keepalive: true }).catch(() => {}); } }, [reference]);
  const start = () => {
    if (!navigator.geolocation) { setMessage('Location is not supported on this device.'); return; }
    setMessage('Requesting GPS permission…'); setBusy(true);
    const s = { id: crypto.randomUUID(), watch: null as number | null, timer: null as ReturnType<typeof setInterval> | null, stopped: false, last: 0, pending: false }; state.current = s;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      if (s.stopped) return;
      try {
        const send = (action: string, p: GeolocationPosition) => fetch('/api/tracking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, reference, sessionId: s.id, latitude: p.coords.latitude, longitude: p.coords.longitude, accuracy: p.coords.accuracy }) });
        const r = await send('start', pos); if (!r.ok) throw new Error('Unable to start tracking. Check your assigned ride and try again.');
        if (s.stopped) { void fetch('/api/tracking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'stop', reference, sessionId: s.id }), keepalive: true }); return; }
        setSharing(true); setBusy(false); setMessage('Sharing with the customer and owner. Keep this page open; background updates may stop.'); s.last = Date.now();
        const update = () => navigator.geolocation.getCurrentPosition(async p => { if (s.stopped || s.pending) return; s.pending = true; try { const response = await send('update', p); if (!response.ok) { stop(); setMessage('Tracking stopped. Refresh the ride and start again.'); } else setMessage('Sharing with the customer and owner. Keep this page open; background updates may stop.'); } catch { setMessage('Location update failed; retrying.'); } finally { s.pending = false; } }, () => { setMessage('GPS unavailable. Location may become stale; check your permission and connection.'); }, { enableHighAccuracy: true, maximumAge: 0, timeout: 12000 });
        s.timer = setInterval(update, 15000);
      } catch (e) { stop(); setMessage(e instanceof Error ? e.message : 'Unable to start tracking.'); }
    }, () => { stop(); setMessage('GPS permission denied or unavailable. Please enable location and try again.'); }, { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 });
  };
  if (!['Chauffeur Assigned', 'Chauffeur En Route', 'Chauffeur Arrived'].includes(status)) return null;
  return <div className="mt-4 border-t border-white/15 pt-4"><p className="mb-2 text-xs text-white/65">Share your GPS location with this ride’s customer and the owner only while tracking is active.</p><button disabled={busy} onClick={sharing ? stop : start} className="rounded-lg border border-[#e7b84b] px-4 py-2 text-sm text-[#e7b84b] disabled:opacity-50">{busy ? 'Starting…' : sharing ? 'Stop sharing' : 'Start ride tracking'}</button>{message && <p className="mt-2 text-xs text-white/70" role="status">{message}</p>}</div>;
}
