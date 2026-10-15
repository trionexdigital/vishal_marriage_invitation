import { invitation as config } from './config.js';
import { countdown, indiaDate, dateLabel, calendarFile, shareData } from './domain.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let opened = false;
let toastTimeout;

function announce(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 4300);
}

function hydrate() {
  $$('[data-groom]').forEach(node => node.textContent = config.groom);
  $$('[data-bride]').forEach(node => node.textContent = config.bride);
  $('[data-blessing]').textContent = config.blessing;
  document.title = `${config.groom} & ${config.bride} · ${dateLabel(config.weddingDate)}`;
  $$('[data-wedding-date]').forEach(node => node.textContent = dateLabel(config.weddingDate).toUpperCase());
  const date = new Date(`${config.weddingDate}T12:00:00+05:30`);
  const day = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit' }).format(date);
  const month = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', month: 'long', year: 'numeric' }).format(date);
  const weekday = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'long' }).format(date);
  $('.hero-date-number').textContent = day;
  $('.hero-date .eyebrow:first-child').textContent = weekday;
  $('.hero-date .eyebrow:last-child').innerText = month.replace(' ', '\n');
  $('.revealed-date strong').textContent = day;
  $('[data-date-month]').textContent = month;
  $('[data-date-weekday]').textContent = `${weekday} · SHUBH VIVAH`;
  $('[data-venue-name]').textContent = config.venue.name;
  $('[data-venue-address]').textContent = config.venue.address;
  $('[data-map-link]').href = config.venue.mapUrl;
  $('#venue-illustration').src = config.venue.illustration;
  $$('.garland').forEach(node => node.src = config.media.garland);
  $('.hero-floral').src = config.media.floral;
  $('.dancing-couple').src = config.media.dance;
  const video = $('#door-video');
  video.poster = config.media.introFallback;
  if (video.querySelector('source').getAttribute('src') !== config.media.intro) {
    video.querySelector('source').src = config.media.intro;
    video.load();
  }
  for (const event of config.events) {
    const article = $(`[data-event="${event.id}"]`);
    if (!article) continue;
    for (const [field, value] of [['title', event.title], ['hindi', event.hindi], ['time', event.time], ['description', event.description], ['location', event.location]]) {
      const node = article.querySelector(`[data-event-${field}]`);
      node.textContent = value;
      node.hidden = !value;
    }
    $$(`[data-event-day="${event.id}"]`).forEach(node => { node.textContent = dateLabel(event.date); node.dateTime = event.date; });
  }
  $('.event-haldi img').src = config.media.haldi;
  $('.closing-arch img').src = config.media.closing;
  $$('.venue-photo-open img').forEach((node, i) => node.src = config.venue.photos[i]);
  if (config.publicUrl) {
    const canonical = document.createElement('link');
    canonical.rel = 'canonical'; canonical.href = config.publicUrl; document.head.append(canonical);
    const ogUrl = document.createElement('meta'); ogUrl.setAttribute('property', 'og:url'); ogUrl.content = config.publicUrl; document.head.append(ogUrl);
    $('meta[property="og:image"]').content = new URL('assets/web/social-preview.jpg', config.publicUrl).href;
  }
}

