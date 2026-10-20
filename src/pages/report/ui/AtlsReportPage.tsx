import { ReactNode, useState } from "react";
import { Navigate, useParams } from "react-router";
import { TablePagination } from "@mui/material";
import PageBreadcrumb from "@shared/ui/PageBreadCrumb";
import ComponentCard from "@shared/ui/ComponentCard";
import PageMeta from "@shared/ui/PageMeta";
import {
  Table, TableBody, TableCell, TableHeader, TableRow, } from "@shared/ui/table/Table";
import Input from "@shared/ui/form/InputField";
import Select from "@shared/ui/form/Select";
import Label from "@shared/ui/form/Label";
import { useLocalization } from "@shared/lib/useLocalization";
import { getApiErrorMessage } from "@shared/lib/getApiErrorMessage";
import {
  TABLE_BAND_BG, TABLE_NOTE_CLASS, TABLE_WRAP_CLASS, TD_CLASS, TH_CLASS, TR_CLASS, } from "@shared/ui/table/styles";
import {
  currentMonthInputValue, formatDateTime, formatNumber, monthStartInputValue, todayInputValue } from "@shared/lib/atlsFormat";
import { AtlsReferenceSelect, SOURCES } from "@entities/reference";
import { INSPECTION_KINDS, INSPECTION_RESULTS, MILEAGE_GROUP_BY, WAYBILL_FORMS, } from "@shared/config/enums";
import {
  useGetAtlsReportQuery,
  findAtlsReport,
  TReportColumn,
  TReportConfig,
} from "@entities/report";
import { WaybillStatusBadge } from "@entities/waybill";
import { DownloadReportExcelButton } from "@features/download-report-excel";

const DEFAULT_PAGE_SIZE = 30;

type TRow = Record<string, unknown>;

const getInitialFilters = (report: TReportConfig) => ({
  from: report.period === "month" ? currentMonthInputValue() : monthStartInputValue(),
  to: report.period === "month" ? currentMonthInputValue() : todayInputValue(),
  form: "",
  companyId: "",
  groupBy: "TRANSPORT",
  kind: "MEDICAL",
  result: "",
});

type TFilters = ReturnType<typeof getInitialFilters>;

/** Параметры запроса: только фильтры, которые есть у отчёта */
const buildParams = (report: TReportConfig, filters: TFilters) => ({
  from: filters.from,
  to: filters.to,
  ...(report.filters.includes("form") ? { form: filters.form } : {}),
  ...(report.filters.includes("company") ? { companyId: filters.companyId } : {}),
  ...(report.filters.includes("groupBy") ? { groupBy: filters.groupBy } : {}),
  ...(report.filters.includes("kind") ? { kind: filters.kind } : {}),
  ...(report.filters.includes("result") ? { result: filters.result } : {}),
});

