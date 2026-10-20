import { ReactNode } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import PageBreadcrumb from "@shared/ui/PageBreadCrumb";
import ComponentCard from "@shared/ui/ComponentCard";
import PageMeta from "@shared/ui/PageMeta";
import {
  Table, TableBody, TableCell, TableHeader, TableRow, } from "@shared/ui/table/Table";
import Button from "@shared/ui/button/Button";
import { useLocalization } from "@shared/lib/useLocalization";
import { getApiErrorMessage } from "@shared/lib/getApiErrorMessage";
import { formatDate, formatDateTime, formatNumber } from "@shared/lib/atlsFormat";
import { TABLE_WRAP_CLASS, TD_CLASS, TH_CLASS, TR_CLASS } from "@shared/ui/table/styles";
import {
  useGetAtlsWaybillCardQuery,
  TWaybill,
  WaybillStatusBadge,
  FormTag,
  PlateNumber,
} from "@entities/waybill";


const text = (value: unknown) =>
  value === null || value === undefined || value === "" ? "—" : String(value);

/** Подпись и значение в сетке карточки */
const InfoGrid = ({ items }: { items: [string, ReactNode][] }) => (
  <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
    {items.map(([label, value]) => (
      <div key={label}>
        <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </dt>
        <dd className="mt-1 text-sm font-semibold text-gray-700 dark:text-white">
          {value}
        </dd>
      </div>
    ))}
  </dl>
);