// A quiet, original pentatonic arrangement: soft plucked notes over sustained chords.
// All sound is synthesized locally. No song, stream, or third-party audio request is used.
class InvitationMusic {
  constructor() {
    this.context = null; this.timer = null; this.wanted = true; this.nextTime = 0; this.beat = 0;
    try { this.wanted = localStorage.getItem('vv-music') !== 'off'; } catch { /* Private browsing. */ }
    this.button = $('#music-toggle');
    this.button.hidden = false;
    this.button.addEventListener('click', () => {
      this.wanted = !(this.context?.state === 'running' && this.timer);
      try { localStorage.setItem('vv-music', this.wanted ? 'on' : 'off'); } catch { /* No storage. */ }
      if (this.wanted) this.start(); else this.pause();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.pause();
      else if (opened && this.wanted) this.start();
    });
    this.update(false);
  }
  update(playing) {
    this.button.setAttribute('aria-pressed', String(playing));
    this.button.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
    $('#music-label').textContent = playing ? 'Music on' : 'Music off';
  }
  async start() {
    if (!this.wanted || document.hidden) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) { this.button.hidden = true; return; }
      if (!this.context) {
        this.context = new Audio();
        this.master = this.context.createGain();
        this.master.gain.value = .13;
        const lowpass = this.context.createBiquadFilter();
        lowpass.type = 'lowpass'; lowpass.frequency.value = 1700;
        this.master.connect(lowpass); lowpass.connect(this.context.destination);
      }
      await this.context.resume();
      if (!this.wanted || document.hidden) { await this.context.suspend(); return; }
      if (!this.timer) {
        this.nextTime = this.context.currentTime + .12;
        this.timer = setInterval(() => this.schedule(), 100);
        this.schedule();
      }
      this.update(this.context.state === 'running');
    } catch { this.update(false); announce('Music is available from the music button when your browser allows it.'); }
  }
  pause() {
    clearInterval(this.timer); this.timer = null;
    if (this.context?.state === 'running') this.context.suspend().catch(() => {});
    this.update(false);
  }
  tone(midi, time, duration, volume, type = 'sine') {
    const oscillator = this.context.createOscillator(), gain = this.context.createGain();
    oscillator.type = type; oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + .035);
    gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
    oscillator.connect(gain); gain.connect(this.master);
    oscillator.start(time); oscillator.stop(time + duration + .05);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  schedule() {
    const melody = [74, null, 77, 79, 81, null, 79, 77, 74, null, 72, 69, 72, null, 74, null, 77, 79, 81, null, 84, 81, 79, null, 77, 74, 72, null, 69, 72, 74, null];
    const chords = [[50,57,62], [48,55,60], [46,53,58], [48,55,60]];
    while (this.nextTime < this.context.currentTime + .35) {
      const note = melody[this.beat % melody.length];
      if (note) this.tone(note, this.nextTime, 2.1, .23);
      if (this.beat % 8 === 0) for (const midi of chords[Math.floor(this.beat / 8) % 4]) this.tone(midi, this.nextTime, 5.2, .12);
      this.beat++; this.nextTime += .67;
    }
  }
}

const music = new InvitationMusic();

function initEntrance() {
  const entrance = $('#entrance'), video = $('#door-video'), open = $('#open-invitation');
  let finishing = false, playbackTimeout;
  const finish = async (instant = false) => {
    if (finishing) return;
    finishing = true; opened = true;
    clearTimeout(playbackTimeout); video.pause();
    if (!instant && !reducedMotion.matches) {
      entrance.classList.add('fading');
      await new Promise(resolve => setTimeout(resolve, 650));
    }
    if (entrance.open) entrance.close();
    document.body.classList.remove('intro-active');
    try { sessionStorage.setItem('vv-opened', 'yes'); } catch { /* No storage. */ }
    $('.hero h1').setAttribute('tabindex', '-1');
    $('.hero h1').focus({ preventScroll: true });
    if (!location.hash) window.scrollTo({ top: 0, behavior: 'instant' });
  };
  let seen = false;
  try { seen = sessionStorage.getItem('vv-opened') === 'yes'; } catch { /* No storage. */ }
  // A reload or section deep link should never trap a returning guest behind the doors.
  if (seen || location.hash || typeof entrance.showModal !== 'function') { opened = true; return; }
  entrance.showModal(); document.body.classList.add('intro-active');
  $('#entrance-title').setAttribute('tabindex', '-1');
  $('#entrance-title').focus({ preventScroll: true });
  // Once data arrives, the paused video shows its actual first frame, replacing the fallback poster.
  const showFirstFrame = () => { if (!entrance.classList.contains('playing')) video.currentTime = .01; };
  video.addEventListener('loadeddata', showFirstFrame, { once: true });
  if (video.readyState >= 2) showFirstFrame();
  open.addEventListener('click', async () => {
    if (finishing || entrance.classList.contains('playing')) return;
    music.start();
    if (reducedMotion.matches) { finish(true); return; }
    entrance.classList.add('playing');
    open.disabled = true;
    // Start the guard before play(): browsers may leave its promise pending while buffering.
    playbackTimeout = setTimeout(() => finish(), 13000);
    try {
      if (video.error) { finish(true); return; }
      video.currentTime = 0;
      await video.play();
      if (finishing) video.pause();
    } catch { finish(true); }
  });
  $('#skip-intro').addEventListener('click', () => { music.start(); finish(true); });
  video.addEventListener('ended', () => finish());
  video.addEventListener('error', () => finish(true));
  video.querySelector('source').addEventListener('error', () => finish(true));
  entrance.addEventListener('cancel', event => { event.preventDefault(); finish(true); });
}

