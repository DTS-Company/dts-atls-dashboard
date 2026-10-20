import {
  BookOpen,
  Calculator,
  CalendarRange,
  Car,
  ClipboardList,
  Contact,
  FileCheck,
  Fuel,
  Link2,
  Map as MapIcon,
  Navigation,
  Package,
  Route,
  ShieldCheck,
  Truck,
  UserCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  TAtlsFormValues,
  TAtlsGroup,
  TAtlsReferenceConfig,
} from "../model/types";
import { SOURCES } from "./sources";
import {
  CLIENT_TYPES,
  COEFFICIENT_ENTITY_TYPES,
  COEFFICIENT_TYPES,
  DOC_VIEWS,
  DRIVER_CATEGORIES,
  FUEL_NORM_CATEGORIES,
  FUEL_TYPES,
  FUEL_UNITS,
  VEHICLE_CLASSES,
  VEHICLE_KINDS,
  WAYBILL_FORMS,
} from "@shared/config/enums";

// «Автобус или троллейбус» выбирается только для формы 1-АД
const isForm1AD = (values: TAtlsFormValues) => values.form === "FORM_1AD";

// Прицеп бывает только у форм 2-Б и 5Б-БМ
const isTrailerForm = (values: TAtlsFormValues) =>
  values.form === "FORM_2B" || values.form === "FORM_5BBM";

// Коэффициент привязывается к маршруту или к направлению
const getCoefficientTargetSource = (values: Record<string, unknown>) => {
  if (values.entityType === "ROUTE") return SOURCES.route;
  if (values.entityType === "DIRECTION") return SOURCES.direction;
  return undefined;
};

// Разделы бокового меню — в порядке прототипа
export const ATLS_GROUPS: { key: TAtlsGroup; icon: LucideIcon }[] = [
  { key: "arrays", icon: ClipboardList },
  { key: "fuel", icon: Fuel },
  { key: "malumotnoma", icon: BookOpen },
  { key: "admission", icon: ShieldCheck },
];

export const getGroupReferences = (group: TAtlsGroup) =>
  ATLS_REFERENCES.filter((reference) => reference.group === group);