/** Простая таблица: заголовки и строки уже отформатированных значений */
const SimpleTable = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: { key: string; cells: ReactNode[] }[];
}) => (
  <div className={`${TABLE_WRAP_CLASS} overflow-x-auto`}>
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableCell key={header} isHeader className={TH_CLASS}>
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.key} className={TR_CLASS}>
            {row.cells.map((cell, index) => (
              <TableCell key={headers[index]} className={`${TD_CLASS} whitespace-nowrap`}>
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const WaybillCard = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { t } = useLocalization();
  const { data, error, isLoading } = useGetAtlsWaybillCardQuery(id, {
    skip: !id,
  });

  const f = (name: string) => t(`atls.waybills.fields.${name}`);
  const title = data
    ? `${t("atls.waybills.card")} № ${text(data.waybill.number)}`
    : t("atls.waybills.card");

  const renderInspection = (
    name: string | null,
    result: string | null,
    note: string | null,
    at: string | null,
  ) => (
    <InfoGrid
      items={[
        [f("inspector"), text(name)],
        [f("result"), <WaybillStatusBadge value={result} enumKey="inspectionResult" />],
        [f("inspectedAt"), formatDateTime(at)],
        [f("note"), text(note)],
      ]}
    />
  );

  const renderMain = (waybill: TWaybill) => (
    <InfoGrid
      items={[
        [t("atls.fields.form"), <FormTag form={waybill.form} />],
        [f("status"), <WaybillStatusBadge value={waybill.status} />],
        [f("companyName"), text(waybill.companyName)],
        [
          f("transport"),
          <span className="inline-flex flex-wrap items-center gap-2">
            <PlateNumber value={waybill.transportLicensePlate} />
            {[waybill.transportBrand, waybill.transportModel].filter(Boolean).join(" ")}
          </span>,
        ],
        [f("driverName"), text(waybill.driverName)],
        [f("secondDriverName"), text(waybill.secondDriverName)],
        [f("clientName"), text(waybill.clientName)],
        [f("route"), text([waybill.routeNumber, waybill.routeName].filter(Boolean).join(" "))],
        [f("directionName"), text(waybill.directionName)],
        [f("cargoTitle"), text(waybill.cargoTitle)],
        [f("numberLap"), text(waybill.numberLap)],
        [f("arrivalTime"), formatDateTime(waybill.arrivalTime)],
        [f("specialMark"), text(waybill.specialMark)],
        [f("createdAt"), formatDateTime(waybill.createdAt)],
      ]}
    />
  );

  const renderTrip = (waybill: TWaybill) => (
    <InfoGrid
      items={[
        [f("exitDate"), formatDateTime(waybill.exitDate)],
        [f("indicationCounterExit"), formatNumber(waybill.indicationCounterExit)],
        [f("entryDate"), formatDateTime(waybill.entryDate)],
        [f("indicationCounterEntry"), formatNumber(waybill.indicationCounterEntry)],
        [f("mileage"), formatNumber(waybill.mileage)],
        [f("closedAt"), formatDateTime(waybill.closedAt)],
      ]}
    />
  );

  if (isLoading) return <div>{t("atls.common.loading")}</div>;

  const waybill = data?.waybill;
  const workDays = data?.workDays ?? [];
  const cargoNotes = data?.cargoNotes ?? [];
  const fuels = waybill?.fuels ?? [];
  const extraFields = Object.entries(waybill?.fields ?? {});
  const workDayDates = new Map(workDays.map((day) => [day.id, formatDate(day.date)]));

  return (
    <>
      <PageMeta title={title} description="" />
      <PageBreadcrumb pageTitle={title} />
      <div className="mb-4">
        <Button
          size="sm"
          variant="outline"
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate(-1)}
        >
          {t("atls.common.back")}
        </Button>
      </div>

      {error ? (
        <div className="text-error-500">{getApiErrorMessage(error)}</div>
      ) : null}

      {waybill && (
        <div className="space-y-6">
          <ComponentCard title={title}>{renderMain(waybill)}</ComponentCard>

          <ComponentCard title={t("atls.waybills.sections.trip")}>
            {renderTrip(waybill)}
          </ComponentCard>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ComponentCard title={t("atls.waybills.sections.medical")}>
              {renderInspection(
                waybill.doctorName,
                waybill.doctorResult,
                waybill.doctorNote,
                waybill.doctorAt,
              )}
            </ComponentCard>
            <ComponentCard title={t("atls.waybills.sections.technical")}>
              {renderInspection(
                waybill.mechanicName,
                waybill.mechanicResult,
                waybill.mechanicNote,
                waybill.mechanicAt,
              )}
            </ComponentCard>
          </div>

          {fuels.length > 0 && (
            <ComponentCard title={t("atls.waybills.sections.fuel")}>
              <SimpleTable
                headers={[
                  f("fuelKind"),
                  f("remainBeforeExit"),
                  f("fuelGiven"),
                  f("remainEntry"),
                ]}
                rows={fuels.map((fuel) => ({
                  key: fuel.fuelKind,
                  cells: [
                    t(`atls.enums.fuelType.${fuel.fuelKind}`),
                    formatNumber(fuel.remainBeforeExit),
                    formatNumber(fuel.fuelGiven),
                    formatNumber(fuel.remainEntry),
                  ],
                }))}
              />
            </ComponentCard>
          )}

          {extraFields.length > 0 && (
            <ComponentCard title={t("atls.waybills.sections.formFields")}>
              <InfoGrid
                items={extraFields.map(([name, value]) => [name, text(value)])}
              />
            </ComponentCard>
          )}

          {workDays.length > 0 && (
            <ComponentCard title={t("atls.waybills.sections.workDays")}>
              <SimpleTable
                headers={[
                  f("date"),
                  f("exitTime"),
                  f("entryTime"),
                  f("workTime"),
                  f("indicationCounterExit"),
                  f("indicationCounterEntry"),
                  f("mileage"),
                ]}
                rows={workDays.map((day) => ({
                  key: day.id,
                  cells: [
                    formatDate(day.date),
                    text(day.exitTime),
                    text(day.entryTime),
                    text(day.workTime),
                    formatNumber(day.indicationCounterExit),
                    formatNumber(day.indicationCounterEntry),
                    formatNumber(day.mileage),
                  ],
                }))}
              />
            </ComponentCard>
          )}

          {cargoNotes.length > 0 && (
            <ComponentCard title={t("atls.waybills.sections.cargoNotes")}>
              <SimpleTable
                headers={[
                  f("noteNumber"),
                  f("noteType"),
                  f("date"),
                  f("workDay"),
                  f("clientName"),
                  f("senderName"),
                  f("receiverName"),
                  f("forwarderName"),
                  f("cargoName"),
                  f("cargoAmount"),
                  f("reisAmount"),
                  f("distance"),
                  f("cargoCapacity"),
                  f("entryTime"),
                  f("distanceSpecialWork"),
                ]}
                rows={cargoNotes.map((note) => ({
                  key: note.id,
                  cells: [
                    text(note.number),
                    note.type ? t("atls.waybills.appendix", { number: note.type }) : "—",
                    formatDate(note.date),
                    note.workDayId ? (workDayDates.get(note.workDayId) ?? "—") : "—",
                    text(note.clientName),
                    text(note.senderName),
                    text(note.receiverName),
                    text(note.forwarderName),
                    text(note.cargoName),
                    formatNumber(note.cargoAmount),
                    formatNumber(note.reisAmount),
                    formatNumber(note.distance),
                    formatNumber(note.cargoCapacity),
                    text(note.entryTime),
                    formatNumber(note.distanceSpecialWork),
                  ],
                }))}
              />
            </ComponentCard>
          )}
        </div>
      )}
    </>
  );
};

export default WaybillCard;