function initScratch() {
  const canvas = $('#scratch-canvas'), frame = $('#date-frame'), hint = $('#scratch-hint'), button = $('#reveal-date');
  const context = canvas.getContext('2d');
  if (!context) return;
  let revealed = false, drawing = false, previous = null, width = 1, height = 1;
  let paths = [], activePath = [];
  const coverage = new Set(), columns = 32, rows = 22;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    frame.classList.add('revealed'); hint.hidden = true;
    const weekday = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'long' }).format(new Date(`${config.weddingDate}T12:00:00+05:30`));
    button.textContent = `${weekday}, ${dateLabel(config.weddingDate)} · Our forever begins`;
    button.disabled = true;
    $('#scratch-instruction').textContent = 'We can’t wait to celebrate with you.';
    try { sessionStorage.setItem('vv-date-revealed', config.weddingDate); } catch { /* No storage. */ }
    announce(`Our wedding date: ${dateLabel(config.weddingDate)}.`);
  };
  const brush = (x, y, px, py) => {
    context.save(); context.globalCompositeOperation = 'destination-out';
    context.lineWidth = 44; context.lineCap = 'round';
    context.beginPath(); context.moveTo(px, py); context.lineTo(x, y); context.stroke(); context.restore();
  };
  const paint = () => {
    width = canvas.clientWidth; height = canvas.clientHeight;
    if (!width || !height || revealed) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#b99b70'); gradient.addColorStop(.5, '#a3845f'); gradient.addColorStop(1, '#c7ac84');
    context.fillStyle = gradient; context.fillRect(0, 0, width, height);
    context.strokeStyle = '#f8e7c321'; context.lineWidth = .8;
    for (let x = -height; x < width + height; x += 20) {
      context.beginPath(); context.moveTo(x, 0); context.lineTo(x + height, height); context.stroke();
      context.beginPath(); context.moveTo(x, 0); context.lineTo(x - height, height); context.stroke();
    }
    for (const path of paths) for (let i = 0; i < path.length; i++) {
      const point = path[i], prev = path[Math.max(0, i - 1)];
      brush(point[0] * width, point[1] * height, prev[0] * width, prev[1] * height);
    }
  };
  const point = event => { const rect = canvas.getBoundingClientRect(); return [event.clientX - rect.left, event.clientY - rect.top]; };
  const scratch = event => {
    const [x, y] = point(event);
    const [px, py] = previous || [x, y];
    brush(x, y, px, py); previous = [x, y]; activePath.push([x / width, y / height]);
    // Mark a normalized occupancy grid along the entire stroke, not only pointer events.
    const steps = Math.max(1, Math.ceil(Math.hypot(x - px, y - py) / 8));
    for (let i = 0; i <= steps; i++) {
      const bx = px + (x - px) * i / steps, by = py + (y - py) * i / steps;
      for (let column = 0; column < columns; column++) for (let row = 0; row < rows; row++) {
        if (Math.hypot((column + .5) * width / columns - bx, (row + .5) * height / rows - by) < 23) coverage.add(row * columns + column);
      }
    }
    hint.style.opacity = '0';
    if (coverage.size / (columns * rows) > .36) reveal();
  };
  canvas.hidden = false; hint.hidden = false; button.hidden = false; $('#scratch-instruction').hidden = false;
  try { if (sessionStorage.getItem('vv-date-revealed') === config.weddingDate) { revealed = true; frame.classList.add('revealed'); hint.hidden = true; button.hidden = true; $('#scratch-instruction').textContent = 'Our forever begins. We can’t wait to celebrate with you.'; } } catch { /* No storage. */ }
  button.addEventListener('click', reveal);
  canvas.addEventListener('pointerdown', event => {
    if (revealed) return;
    drawing = true; activePath = []; paths.push(activePath); previous = null;
    canvas.setPointerCapture(event.pointerId); scratch(event);
  });
  canvas.addEventListener('pointermove', event => { if (drawing && !revealed) scratch(event); });
  const stop = () => { drawing = false; previous = null; };
  canvas.addEventListener('pointerup', stop); canvas.addEventListener('pointercancel', stop); canvas.addEventListener('lostpointercapture', stop);
  if ('ResizeObserver' in window) new ResizeObserver(paint).observe(frame);
  else window.addEventListener('resize', paint);
  paint();
}

