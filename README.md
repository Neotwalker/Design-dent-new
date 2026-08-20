# Design Dent - desktop stage 5

Desktop refinement after review on a 2K display.

Changes in this stage:
- topbar restored with address/city and opening hours on the left, phone/email on the right;
- VK and WhatsApp moved to larger icon-only controls in the main desktop header;
- topbar scroll behavior rewritten with hysteresis and without opacity animation;
- modal scroll lock no longer changes desktop scroll position and freezes topbar state while open;
- 2K/ultrawide typography increased across secondary text, cards, forms and footer;
- hero tag hover uses white background + dark text;
- doctor/profile text-link icon and label share one hover color with smooth transform;
- full Yandex Maps reviews iframe restored in the reviews section;
- blog metadata icons changed to teal and action arrow follows text color;
- footer logo is white via CSS filter while keeping the source background transparent;
- footer phone has a dedicated hover color.

`index.html` is at the archive root for GitHub Deployer.

## Stage 6 - desktop bugfix pass

Исправления текущего прохода:

- на wide/2K desktop увеличена высота hero и ширина текстовой колонки, чтобы CTA не пересекались с быстрыми тегами;
- иконки VK / WhatsApp / Telegram заменены на более детализированные brand-style SVG;
- логика sticky header изменена: при скролле сворачивается только topbar, основной header больше не сдвигается transform-ом;
- добавлены hover-состояния для телефон/email в contacts__info и телефона в appointment__contacts;
- footer logo заменён на отдельный PNG с реальным прозрачным фоном и белым знаком/надписью;
- унифицирован hover у ссылок со стрелкой: текст и SVG всегда наследуют один цвет;
- сохранены предыдущие desktop/topbar/modal/scroll-lock исправления.
