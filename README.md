# Design Dent — tablet/mobile stage 20

Исправлено:
- mobile/tablet карта больше не переключает `pointer-events` у iframe после загрузки;
- iframe карты интерактивен постоянно, а поверх него до нажатия лежит activation-cover;
- activation-cover поддерживает вертикальный scroll страницы (`touch-action: pan-y`), после нажатия полностью перестаёт перехватывать жесты;
- на ширине меньше 768px у `.hero__card` отменён фиксированный `height`, остаётся responsive `min-height`;
- радиус `.document-card` уменьшен до 14px;
- на телефонах сертификат занимает 85vw: видна одна полноценная карточка и часть следующей.
