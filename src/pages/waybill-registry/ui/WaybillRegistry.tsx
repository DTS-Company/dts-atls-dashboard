import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { RotateCcw } from "lucide-react";
import { TablePagination } from "@mui/material";
import PageBreadcrumb from "@shared/ui/PageBreadCrumb";
import ComponentCard from "@shared/ui/ComponentCard";
import PageMeta from "@shared/ui/PageMeta";
import {
  Table, TableBody, TableCell, TableHeader, TableRow, } from "@shared/ui/table/Table";
import Input from "@shared/ui/form/InputField";
import Select from "@shared/ui/form/Select";
import Label from "@shared/ui/form/Label";
import Button from "@shared/ui/button/Button";
import { useLocalization } from "@shared/lib/useLocalization";
import { getApiErrorMessage } from "@shared/lib/getApiErrorMessage";
import { formatDateTime, formatNumber } from "@shared/lib/atlsFormat";
import {
  TABLE_NOTE_CLASS, TABLE_WRAP_CLASS, TD_CLASS, TH_CLASS, TR_CLICKABLE_CLASS } from "@shared/ui/table/styles";
import { AtlsReferenceSelect, SOURCES } from "@entities/reference";
import { WAYBILL_FORMS, WAYBILL_STATUSES, } from "@shared/config/enums";
import {
  useGetAtlsWaybillsQuery,
  findWaybillMenu,
  getWaybillCardPath,
  WaybillStatusBadge,
  FormTag,
  PlateNumber,
} from "@entities/waybill";
import { WaybillStats, OVERDUE_DAYS, TWaybillStatKey } from "@widgets/waybill-stats";

const DEFAULT_PAGE_SIZE = 30;

const EMPTY_FILTERS = {
  form: "",
  status: "",
  companyId: "",
  transportId: "",
  exitFrom: "",
  exitTo: "",
  openLongerThanDays: "",
};

type TFilters = typeof EMPTY_FILTERS;

/** Какая карточка статистики соответствует текущим фильтрам */
const getActiveStat = (filters: TFilters): TWaybillStatKey | null => {
  const { status, openLongerThanDays } = filters;
  if (!status && !openLongerThanDays) return "all";
  if (!status && openLongerThanDays === OVERDUE_DAYS) return "overdue";
  if (!openLongerThanDays && (status === "IN_INSPECTION" || status === "ADMITTED")) {
    return status;
  }
  return null;
};

