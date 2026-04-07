/* ═══════════════════════════════════════════════════════════
   MOUTHBREATHER — app.js
   tiny vanilla module: boot, timecode, glitch, reel mute
   ─────────────────────────────────────────────────────────── */
(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);

  /* ── boot: skip on click/keydown ─────────────────────── */
  const boot = $('#boot');
  if (boot) {
    const skip = () => boot.classList.add('skipped');
    boot.addEventListener('click', skip, { once: true });
    addEventListener('keydown', skip, { once: true });
    setTimeout(() => boot.remove(), 1400);
  }

  /* ── footer year ─────────────────────────────────────── */
  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── live VHS timecode ───────────────────────────────── */
  const tc = $('#timecode');
  if (tc) {
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      const d = new Date();
      const f = Math.floor((d.getMilliseconds() / 1000) * 24); // fake 24fps frame
      tc.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}:${pad(f)}`;
    };
    tick();
    if (!reduced) setInterval(tick, 1000 / 12);
    else setInterval(tick, 1000);
  }

  /* ── random logo glitch bursts ───────────────────────── */
  const logo = $('.logo');
  if (logo && !reduced) {
    const fire = () => {
      logo.classList.add('glitch');
      setTimeout(() => logo.classList.remove('glitch'), 550);
      setTimeout(fire, 2200 + Math.random() * 5400);
    };
    setTimeout(fire, 1800);
  }

  /* ── reel mute toggle ────────────────────────────────── */
  const reel = $('#reel');
  const muteBtn = $('#reelMute');
  if (reel && muteBtn) {
    const sync = () => {
      muteBtn.setAttribute('aria-pressed', reel.muted ? 'true' : 'false');
      muteBtn.setAttribute('aria-label', reel.muted ? 'Unmute reel' : 'Mute reel');
    };
    const toggle = () => {
      reel.muted = !reel.muted;
      if (!reel.muted && reel.paused) reel.play().catch(() => {});
      sync();
    };
    muteBtn.addEventListener('click', toggle);
    reel.addEventListener('click', toggle);
    sync();
  }
})();
