// Отчёты ведомства (Swagger atls-waybill-report)

export type TReportColumnKind = "text" | "number" | "form" | "datetime" | "result";

export type TReportColumn = { key: string; kind: TReportColumnKind };

export type TReportFilter = "form" | "company" | "groupBy" | "kind" | "result";

type TContent = Record<string, unknown>;

export type TReportConfig = {
  slug: string;
  /** date — период датами; month — месяцами ГГГГ-ММ */
  period: "date" | "month";
  filters: TReportFilter[];
  columns: TReportColumn[];
  /** Журнал осмотров приходит постранично: content — массив, meta — счётчик */
  paginated?: boolean;
  /** Строка «Итого» из ответа */
  getTotal?: (content: TContent) => TContent | undefined;
};

const n = (key: string): TReportColumn => ({ key, kind: "number" });
const s = (key: string): TReportColumn => ({ key, kind: "text" });
const FORM: TReportColumn = { key: "form", kind: "form" };

export const ATLS_REPORTS: TReportConfig[] = [
  {
    slug: "waybill-count",
    period: "date",
    filters: ["form", "company"],
    columns: [
      s("companyName"),
      FORM,
      n("issued"),
      n("closed"),
      n("rejected"),
      n("cancelled"),
      n("transports"),
      n("issuedLastYear"),
      n("closedLastYear"),
    ],
    getTotal: (content) => content.total as TContent | undefined,
  },
  {
    slug: "waybills-per-vehicle",
    period: "month",
    filters: ["form", "company"],
    columns: [
      s("companyName"),
      FORM,
      n("vehicles"),
      n("issued"),
      n("perVehicle"),
      n("norm"),
      n("months"),
      n("expected"),
      n("deviation"),
    ],
    getTotal: (content) => ({
      vehicles: content.totalVehicles,
      issued: content.totalIssued,
      expected: content.totalExpected,
      deviation: content.totalDeviation,
    }),
  },
  {
    slug: "mileage",
    period: "date",
    filters: ["groupBy", "form", "company"],
    columns: [s("subjectName"), s("companyName"), FORM, n("waybills"), n("mileage")],
    getTotal: (content) => ({
      waybills: content.totalWaybills,
      mileage: content.totalMileage,
    }),
  },
  {
    slug: "inspection-journal",
    period: "date",
    filters: ["kind", "result", "company"],
    paginated: true,
    columns: [
      { key: "inspectedAt", kind: "datetime" },
      s("number"),
      FORM,
      s("companyName"),
      s("transportLicensePlate"),
      s("driverName"),
      s("inspectorName"),
      { key: "result", kind: "result" },
      s("note"),
    ],
  },
  {
    slug: "cargo",
    period: "date",
    filters: ["form", "company"],
    columns: [
      s("companyName"),
      FORM,
      n("waybills"),
      n("transports"),
      n("mileage"),
      n("notes"),
      n("tonnes"),
      n("trips"),
      n("turnover"),
    ],
    getTotal: (content) => content.total as TContent | undefined,
  },
];

export const findAtlsReport = (slug?: string) =>
  ATLS_REPORTS.find((report) => report.slug === slug);

export const getAtlsReportPath = (slug: string) => `/reports/atls/${slug}`;
