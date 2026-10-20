// Значения перечислений из Swagger (atls). Подписи — в переводах atls.enums.*

export const WAYBILL_FORMS = [
  "FORM_1A",
  "FORM_1AD",
  "FORM_3C",
  "FORM_2B",
  "FORM_5BBM",
] as const;

export const VEHICLE_KINDS = ["BUS", "TROLLEYBUS"] as const;

export const CLIENT_TYPES = ["COMPANY", "ENTREPRENEUR", "INDIVIDUAL"] as const;

export const WAYBILL_STATUSES = [
  "DRAFT",
  "IN_INSPECTION",
  "ADMITTED",
  "REJECTED",
  "CLOSED",
  "CANCELLED",
] as const;

export const INSPECTION_RESULTS = ["APPROVED", "REJECTED"] as const;
export const INSPECTION_KINDS = ["MEDICAL", "TECHNICAL"] as const;
export const MILEAGE_GROUP_BY = ["TRANSPORT", "DRIVER"] as const;

// Шаблон сервера: ROUTE|DIRECTION
export const COEFFICIENT_ENTITY_TYPES = ["ROUTE", "DIRECTION"] as const;

export const DOC_VIEWS = [
  "NULL",
  "LIC",
  "LIC_INSIDE",
  "SER",
  "ID_CARD",
  "PASSPORT",
  "VEHICLE_REG_CERTIFICATE",
  "INTER_LIC",
  "DRIVER_LIC",
  "INSPECTION_CARD",
  "CONTROL_CARD",
  "ATLS_PASSENGER",
  "ATLS_TROLLEYBUS",
] as const;

// Шаблон сервера: (?i)A1?|B1?|BE|C1?E?|D1?E?|TB|TM|M
export const DRIVER_CATEGORIES = [
  "A",
  "A1",
  "B",
  "B1",
  "BE",
  "C",
  "C1",
  "CE",
  "C1E",
  "D",
  "D1",
  "DE",
  "D1E",
  "TB",
  "TM",
  "M",
] as const;

export const COEFFICIENT_TYPES = [
  "WINTER",
  "MOUNTAIN",
  "ROAD_DIFFICULTY",
  "IN_CITY",
  "STOPS",
  "CARGO_SPECIAL",
  "RUN_IN",
  "CONVOY",
  "USED",
  "TECH_OPERATION",
  "SLOW_OPERATION",
  "OFF_ROAD",
  "SEVERE_CONDITIONS",
  "DRIVER_TRAINING",
  "AIR_CONDITIONER",
  "IDLING",
  "WARMING",
  "GARAGE",
  "IMPROVED_ROADS",
] as const;

export const FUEL_NORM_CATEGORIES = [
  "WEIGHT_ADJUSTMENT",
  "FUEL_CONVERSION",
  "ADDITIONAL_LIQUID_FUEL",
  "LUBRICANT",
  "HEATER",
  "TRANSPORT_WORK",
  "SPECIAL_EQUIPMENT",
  "TRAILER_PER_TON",
  "DUMP_PER_TRIP",
] as const;

// Шаблон сервера: GASOLINE|DIESEL|LPG|CNG|GAS_DIESEL|ELECTRIC
export const FUEL_TYPES = [
  "GASOLINE",
  "DIESEL",
  "LPG",
  "CNG",
  "GAS_DIESEL",
  "ELECTRIC",
] as const;

export const FUEL_UNITS = [
  "L_PER_100KM_PER_T",
  "L_PER_100_TKM",
  "L_PER_HOUR",
  "L_PER_TRIP",
  "L_PER_MONTH",
  "L_PER_VEHICLE",
  "L_PER_100L",
  "KG_PER_100L",
  "M3_PER_100KM",
  "RATIO",
] as const;

export const VEHICLE_CLASSES = [
  "PASSENGER",
  "FLATBED",
  "DUMP_TRUCK",
  "SPECIAL",
  "SPECIAL_MOVER",
  "NOT_CALCULATED",
] as const;
