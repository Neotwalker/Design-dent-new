Дизайн Дент — оптимизированный редизайн

Что внутри:
- index.html — главная
- price.html — цены и акции
- specialists.html — врачи
- reviews.html — отзывы
- responsive-preview.html — быстрая проверка адаптива 1920 / 1200 / 768 / 480
- assets/style.min.css и assets/script.min.js — подключённые оптимизированные файлы
- assets/style.css и assets/script.js — читаемые исходники

Адаптивные версии:
- 1920+: широкий desktop, контейнер до 1560px, расширенные сетки
- 1200: laptop / small desktop, контейнер до 1120px
- 768: tablet, мобильное меню, перестроение сеток
- 480: mobile, компактные отступы, одноколоночные блоки

Оптимизация:
- Убраны внешние шрифты, используется системный стек — быстрее первый рендер.
- CSS/JS подключены в minified-версиях.
- JS подключён через defer.
- Добавлены meta viewport, description, theme-color.
- Добавлены skip-link, aria-label, aria-expanded, aria-hidden для модалки и меню.
- Используются content-visibility для тяжёлых секций.
- Анимации отключаются при prefers-reduced-motion.
- Нет тяжёлых изображений: графика выполнена SVG/CSS, поэтому архив лёгкий.
- Сетки и типографика fluid через clamp().
