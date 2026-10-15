# Asset sources

## Supplied by the user

Originals: `assets/images/1.jpg` through `9.jpg` (image 6 is PNG), plus `assets/videos/1.mp4`. Originals were preserved. Image 8 is retained but not used in the initial design. The illustration in image 6 carries its original source marking. The supplied video is a silent jasmine-decorated door-opening sequence.

## Venue verification and authentic photos

Venue: Rajgharana Resort, near Sai Dham, NH-709B, Delhi–Saharanpur Road, Shamli, Uttar Pradesh 247776. This is the Shamli property, not similarly named resorts in Jhunjhunu, Karnal, or Kushinagar.

- Google listing: https://www.google.com.pk/travel/hotels/entity/ChoI2IGVlvXQoJztARoNL2cvMTF0czI4amJ6XxAB
- Venue portfolio: https://www.wedmegood.com/wedding-venues/Rajgharana-Resort-25687942
- Entrance photo: https://image.wedmegood.com/resized/800X/uploads/member/25687942/1746013362_Screenshot_100.png
- Wedding-stage photo: https://image.wedmegood.com/resized/720X/uploads/member/25687942/1746013363_Screenshot_99.png

Source photographs and their existing marks are retained in `assets/web/venue-entrance-source.png` and `venue-stage-source.png`. Optimized versions are separate WebP files. The illustration is identified as watercolor in its alternative text, while the photographic views show the actual venue. Wedding-stage decorations are portfolio examples, not a promise about the event's booked decoration.

## Fonts

Cormorant Garamond, Lato, and Noto Serif Devanagari, downloaded through Google Fonts and served locally. Font CSS is preserved in `assets/web/fonts.css`. Font project information and open-font licenses:

- https://fonts.google.com/specimen/Cormorant+Garamond
- https://fonts.google.com/specimen/Lato
- https://fonts.google.com/noto/specimen/Noto+Serif+Devanagari

## Generated artwork

Created using the built-in **imagegen** tool. Final workspace PNGs and optimized WebP copies are in `assets/web/`:

- `venue-watercolor.png` / `.webp`: watercolor treatment of the authentic supplied venue photograph.
- `jasmine-garland.png` / `.webp`: original botanical floral divider.

### Venue prompt

Use case: style-transfer. Edit target: the supplied authentic photograph of Rajgharana Resort in Shamli. Create a refined watercolor architectural vignette for a cream and muted-gold Indian wedding invitation website. Preserve the recognizable actual architecture: white and pale gold two-story facade, round and arched windows, entrance columns with scalloped canopy and dome, the standing classical statue, and ornate black-and-gold gate. Depict exactly this venue from this perspective, no invented palace. Simplify photographic clutter such as wires and rubble. Soft warm ivory, honey gold and sage watercolor washes, delicate pencil details, natural elegant proportions. Isolate the complete architectural composition on a genuinely transparent background, with soft watercolor edges fading into transparency, generous clear padding. No lettering, no newly drawn signage, no border. Wide landscape composition.

### Garland prompt

Use case: illustration-story. Asset type: horizontal floral divider for an elegant traditional Indian wedding invitation website. Create a single wide lush jasmine garland on a genuinely transparent background. Realistic finely painted white jasmine blossoms and unopened ivory buds in abundant clusters along an elegantly curving horizontal stem, interspersed with rich sage and olive glossy mango leaves. Three delicate hanging jasmine tassels, center tassel longest. A few tiny pale golden blossoms, predominantly white and green. Premium botanical watercolor with realistic depth, softly sunlit cream-white petals and intricate fine detail. Wide horizontal composition approximately 4:1, full botanical edges comfortably inside image; no text, no symbols, no background, no frame, no shadow rectangle. It must remain legible at 560 pixels wide and harmonize with warm parchment, wooden doors, and muted gold invitation typography.

## Other graphics and audio

The Ganesh line ornament, filigree, monogram, and leaf graphics are original inline SVG/CSS. Background music is an original pentatonic Web Audio arrangement synthesized on the guest's device. No commercial recording or reference-site audio is copied.

Visual reference inspected: https://wedsmint.com/malligai/ — door entrance, cream/gold invitation, jasmine dividers, scratch reveal, framed gallery, countdown, celebration timeline, illustrated venue, and closing blessings. The website was implemented independently without the reference site's branding, demo controls, or booking links.
