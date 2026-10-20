// Форматирование значений ATLS для таблиц и карточек

const pad = (value: number) => String(value).padStart(2, "0");

const toDate = (value: unknown): Date | null => {
  if (value === null || value === undefined || value === "") return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
};

/** "2026-10-07T13:30:00Z" → "07.10.2026 18:30" (время браузера) */
export const formatDateTime = (value: unknown): string => {
  const date = toDate(value);
  if (!date) return value ? String(value) : "—";
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

/** "2026-10-07" → "07.10.2026" (без сдвига по часовому поясу) */
export const formatDate = (value: unknown): string => {
  const match = String(value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value ? String(value) : "—";
  return `${match[3]}.${match[2]}.${match[1]}`;
};

/** Число с пробелами между разрядами, до 2 знаков после запятой */
export const formatNumber = (value: unknown): string => {
  if (value === null || value === undefined || value === "") return "—";
  const number = Number(value);
  if (Number.isNaN(number)) return String(value);
  return number.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
};

/** Сегодняшняя дата для <input type="date">: "2026-10-09" */
export const todayInputValue = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/** Первое число текущего месяца для <input type="date"> */
export const monthStartInputValue = (): string => `${todayInputValue().slice(0, 8)}01`;

/** Текущий месяц для <input type="month">: "2026-10" */
export const currentMonthInputValue = (): string => todayInputValue().slice(0, 7);