const AtlsReportView = ({ report }: { report: TReportConfig }) => {
  const { t } = useLocalization();
  const [filters, setFilters] = useState(() => getInitialFilters(report));
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);

  const params = buildParams(report, filters);
  const { data, error, isFetching } = useGetAtlsReportQuery(
    {
      slug: report.slug,
      params: report.paginated ? { ...params, page, size } : params,
    },
    { skip: !filters.from || !filters.to },
  );

  const content = (data?.content ?? {}) as Record<string, unknown>;
  const rows = (
    report.paginated ? (data?.content ?? []) : (content.lines ?? [])
  ) as TRow[];
  const total = report.paginated ? undefined : report.getTotal?.(content);

  const setFilter = (name: keyof TFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const getColumnLabel = (column: TReportColumn) =>
    column.key === "subjectName"
      ? t(`atls.reports.columns.subject_${filters.groupBy}`)
      : t(`atls.reports.columns.${column.key}`);

  const formatCell = (column: TReportColumn, value: unknown): ReactNode => {
    if (value === null || value === undefined || value === "") return "—";
    switch (column.kind) {
      case "number":
        return formatNumber(value);
      case "form":
        return t(`atls.enums.form.${value}`);
      case "datetime":
        return formatDateTime(value);
      case "result":
        return <WaybillStatusBadge value={String(value)} enumKey="inspectionResult" />;
      default:
        return String(value);
    }
  };

  const enumSelect = (
    name: "form" | "groupBy" | "kind" | "result",
    values: readonly string[],
    enumKey: string,
    withAll: boolean,
  ) => (
    <Select
      value={filters[name]}
      onChange={(value) => setFilter(name, value)}
      options={[
        ...(withAll ? [{ value: "", label: t("atls.common.all_values") }] : []),
        ...values.map((value) => ({
          value,
          label: t(`atls.enums.${enumKey}.${value}`),
        })),
      ]}
    />
  );

  const periodType = report.period === "month" ? "month" : "date";

  return (
    <ComponentCard title={t(`atls.reports.titles.${report.slug}`)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <Label>{t("atls.reports.filters.from")}</Label>
          <Input
            type={periodType}
            value={filters.from}
            onChange={(e) => setFilter("from", e.target.value)}
          />
        </div>
        <div>
          <Label>{t("atls.reports.filters.to")}</Label>
          <Input
            type={periodType}
            value={filters.to}
            onChange={(e) => setFilter("to", e.target.value)}
          />
        </div>
        {report.filters.includes("kind") && (
          <div>
            <Label>{t("atls.reports.filters.kind")}</Label>
            {enumSelect("kind", INSPECTION_KINDS, "inspectionKind", false)}
          </div>
        )}
        {report.filters.includes("groupBy") && (
          <div>
            <Label>{t("atls.reports.filters.groupBy")}</Label>
            {enumSelect("groupBy", MILEAGE_GROUP_BY, "mileageGroupBy", false)}
          </div>
        )}
        {report.filters.includes("result") && (
          <div>
            <Label>{t("atls.reports.filters.result")}</Label>
            {enumSelect("result", INSPECTION_RESULTS, "inspectionResult", true)}
          </div>
        )}
        {report.filters.includes("form") && (
          <div>
            <Label>{t("atls.fields.form")}</Label>
            {enumSelect("form", WAYBILL_FORMS, "form", true)}
          </div>
        )}
        {report.filters.includes("company") && (
          <div>
            <Label>{t("atls.fields.companyId")}</Label>
            <AtlsReferenceSelect
              source={SOURCES.company}
              value={filters.companyId}
              onChange={(value) => setFilter("companyId", value)}
            />
          </div>
        )}
        <div className="flex items-end">
          <DownloadReportExcelButton
            slug={report.slug}
            params={params}
            fileName={`${report.slug}_${filters.from}_${filters.to}.xlsx`}
            disabled={!filters.from || !filters.to}
          />
        </div>
      </div>

      {report.period === "month" && (
        <p className="text-theme-xs text-gray-500 dark:text-gray-400">
          {t("atls.reports.month_hint")}
        </p>
      )}

      {error ? (
        <div className="text-error-500">{getApiErrorMessage(error)}</div>
      ) : null}

      <div className={TABLE_WRAP_CLASS}>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {report.columns.map((column) => (
                  <TableCell key={column.key} isHeader className={TH_CLASS}>
                    {getColumnLabel(column)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  className={TR_CLASS}
                >
                  {report.columns.map((column) => (
                    <TableCell key={column.key} className={TD_CLASS}>
                      {formatCell(column, row[column.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {total && rows.length > 0 && (
                <TableRow className={TABLE_BAND_BG}>
                  {report.columns.map((column, index) => (
                    <TableCell key={column.key} className={`${TD_CLASS} font-bold text-gray-700 dark:text-white`}>
                      {index === 0
                        ? t("atls.reports.total")
                        : column.kind === "number" && total[column.key] !== undefined
                          ? formatNumber(total[column.key])
                          : ""}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {!isFetching && rows.length === 0 && (
          <div className={TABLE_NOTE_CLASS}>
            {t("atls.common.empty")}
          </div>
        )}
        {isFetching && (
          <div className={TABLE_NOTE_CLASS}>
            {t("atls.common.loading")}
          </div>
        )}
        {report.paginated && (
          <TablePagination
            className="table-pagination"
            rowsPerPageOptions={[10, 30, 50, 100]}
            component="div"
            count={data?.meta?.totalCount ?? 0}
            rowsPerPage={size}
            page={page}
            onPageChange={(_event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setSize(parseInt(event.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage={t("common.rows_per_page")}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} ${t("common.from_to")} ${count}`
            }
          />
        )}
      </div>
    </ComponentCard>
  );
};

const AtlsReportPage = () => {
  const { slug } = useParams();
  const { t } = useLocalization();
  const report = findAtlsReport(slug);

  if (!report) return <Navigate to="/" replace />;

  const title = t(`atls.reports.titles.${report.slug}`);
  return (
    <>
      <PageMeta title={title} description="" />
      <PageBreadcrumb pageTitle={title} />
      {/* key сбрасывает фильтры при переходе на другой отчёт */}
      <AtlsReportView key={report.slug} report={report} />
    </>
  );
};

export default AtlsReportPage;
