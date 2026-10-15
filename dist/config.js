// All dates with a time use India's UTC+05:30 offset, independent of the guest's timezone.
export const invitation = {
  groom: 'Vishal',
  bride: 'Vishakha',
  blessing: 'श्री गणेशाय नमः',
  weddingDate: '2026-12-04',
  countdownTarget: '2026-12-04T00:00:00+05:30',
  publicUrl: '', // Set to your public HTTPS invitation URL after hosting.
  venue: {
    name: 'Rajgharana Resort',
    address: 'Near Sai Dham, NH-709B, Delhi–Saharanpur Road, Shamli, Uttar Pradesh 247776',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rajgharana%20Resort%20Near%20Sai%20Dham%20NH709B%20Shamli%20Uttar%20Pradesh%20247776',
    photos: ['assets/web/venue-entrance.webp', 'assets/web/venue-stage.webp'],
    illustration: 'assets/web/venue-watercolor.webp',
  },
  media: {
    intro: 'assets/videos/1.mp4',
    introFallback: 'assets/web/image-4-960.webp',
    floral: 'assets/web/image-2-960.webp',
    garland: 'assets/web/jasmine-garland.webp',
    haldi: 'assets/web/image-7-960.webp',
    dance: 'assets/web/image-6-480.webp',
    closing: 'assets/web/image-9-960.webp',
  },
  gallery: [
    { id: '1', alt: 'A tender wedding detail: hands joined beside rose and jasmine garlands', caption: 'Two hands. One promise.', position: '50% 52%' },
    { id: '3', alt: 'Henna-adorned hands held together', caption: 'A little moment. A lifetime of love.', position: '50% 50%' },
    { id: '5', alt: 'Wedding rings exchanged amid traditional red and white garlands', caption: 'The beautiful beginning of forever.', position: '50% 50%' },
  ],
  events: [
    { id: 'haldi', title: 'Haldi', hindi: 'हल्दी', date: '2026-12-03', time: '2:00 PM', description: 'A little sunshine, a little turmeric, and a whole lot of love.', location: '' },
    { id: 'dj', title: 'DJ Night', hindi: 'संगीत की शाम', date: '2026-12-03', time: 'Evening', description: 'Let the music play. Let the celebrations begin.', location: '' },
    { id: 'baraat', title: 'Baraat Departure', hindi: 'बारात प्रस्थान', date: '2026-12-04', time: '6:00 PM', description: 'With dancing feet and joyful hearts, the baraat sets off.', location: '' },
    { id: 'wedding', title: 'The Wedding', hindi: 'शुभ विवाह', date: '2026-12-04', time: '', description: 'With your love and blessings, our forever begins.', location: 'Rajgharana Resort · Shamli' },
  ],
};
