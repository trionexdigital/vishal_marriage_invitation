export function countdown(target, now = Date.now()) {
  const difference = Math.max(0, new Date(target).getTime() - now);
  const seconds = Math.floor(difference / 1000);
  return { days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24, minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60, complete: difference === 0 };
}

export function indiaDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function dateLabel(date, includeYear = true) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', ...(includeYear ? { year: 'numeric' } : {}) }).format(new Date(`${date}T12:00:00+05:30`));
}

function icsEscape(value) {
  return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

export function calendarFile(config) {
  const date = config.weddingDate.replaceAll('-', '');
  const end = new Date(`${config.weddingDate}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  const endDate = end.toISOString().slice(0, 10).replaceAll('-', '');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Vishal and Vishakha//Wedding Invitation//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT', `UID:${date}-vishal-vishakha@wedding-invitation.local`, 'DTSTAMP:20261015T000000Z',
    `DTSTART;VALUE=DATE:${date}`, `DTEND;VALUE=DATE:${endDate}`,
    `SUMMARY:${icsEscape(`${config.groom} weds ${config.bride}`)}`,
    `LOCATION:${icsEscape(`${config.venue.name}, ${config.venue.address}`)}`,
    `DESCRIPTION:${icsEscape('Join us with your love and blessings.\n' + config.events.map(event => `${event.title}: ${dateLabel(event.date)}${event.time ? `, ${event.time}` : ''}${event.location ? `; ${event.location}` : ''}`).join('\n'))}`,
    'TRANSP:TRANSPARENT', 'END:VEVENT', 'END:VCALENDAR',
  ];
  // RFC 5545 folds long content lines at 75 UTF-8 octets, without splitting a character.
  return lines.map(line => {
    let result = '', bytes = 0;
    for (const character of line) {
      const length = new TextEncoder().encode(character).length;
      if (bytes + length > 75) { result += '\r\n '; bytes = 1; }
      result += character; bytes += length;
    }
    return result;
  }).join('\r\n') + '\r\n';
}

export function shareData(config, currentUrl = '') {
  const supplied = config.publicUrl || currentUrl;
  let publicUrl = '';
  try {
    const parsed = new URL(supplied);
    const local = /^(localhost|127\.|0\.0\.0\.0|\[::1\]|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(parsed.hostname);
    if (parsed.protocol === 'https:' && !local) publicUrl = parsed.href;
  } catch { /* Local file previews and empty future URL share text only. */ }
  const schedule = config.events.filter(event => event.id !== 'wedding').map(event => `${event.title}: ${dateLabel(event.date, false)}, ${event.time}${/\d/.test(event.time) ? ' IST' : ''}`).join('\n');
  const text = `${config.groom} weds ${config.bride}\n${dateLabel(config.weddingDate)}\n${config.venue.name}, ${config.venue.address}\n${schedule}\nWe would love to celebrate with you!`;
  return { title: `${config.groom} & ${config.bride} · Wedding Invitation`, text, ...(publicUrl ? { url: publicUrl } : {}) };
}
