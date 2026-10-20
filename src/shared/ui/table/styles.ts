// Единый вид таблиц ATLS: белая таблица в стеклянной карточке, лавандовые полосы, тонкие линии

/** Обёртка таблицы внутри карточки: рамка и скругление */
export const TABLE_WRAP_CLASS =
  "overflow-hidden rounded-[14px] border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-800";

/** Линии сетки между колонками (последняя колонка — без линии справа) */
const GRID_LINES =
  "border-r border-gray-200 last:border-r-0 dark:border-white/10";

/** Фон шапки, строки «Итого» и полосы страниц (.table-pagination в index.css) — один цвет */
export const TABLE_BAND_BG = "bg-[#f5f4ff] dark:bg-[#221e45]";

/** Заголовок колонки: лавандовая полоса, линия снизу */
export const TH_CLASS = `px-4 py-3 text-start text-[11.5px] font-bold tracking-[0.02em] text-gray-500 ${TABLE_BAND_BG} whitespace-nowrap border-b ${GRID_LINES} dark:text-gray-400`;

/** Ячейка */
export const TD_CLASS = `px-4 py-3 text-start text-[13.5px] text-gray-600 ${GRID_LINES} dark:text-gray-300`;

/** Строка */
export const TR_CLASS =
  "border-b border-gray-200 last:border-b-0 dark:border-white/10";

/** Строка, по которой можно кликнуть */
export const TR_CLICKABLE_CLASS = `${TR_CLASS} cursor-pointer transition-colors hover:bg-brand-500/[0.05] dark:hover:bg-brand-500/[0.08]`;

/** Сообщение «пусто» / «загрузка» под таблицей */
export const TABLE_NOTE_CLASS =
  "px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400";
