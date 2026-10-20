import { TAtlsRecord, TAtlsSource } from "../model/types";

const text = (value: unknown) =>
  value === null || value === undefined ? "" : String(value);

const join = (...parts: unknown[]) =>
  parts.map(text).filter(Boolean).join(" ");

const byName = (item: TAtlsRecord) => text(item.name);

// Старые справочники (не ATLS) — как в существующих модулях, до 1000 записей
const OLD_REFERENCE_SIZE = 1000;

export const SOURCES = {
  routeType: {
    url: "atls/route-type/",
    getLabel: (item) => join(item.number, item.name),
  },
  direction: {
    url: "atls/direction/",
    getLabel: (item) => join(item.number, item.title),
  },
  route: {
    url: "atls/route/",
    getLabel: (item) => join(item.number, `${text(item.nameA)} — ${text(item.nameB)}`),
  },
  coefficient: {
    url: "atls/coefficient/",
    getLabel: (item) => `${text(item.name)} (${text(item.value)})`,
  },
  malumotnoma: {
    url: "atls/malumotnoma/",
    getLabel: (item) => text(item.fio),
  },
  routeMalumotnoma: {
    url: "atls/route-malumotnoma/",
    getLabel: byName,
  },
  company: {
    url: "company/",
    params: { userType: "COMPANY" },
    searchable: true,
    getLabel: (item) => join(item.shortName || item.name, item.tin && `(${text(item.tin)})`),
  },
  transport: {
    url: "transport/",
    searchable: true,
    getLabel: (item) =>
      join(
        item.license_plate ?? item.LicensePlate,
        item.car_brand ?? item.CarBrand,
        item.car_model ?? item.CarModel,
      ),
  },
  // districtId маршрута — области Таджикистана из справочника district
  district: { url: "district/", pageSize: OLD_REFERENCE_SIZE, getLabel: byName },
  city: { url: "city/", pageSize: OLD_REFERENCE_SIZE, getLabel: byName },
  transportType: {
    url: "transporttype/",
    pageSize: OLD_REFERENCE_SIZE,
    getLabel: byName,
  },
  ownership: {
    url: "transportownership/",
    pageSize: OLD_REFERENCE_SIZE,
    getLabel: byName,
  },
  fuel: { url: "transportfuel/", pageSize: OLD_REFERENCE_SIZE, getLabel: byName },
} satisfies Record<string, TAtlsSource>;
