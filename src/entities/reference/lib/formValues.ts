import { TFunction } from "i18next";
import { formatDateTime } from "@shared/lib/atlsFormat";
import {
  TAtlsField,
  TAtlsFormValues,
  TAtlsRecord,
  TAtlsSource,
  TAtlsSourceResolver,
} from "../model/types";

/** Источник поля-ссылки; может зависеть от других полей записи */
export const resolveSource = (
  source: TAtlsSourceResolver,
  values: Record<string, unknown>,
): TAtlsSource | undefined =>
  typeof source === "function" ? source(values) : source;

export const DEFAULT_OPTIONS_SIZE = 100;

const pad = (value: number) => String(value).padStart(2, "0");

/** ISO-дата сервера → значение для <input type="datetime-local"> */
const toLocalInputValue = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/** "2026-10-07T18:30" → "2026-10-07T18:30:00+05:00" (смещение обязательно) */
const toOffsetDateTime = (localValue: string): string => {
  const offsetMinutes = -new Date(localValue).getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  return `${localValue}:00${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
};

const parseNumber = (value: string) => Number(value.trim().replace(",", "."));

export const getFieldLabel = (field: TAtlsField, t: TFunction) =>
  t(field.label ?? `atls.fields.${field.name}`);

export const isFieldVisible = (field: TAtlsField, values: TAtlsFormValues) =>
  !field.visibleWhen || field.visibleWhen(values);

export const getInitialValues = (
  fields: TAtlsField[],
  record?: TAtlsRecord,
): TAtlsFormValues =>
  Object.fromEntries(
    fields.map((field) => {
      const value = record?.[field.name];
      if (field.type === "boolean") {
        return [
          field.name,
          typeof value === "boolean" ? value : (field.defaultValue ?? false),
        ];
      }
      if (value === null || value === undefined) return [field.name, ""];
      if (field.type === "datetime") {
        return [field.name, toLocalInputValue(String(value))];
      }
      return [field.name, String(value)];
    }),
  );

/** Подписи видимых обязательных полей, которые не заполнены */
export const getMissingRequired = (
  fields: TAtlsField[],
  values: TAtlsFormValues,
  t: TFunction,
): string[] =>
  fields
    .filter(
      (field) =>
        field.required &&
        field.type !== "boolean" &&
        isFieldVisible(field, values) &&
        !String(values[field.name]).trim(),
    )
    .map((field) => getFieldLabel(field, t));

/** Подписи числовых полей, в которых введено не число */
export const getInvalidNumbers = (
  fields: TAtlsField[],
  values: TAtlsFormValues,
  t: TFunction,
): string[] =>
  fields
    .filter((field) => {
      const value = String(values[field.name]);
      return (
        field.type === "number" &&
        isFieldVisible(field, values) &&
        value.trim() !== "" &&
        Number.isNaN(parseNumber(value))
      );
    })
    .map((field) => getFieldLabel(field, t));

/** Значения формы → тело запроса. Пустые и скрытые поля уходят как null. */
export const toRequestBody = (
  fields: TAtlsField[],
  values: TAtlsFormValues,
): Record<string, unknown> =>
  Object.fromEntries(
    fields.map((field) => {
      const value = values[field.name];
      if (field.type === "boolean") {
        return [field.name, isFieldVisible(field, values) && value === true];
      }
      const text = String(value).trim();
      if (!isFieldVisible(field, values) || text === "") {
        return [field.name, null];
      }
      if (field.type === "number") return [field.name, parseNumber(text)];
      if (field.type === "datetime") {
        return [field.name, toOffsetDateTime(text)];
      }
      return [field.name, text];
    }),
  );

export const getEnumLabel = (
  field: Extract<TAtlsField, { type: "enum" }>,
  value: string,
  t: TFunction,
) => (field.enumKey ? t(`atls.enums.${field.enumKey}.${value}`) : value);

/** Значение записи для ячейки таблицы */
export const formatCellValue = (
  field: TAtlsField,
  value: unknown,
  t: TFunction,
): string => {
  if (field.type === "boolean") {
    return value === true ? t("atls.common.yes") : t("atls.common.no");
  }
  if (value === null || value === undefined || value === "") return "—";
  if (field.type === "enum") return getEnumLabel(field, String(value), t);
  if (field.type === "datetime") return formatDateTime(value);
  return String(value);
};