export const ATLS_REFERENCES: TAtlsReferenceConfig[] = [
  // Массивы (Массивҳо)
  {
    slug: "direction",
    group: "arrays",
    icon: Navigation,
    fields: [
      { name: "number", type: "text", inTable: true },
      { name: "title", type: "text", required: true, inTable: true },
      { name: "ignoreCoefficients", type: "boolean", inTable: true },
    ],
  },
  {
    slug: "route-malumotnoma",
    group: "arrays",
    icon: BookOpen,
    fields: [
      { name: "name", type: "text", required: true, inTable: true },
      { name: "distance", type: "number", inTable: true },
      { name: "carPrice", type: "number", inTable: true },
      { name: "mbusPrice", type: "number", inTable: true },
      { name: "busPrice", type: "number", inTable: true },
      { name: "price", type: "text", inTable: true },
    ],
  },

  // Топливо (Сӯзишворӣ)
  {
    slug: "route",
    group: "fuel",
    icon: MapIcon,
    fields: [
      { name: "number", type: "text", required: true, inTable: true },
      { name: "typeId", type: "reference", source: SOURCES.routeType, inTable: true },
      { name: "nameA", type: "text", required: true, inTable: true },
      { name: "nameB", type: "text", required: true, inTable: true },
      { name: "distanceA", type: "number", inTable: true },
      { name: "distanceB", type: "number", inTable: true },
      { name: "timeOneLapA", type: "text" },
      { name: "timeOneLapB", type: "text" },
      { name: "beginPathA", type: "text" },
      { name: "beginPathB", type: "text" },
      { name: "plannedLap", type: "number" },
      { name: "coeUseCapacity", type: "number" },
      { name: "averageLengthPassSeat", type: "number" },
      { name: "validCert", type: "datetime" },
      { name: "companyId", type: "reference", source: SOURCES.company },
      { name: "districtId", type: "reference", source: SOURCES.district },
      { name: "cityId", type: "reference", source: SOURCES.city },
      { name: "transportTypeId", type: "reference", source: SOURCES.transportType },
      { name: "ownershipId", type: "reference", source: SOURCES.ownership },
      { name: "additionalFuel", type: "number" },
      { name: "additionalFuel100", type: "number" },
      { name: "condFuel", type: "number" },
      { name: "heatingFuel", type: "number" },
      { name: "latitude", type: "text" },
      { name: "longitude", type: "text" },
      { name: "ignoreCoefficients", type: "boolean", inTable: true },
      { name: "description", type: "textarea" },
    ],
  },
  {
    slug: "client",
    group: "fuel",
    icon: Contact,
    readOnly: true,
    companyFilter: true,
    fields: [
      { name: "name", type: "text", inTable: true },
      { name: "tin", type: "text", inTable: true },
      {
        name: "type",
        label: "atls.fields.clientType",
        type: "enum",
        values: CLIENT_TYPES,
        enumKey: "clientType",
        inTable: true,
      },
      { name: "companyId", type: "reference", source: SOURCES.company, inTable: true },
      { name: "phone", type: "text", inTable: true },
      { name: "address", type: "text", inTable: true },
      { name: "bankName", type: "text", inTable: true },
      { name: "account", type: "text", inTable: true },
    ],
  },
  {
    slug: "cargo",
    group: "fuel",
    icon: Package,
    fields: [
      { name: "number", type: "text", inTable: true },
      { name: "name", type: "text", required: true, inTable: true },
      { name: "type", label: "atls.fields.cargoType", type: "text", inTable: true },
      { name: "unit", type: "text", inTable: true },
      { name: "price", type: "number", inTable: true },
      { name: "cargoClass", type: "text", inTable: true },
    ],
  },
  {
    slug: "route-type",
    group: "fuel",
    icon: Route,
    fields: [
      { name: "number", type: "text", inTable: true },
      { name: "name", type: "text", required: true, inTable: true },
    ],
  },
  {
    slug: "tariff",
    group: "fuel",
    icon: Wallet,
    fields: [
      { name: "number", type: "text", inTable: true },
      { name: "typeAuto", type: "text", inTable: true },
      { name: "routeId", type: "reference", source: SOURCES.route, inTable: true },
      { name: "fuelId", type: "reference", source: SOURCES.fuel, inTable: true },
      { name: "pricePer1Mkm", type: "number", inTable: true },
      { name: "advCoe", type: "number", inTable: true },
      { name: "priceOneTime", type: "number", inTable: true },
    ],
  },
  {
    slug: "coefficient",
    group: "fuel",
    icon: Calculator,
    fields: [
      {
        name: "type",
        label: "atls.fields.coefficientType",
        type: "enum",
        values: COEFFICIENT_TYPES,
        enumKey: "coefficientType",
        required: true,
        inTable: true,
      },
      { name: "name", type: "text", required: true, inTable: true },
      { name: "value", type: "number", required: true, inTable: true },
      { name: "maxValue", type: "number", inTable: true },
      { name: "periodFrom", type: "datetime", inTable: true },
      { name: "periodTo", type: "datetime", inTable: true },
      { name: "active", type: "boolean", defaultValue: true, inTable: true },
    ],
  },
  {
    slug: "coefficient-link",
    group: "fuel",
    icon: Link2,
    fields: [
      {
        name: "entityType",
        type: "enum",
        values: COEFFICIENT_ENTITY_TYPES,
        enumKey: "entityType",
        required: true,
        inTable: true,
      },
      {
        name: "entityId",
        type: "reference",
        source: getCoefficientTargetSource,
        resetOn: "entityType",
        required: true,
        inTable: true,
      },
      {
        name: "coefficientId",
        type: "reference",
        source: SOURCES.coefficient,
        required: true,
        inTable: true,
      },
    ],
  },
  {
    slug: "fuel-norm",
    group: "fuel",
    icon: Fuel,
    fields: [
      {
        name: "category",
        label: "atls.fields.normCategory",
        type: "enum",
        values: FUEL_NORM_CATEGORIES,
        enumKey: "fuelNormCategory",
        required: true,
        inTable: true,
      },
      {
        name: "fuelType",
        type: "enum",
        values: FUEL_TYPES,
        enumKey: "fuelType",
        inTable: true,
      },
      {
        name: "vehicleClass",
        type: "enum",
        values: VEHICLE_CLASSES,
        enumKey: "vehicleClass",
        inTable: true,
      },
      { name: "value", type: "number", required: true, inTable: true },
      {
        name: "unit",
        type: "enum",
        values: FUEL_UNITS,
        enumKey: "fuelUnit",
        required: true,
        inTable: true,
      },
      { name: "condition", type: "textarea" },
      { name: "active", type: "boolean", defaultValue: true, inTable: true },
    ],
  },
  {
    slug: "vehicle-profile",
    group: "fuel",
    icon: Car,
    fields: [
      {
        name: "transportId",
        type: "reference",
        source: SOURCES.transport,
        required: true,
        inTable: true,
      },
      {
        name: "vehicleClass",
        type: "enum",
        values: VEHICLE_CLASSES,
        enumKey: "vehicleClass",
        required: true,
        inTable: true,
      },
      { name: "baseNormDushanbe", type: "number", inTable: true },
      { name: "tonKmNorm", type: "number" },
      { name: "tripNorm", type: "number" },
      { name: "hourNorm", type: "number" },
      { name: "specialNorm", type: "number" },
      { name: "heaterNorm", type: "number" },
      { name: "carrying", type: "number", inTable: true },
      { name: "airConditioner", type: "boolean", inTable: true },
    ],
  },

  // Справки (маълумотнома)
  {
    slug: "malumotnoma",
    group: "malumotnoma",
    icon: Users,
    fields: [
      { name: "fio", type: "text", required: true, inTable: true },
      { name: "age", type: "number", inTable: true },
      {
        name: "transportTypeId",
        type: "reference",
        source: SOURCES.transportType,
        inTable: true,
      },
    ],
  },
  {
    slug: "malumotnoma-route",
    group: "malumotnoma",
    icon: Link2,
    fields: [
      {
        name: "malumotnomaId",
        type: "reference",
        source: SOURCES.malumotnoma,
        required: true,
        inTable: true,
      },
      {
        name: "routeId",
        label: "atls.fields.malumotnomaRouteId",
        type: "reference",
        source: SOURCES.routeMalumotnoma,
        required: true,
        inTable: true,
      },
      { name: "roundTrip", type: "boolean", inTable: true },
    ],
  },

  // Допуск к формам путевого листа
  {
    slug: "license-form",
    group: "admission",
    icon: FileCheck,
    fields: [
      {
        name: "form",
        type: "enum",
        values: WAYBILL_FORMS,
        enumKey: "form",
        required: true,
        inTable: true,
      },
      {
        name: "vehicleKind",
        type: "enum",
        values: VEHICLE_KINDS,
        enumKey: "vehicleKind",
        visibleWhen: isForm1AD,
        inTable: true,
      },
      {
        name: "docView",
        type: "enum",
        values: DOC_VIEWS,
        enumKey: "docView",
        required: true,
        inTable: true,
      },
    ],
  },
  {
    slug: "waybill-transport-type",
    group: "admission",
    icon: Truck,
    fields: [
      {
        name: "form",
        type: "enum",
        values: WAYBILL_FORMS,
        enumKey: "form",
        required: true,
        inTable: true,
      },
      {
        name: "vehicleKind",
        type: "enum",
        values: VEHICLE_KINDS,
        enumKey: "vehicleKind",
        visibleWhen: isForm1AD,
        inTable: true,
      },
      { name: "transportType", type: "text", required: true, inTable: true },
    ],
  },
  {
    slug: "waybill-driver-category",
    group: "admission",
    icon: UserCheck,
    fields: [
      {
        name: "form",
        type: "enum",
        values: WAYBILL_FORMS,
        enumKey: "form",
        required: true,
        inTable: true,
      },
      {
        name: "vehicleKind",
        type: "enum",
        values: VEHICLE_KINDS,
        enumKey: "vehicleKind",
        visibleWhen: isForm1AD,
        inTable: true,
      },
      {
        name: "withTrailer",
        type: "boolean",
        visibleWhen: isTrailerForm,
        inTable: true,
      },
      {
        name: "category",
        label: "atls.fields.driverCategory",
        type: "enum",
        values: DRIVER_CATEGORIES,
        required: true,
        inTable: true,
      },
    ],
  },
  {
    slug: "waybill-norm",
    group: "admission",
    icon: CalendarRange,
    fields: [
      {
        name: "form",
        type: "enum",
        values: WAYBILL_FORMS,
        enumKey: "form",
        required: true,
        inTable: true,
      },
      { name: "waybillsPerMonth", type: "number", required: true, inTable: true },
    ],
  },
];

export const findAtlsReference = (slug?: string) =>
  ATLS_REFERENCES.find((reference) => reference.slug === slug);

export const getAtlsReferencePath = (slug: string) =>
  `/references/atls/${slug}`;
