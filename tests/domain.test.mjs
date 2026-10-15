import test from 'node:test';
import assert from 'node:assert/strict';
import { invitation } from '../config.js';
import { countdown, indiaDate, calendarFile, shareData } from '../domain.js';

test('countdown targets midnight in India, not the visitor timezone', () => {
  assert.deepEqual(countdown(invitation.countdownTarget, Date.parse('2026-12-03T18:29:00Z')), { days: 0, hours: 0, minutes: 1, seconds: 0, complete: false });
  assert.equal(countdown(invitation.countdownTarget, Date.parse('2026-12-03T18:30:00Z')).complete, true);
  assert.deepEqual(countdown(invitation.countdownTarget, Date.parse('2027-01-01T00:00:00Z')), { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true });
});
test('India date switches on Indian midnight', () => {
  assert.equal(indiaDate(new Date('2026-12-03T18:29:00Z')), '2026-12-03');
  assert.equal(indiaDate(new Date('2026-12-03T18:30:00Z')), '2026-12-04');
});
test('calendar is an all-day event with exclusive next-day end and no fabricated ceremony time', () => {
  const file = calendarFile(invitation);
  assert.match(file, /DTSTART;VALUE=DATE:20261204\r\n/);
  assert.match(file, /DTEND;VALUE=DATE:20261205\r\n/);
  assert.doesNotMatch(file, /DTSTART.*T1800/);
  assert.match(file, /SUMMARY:Vishal weds Vishakha/);
  assert.ok(file.split('\r\n').every(line => Buffer.byteLength(line) <= 75));
  assert.ok(file.endsWith('END:VCALENDAR\r\n'));
});
test('sharing never advertises a local preview or private address as a guest link', () => {
  for (const url of ['http://localhost:8765', 'http://127.0.0.1:8765', 'https://192.168.1.4', 'https://172.16.2.4', 'file:///D:/index.html']) assert.equal(shareData(invitation, url).url, undefined);
  const data = shareData({ ...invitation, publicUrl: 'https://example.com/wedding/' }, 'http://localhost:8765');
  assert.equal(data.url, 'https://example.com/wedding/');
  assert.match(data.text, /Baraat Departure: 4 December, 6:00 PM IST/);
});