function initGallery() {
  let index = 0, lightboxIndex = 0, collection = [], lastFocus;
  const dialog = $('#lightbox'), img = $('#gallery-image'), lightboxImg = $('#lightbox-image');
  const galleryItems = config.gallery.map(item => ({ src: `assets/web/image-${item.id}-1440.webp`, alt: item.alt, caption: item.caption }));
  const setSlide = next => {
    index = (next + config.gallery.length) % config.gallery.length;
    const item = config.gallery[index];
    img.src = `assets/web/image-${item.id}-960.webp`;
    img.srcset = `assets/web/image-${item.id}-480.webp 480w, assets/web/image-${item.id}-960.webp 960w`;
    img.alt = item.alt; img.style.objectPosition = item.position;
    $('#gallery-open').setAttribute('aria-label', `Enlarge wedding photograph ${index + 1}`);
    $('#gallery-caption').textContent = item.caption;
    $$('#gallery-dots button').forEach((dot, i) => { if (i === index) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current'); });
  };
  const showLightbox = next => {
    lightboxIndex = (next + collection.length) % collection.length;
    const item = collection[lightboxIndex];
    lightboxImg.src = item.src; lightboxImg.alt = item.alt;
    $('#lightbox-caption').textContent = item.caption;
    $('#lightbox-count').textContent = `${lightboxIndex + 1} / ${collection.length}`;
  };
  const openLightbox = (items, start) => {
    if (typeof dialog.showModal !== 'function') { window.open(items[start].src, '_blank', 'noopener'); return; }
    lastFocus = document.activeElement; collection = items; showLightbox(start); dialog.showModal();
    document.body.classList.add('intro-active'); $('#lightbox-close').focus();
  };
  $('#gallery-prev').addEventListener('click', () => setSlide(index - 1));
  $('#gallery-next').addEventListener('click', () => setSlide(index + 1));
  $$('#gallery-dots button').forEach(dot => dot.addEventListener('click', () => setSlide(Number(dot.dataset.slide))));
  $('#gallery-open').addEventListener('click', () => openLightbox(galleryItems, index));
  $('.gallery').addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); setSlide(index - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); setSlide(index + 1); }
  });
  let startX = 0, startY = 0;
  $('#gallery-open').addEventListener('touchstart', event => { startX = event.touches[0].clientX; startY = event.touches[0].clientY; }, { passive: true });
  $('#gallery-open').addEventListener('touchend', event => {
    const dx = event.changedTouches[0].clientX - startX, dy = event.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) { event.preventDefault(); setSlide(index + (dx > 0 ? -1 : 1)); }
  }, { passive: false });
  $$('.venue-photo-open').forEach(button => button.addEventListener('click', () => openLightbox(config.venue.photos.map((src, i) => ({ src, alt: $$('.venue-photo-open img')[i].alt, caption: `${config.venue.name} · ${i === 0 ? 'The entrance' : 'Wedding stage'}` })), Number(button.dataset.venuePhoto))));
  $('#lightbox-prev').addEventListener('click', () => showLightbox(lightboxIndex - 1));
  $('#lightbox-next').addEventListener('click', () => showLightbox(lightboxIndex + 1));
  $('#lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog && (event.clientX < dialog.getBoundingClientRect().left || event.clientX > dialog.getBoundingClientRect().right)) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showLightbox(lightboxIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showLightbox(lightboxIndex + 1); }
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('intro-active'); lastFocus?.focus({ preventScroll: true }); lightboxImg.removeAttribute('src'); });
  setSlide(0);
}