const WaybillRegistryView = ({ fixedForm }: { fixedForm: string }) => {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TFilters>(EMPTY_FILTERS);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);

  const { data, error, isFetching } = useGetAtlsWaybillsQuery({
    ...filters,
    form: fixedForm || filters.form,
    page,
    size,
  });
  const items = data?.items ?? [];
  const totalCount = data?.meta.totalCount ?? 0;

  const updateFilters = (patch: Partial<TFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(0);
  };

  const selectStat = (key: TWaybillStatKey) => {
    if (key === "all") updateFilters({ status: "", openLongerThanDays: "" });
    else if (key === "overdue") updateFilters({ status: "", openLongerThanDays: OVERDUE_DAYS });
    else updateFilters({ status: key, openLongerThanDays: "" });
  };

  const enumOptions = (values: readonly string[], enumKey: string) => [
    { value: "", label: t("atls.common.all_values") },
    ...values.map((value) => ({
      value,
      label: t(`atls.enums.${enumKey}.${value}`),
    })),
  ];

  return (
    <div className="space-y-6">
      <WaybillStats
        form={fixedForm || filters.form}
        active={getActiveStat(filters)}
        onSelect={selectStat}
      />

      <ComponentCard
        title={t("atls.waybills.registry")}
        desc={t("atls.waybills.registry_hint")}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {!fixedForm && (
            <div>
              <Label>{t("atls.fields.form")}</Label>
              <Select
                value={filters.form}
                onChange={(value) => updateFilters({ form: value })}
                options={enumOptions(WAYBILL_FORMS, "form")}
              />
            </div>
          )}
          <div>
            <Label>{t("atls.waybills.fields.status")}</Label>
            <Select
              value={filters.status}
              onChange={(value) => updateFilters({ status: value })}
              options={enumOptions(WAYBILL_STATUSES, "waybillStatus")}
            />
          </div>
          <div>
            <Label>{t("atls.waybills.filters.exitFrom")}</Label>
            <Input
              type="date"
              value={filters.exitFrom}
              onChange={(e) => updateFilters({ exitFrom: e.target.value })}
            />
          </div>
          <div>
            <Label>{t("atls.waybills.filters.exitTo")}</Label>
            <Input
              type="date"
              value={filters.exitTo}
              onChange={(e) => updateFilters({ exitTo: e.target.value })}
            />
          </div>
          <div>
            <Label>{t("atls.waybills.filters.openLongerThanDays")}</Label>
            <Input
              type="number"
              min="1"
              value={filters.openLongerThanDays}
              onChange={(e) => updateFilters({ openLongerThanDays: e.target.value })}
            />
          </div>
          <div>
            <Label>{t("atls.fields.companyId")}</Label>
            <AtlsReferenceSelect
              source={SOURCES.company}
              value={filters.companyId}
              onChange={(value) => updateFilters({ companyId: value })}
            />
          </div>
          <div>
            <Label>{t("atls.fields.transportId")}</Label>
            <AtlsReferenceSelect
              source={SOURCES.transport}
              value={filters.transportId}
              onChange={(value) => updateFilters({ transportId: value })}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              startIcon={<RotateCcw size={16} />}
              onClick={() => {
                setFilters(EMPTY_FILTERS);
                setPage(0);
              }}
            >
              {t("atls.common.reset")}
            </Button>
          </div>
        </div>

        {error ? (
          <div className="text-sm text-error-500">{getApiErrorMessage(error)}</div>
        ) : null}

        <div className={TABLE_WRAP_CLASS}>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableCell isHeader className={TH_CLASS}>
                    {t("atls.waybills.fields.number")}
                  </TableCell>
                  {!fixedForm && (
                    <TableCell isHeader className={TH_CLASS}>
                      {t("atls.fields.form")}
                    </TableCell>
                  )}
                  <TableCell isHeader className={TH_CLASS}>
                    {t("atls.waybills.fields.status")}
                  </TableCell>
                  <TableCell isHeader className={TH_CLASS}>
                    {t("atls.waybills.fields.companyName")}
                  </TableCell>
                  <TableCell isHeader className={TH_CLASS}>
                    {t("atls.waybills.fields.transport")}
                  </TableCell>
                  <TableCell isHeader className={TH_CLASS}>
                    {t("atls.waybills.fields.driverName")}
                  </TableCell>
                  <TableCell isHeader className={TH_CLASS}>
                    {t("atls.waybills.fields.exitDate")}
                  </TableCell>
                  <TableCell isHeader className={TH_CLASS}>
                    {t("atls.waybills.fields.entryDate")}
                  </TableCell>
                  <TableCell isHeader className={`${TH_CLASS} !text-end`}>
                    {t("atls.waybills.fields.mileage")}
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((waybill) => (
                  <tr
                    key={waybill.id}
                    onClick={() => navigate(getWaybillCardPath(waybill.id))}
                    className={TR_CLICKABLE_CLASS}
                  >
                    <TableCell className={`${TD_CLASS} font-semibold text-gray-700 dark:text-white whitespace-nowrap`}>
                      {waybill.number || "—"}
                    </TableCell>
                    {!fixedForm && (
                      <TableCell className={TD_CLASS}>
                        <FormTag form={waybill.form} />
                      </TableCell>
                    )}
                    <TableCell className={TD_CLASS}>
                      <WaybillStatusBadge value={waybill.status} />
                    </TableCell>
                    <TableCell className={`${TD_CLASS} font-semibold text-gray-700 dark:text-white`}>
                      {waybill.companyName || "—"}
                    </TableCell>
                    <TableCell className={TD_CLASS}>
                      <PlateNumber value={waybill.transportLicensePlate} />
                      <span className="mt-1 block text-[12px] text-gray-500 dark:text-gray-400">
                        {[waybill.transportBrand, waybill.transportModel].filter(Boolean).join(" ")}
                      </span>
                    </TableCell>
                    <TableCell className={TD_CLASS}>
                      {waybill.driverName || "—"}
                    </TableCell>
                    <TableCell className={`${TD_CLASS} whitespace-nowrap tabular-nums`}>
                      {formatDateTime(waybill.exitDate)}
                    </TableCell>
                    <TableCell className={`${TD_CLASS} whitespace-nowrap tabular-nums`}>
                      {formatDateTime(waybill.entryDate)}
                    </TableCell>
                    <TableCell className={`${TD_CLASS} !text-end tabular-nums`}>
                      {formatNumber(waybill.mileage)}
                    </TableCell>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>
          {!isFetching && items.length === 0 && (
            <div className={TABLE_NOTE_CLASS}>{t("atls.common.empty")}</div>
          )}
          {isFetching && <div className={TABLE_NOTE_CLASS}>{t("atls.common.loading")}</div>}
          <TablePagination
            className="table-pagination"
            rowsPerPageOptions={[10, 30, 50, 100]}
            component="div"
            count={totalCount}
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
        </div>
      </ComponentCard>
    </div>
  );
};

const WaybillRegistry = () => {
  const { formSlug } = useParams();
  const { t } = useLocalization();
  const menuItem = findWaybillMenu(formSlug);

  if (!menuItem) return <Navigate to="/" replace />;

  const title = t(`atls.waybills.menu.${menuItem.slug}`);
  return (
    <>
      <PageMeta title={title} description="" />
      <PageBreadcrumb pageTitle={title} />
      {/* key сбрасывает фильтры при переходе на другую форму */}
      <WaybillRegistryView key={menuItem.slug} fixedForm={menuItem.form} />
    </>
  );
};

export default WaybillRegistry;
