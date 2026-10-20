import type { LucideIcon } from "lucide-react";

// Запись любого справочника ATLS

export type TAtlsRecord = { id: string } & Record<string, unknown>;

// Описание полей справочника

export type TAtlsFormValue = string | boolean;
export type TAtlsFormValues = Record<string, TAtlsFormValue>;

type TAtlsBaseField = {
  name: string;
  /** Ключ перевода подписи; по умолчанию atls.fields.<name> */
  label?: string;
  required?: boolean;
  inTable?: boolean;
  /** Поле показывается и отправляется только при выполнении условия */
  visibleWhen?: (values: TAtlsFormValues) => boolean;
};

/** Справочник, из которого выбирается запись: на сервер уходит её id */
export type TAtlsSource = {
  /** Адрес списка со слешем на конце; запись по id — <url><id> */
  url: string;
  params?: Record<string, string>;
  /** Сколько записей загрузить в список (ATLS — не больше 100) */
  pageSize?: number;
  /** Большой список: выбор через поиск на сервере (?search=) */
  searchable?: boolean;
  getLabel: (item: TAtlsRecord) => string;
};

export type TAtlsSourceResolver =
  | TAtlsSource
  | ((values: Record<string, unknown>) => TAtlsSource | undefined);

export type TAtlsField =
  | (TAtlsBaseField & { type: "text" | "textarea" | "number" | "datetime" })
  | (TAtlsBaseField & { type: "boolean"; defaultValue?: boolean })
  | (TAtlsBaseField & {
      type: "enum";
      values: readonly string[];
      /** Ключ переводов значений atls.enums.<enumKey>; без него значение показывается как есть */
      enumKey?: string;
    })
  | (TAtlsBaseField & {
      type: "reference";
      source: TAtlsSourceResolver;
      /** Очистить поле, когда меняется указанное поле (источник зависит от него) */
      resetOn?: string;
    });

/** Раздел бокового меню */
export type TAtlsGroup = "arrays" | "fuel" | "malumotnoma" | "admission";

export type TAtlsReferenceConfig = {
  /** Часть адреса API: atls/<slug>/ и страницы: /references/atls/<slug> */
  slug: string;
  group: TAtlsGroup;
  icon: LucideIcon;
  fields: TAtlsField[];
  /** Только просмотр: без создания, изменения и удаления */
  readOnly?: boolean;
  /** Фильтр списка по компании (?companyId=) */
  companyFilter?: boolean;
};