function initCountdown() {
  const update = () => {
    const values = countdown(config.countdownTarget);
    for (const unit of ['days', 'hours', 'minutes', 'seconds']) $(`[data-unit="${unit}"]`).textContent = String(values[unit]).padStart(2, '0');
    if (values.complete) {
      const today = indiaDate();
      $('#countdown-title').textContent = today === config.weddingDate ? 'Our wedding day is here!' : 'Our forever has begun.';
      $('#countdown-caption').textContent = today === config.weddingDate ? 'Today, we begin our forever. Celebrate with us!' : 'Thank you for being a part of our beautiful beginning.';
    }
  };
  update(); setInterval(() => { if (!document.hidden) update(); }, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
}

function initGuestTools() {
  $('#save-date').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([calendarFile(config)], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `${config.groom}-and-${config.bride}-${config.weddingDate}.ics`;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    announce('Your save-the-date calendar file is ready.');
  });
  const dialog = $('#share-dialog');
  const showShareDetails = () => {
    const data = shareData(config, location.href);
    $('#share-text').value = data.text + (data.url ? `\n${data.url}` : '');
    $('#share-explanation').textContent = data.url ? 'Copy the invitation and its link for your loved ones.' : 'Copy these invitation details for your loved ones. A website link can be added after hosting.';
    dialog.showModal();
  };
  $('#copy-details').hidden = false;
  $('#copy-details').addEventListener('click', showShareDetails);
  $('#share-invite').addEventListener('click', async () => {
    const data = shareData(config, location.href);
    if (navigator.share) {
      try { await navigator.share(data); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    showShareDetails();
  });
  $('#share-close').addEventListener('click', () => dialog.close());
  $('#copy-invite').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText($('#share-text').value);
      $('#copy-invite').textContent = 'INVITATION COPIED'; announce('Invitation details copied.');
      setTimeout(() => $('#copy-invite').textContent = 'COPY INVITATION', 2500);
    } catch {
      $('#share-text').focus(); $('#share-text').select();
      announce('The details are selected. Use your device’s Copy command.');
    }
  });
}

function initMotion() {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .035, rootMargin: '0px 0px -15px 0px' });
  $$('.reveal').forEach(node => observer.observe(node));
  const petals = document.createElement('div'); petals.className = 'petals'; petals.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 7; i++) {
    const petal = document.createElement('i'); petal.className = 'petal';
    petal.style.left = `calc(50% - 240px + ${i * 77}px)`;
    petal.style.animationDuration = `${15 + i * 1.5}s`; petal.style.animationDelay = `${-i * 3.5}s`; petals.append(petal);
  }
  document.body.append(petals);
  document.addEventListener('visibilitychange', () => $$('.petal').forEach(node => node.style.animationPlayState = document.hidden ? 'paused' : 'running'));
}

function initImageFallbacks() {
  $$('img').forEach(image => image.addEventListener('error', () => {
    image.classList.add('media-unavailable');
    if (image.alt === '') image.hidden = true;
    else if (image.id === 'venue-illustration' && !image.dataset.fallback) {
      image.dataset.fallback = 'yes'; image.src = config.venue.photos[0]; image.alt = 'Rajgharana Resort entrance, Shamli';
    }
  }));
}

hydrate();
// An isolated enhancement failing should not prevent the remaining invitation from working.
for (const initialize of [initImageFallbacks, initEntrance, initScratch, initGallery, initCountdown, initGuestTools, initMotion]) {
  try { initialize(); } catch (error) { console.warn(`Invitation enhancement unavailable: ${initialize.name}`, error); }
}
