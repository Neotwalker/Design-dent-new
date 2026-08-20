# Design Dent - homepage prototype

Responsive static homepage prepared for GitHub Pages / GitHub Deployer and deliberately structured for a later WordPress integration.

## Structure
- `index.html` - homepage markup
- `assets/css/style.css` - responsive UI styles
- `assets/js/app.js` - menu, modal forms, lead-source fields, phone mask, sliders, FAQ, map guard and scroll-to-top
- `assets/img/` - logo, doctors, hero and before/after clinical images

## WordPress mapping
Recommended production split:
- `header.php` - topbar, header, mobile menu
- `footer.php` - footer, social links, modal form, floating controls
- `front-page.php` - homepage sections
- ACF options - contacts, opening hours, ratings fallback values, social links, video URL
- CPT / dynamic content - `service`, `doctor`, `review` (only if needed in addition to widgets), `post`
- Forms - CF7 + Flamingo or CRM/REST handler

Every lead form already contains hidden analytics fields:
- `form_id`
- `form_name`
- `source_block`
- `cta_text`
- `page_url`
- `page_title`
- `doctor`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `referrer`

CTA buttons open the shared modal instead of scrolling to the bottom form. The lower form remains available as a direct inline conversion point.

## Reviews and ratings
Current prototype behavior:
- **Yandex rating** uses the official live rating badge iframe supplied for organization `1253824945`.
- **Yandex reviews** use the official Maps reviews widget iframe and update on the Yandex side.
- **ProDoctorov** currently uses a visual fallback card plus a direct source link; production should replace it with the official clinic widget code from the ProDoctorov account.
- **2GIS** is linked directly. Rating/count can later be refreshed through Places API when an API key is available; text reviews are not scraped.

Important: an official iframe widget controls its own ordering. If production requires exactly the two newest reviews combined from several platforms in one custom Design Dent layout, that should be implemented server-side in WordPress via an approved reviews aggregator/API source. Do not scrape provider pages in front-end JavaScript.

## Map behavior
On touch/coarse-pointer devices the embedded map has pointer interaction disabled by default so page scrolling is not captured. The visitor explicitly taps “Открыть интерактивную карту” to activate it.

## Placeholder links
Unknown contacts/pages intentionally use `href="#"`:
- clinic e-mail
- WhatsApp
- Telegram
- future service/doctor/blog/legal pages

VK, phone, Yandex Maps, 2GIS and ProDoctorov links are already connected.

## Before launch
1. Add the real e-mail, WhatsApp and Telegram links.
2. Connect CF7/Flamingo or CRM handling and server-side validation.
3. Insert the official Yandex and ProDoctorov widget embeds; add 2GIS API key if dynamic rating is required.
4. Confirm publication consent for all patient before/after materials.
5. Prefer a local optimized MP4/WebM for the clinic video when the source file is available.
6. Recheck prices, doctor facts, ratings and counts.
7. Add the future pages: services, service detail, doctors, prices, all reviews, blog archive and article.

The ZIP is prepared so that `index.html` is in the archive root.


## Desktop stage 2 changes
- larger desktop header/navigation typography
- removed duplicate phone from topbar
- added VK and WhatsApp quick links
- scrollbar compensation and instant scroll restoration for modal open/close
- hover/focus states across site links and buttons
- Yandex live rating/reviews widgets
- 2GIS reviews link
- preserved before/after clinical image height with `object-fit: contain`
- vertically centered advantages rows
- unified doctor CTA colors
- added “Все цены” placeholder link
- made the full blog card clickable
- smoother FAQ reveal
- semantic cleanup: ordered advantages list, single clickable blog area, labelled review navigation/iframes
