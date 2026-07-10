import { useParams } from "react-router";
import { useState } from "react";
import ComponentCard from "@components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { TablePagination } from "@mui/material";
import { useGetCompanyTransportsQuery } from "@pages/Company/api/api";
import { TTransport, TTransportResponse } from "@pages/Transport/types/types";
import { useLocalization } from "@hooks/useLocalization";
import { useModal } from "@hooks/useModal";
import { Modal } from "@components/ui/modal";
import { Eye } from "lucide-react";
import Button from "@components/ui/button/Button";

const ViewTransportCompany = () => {
  const { id } = useParams();
  const entityId = String(id);
  const { t } = useLocalization();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data: transportCompanies } = useGetCompanyTransportsQuery({
    id: entityId,
    page: currentPage,
    limit: itemsPerPage,
  });

  const transportCompaniesList: TTransport[] =
    (transportCompanies as TTransportResponse)?.content || [];
  const totalCount =
    (transportCompanies as TTransportResponse)?.meta?.totalCount || 0;

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedTransport, setSelectedTransport] = useState<TTransport | null>(
    null,
  );

  const handleEyeClick = (transport: TTransport) => {
    setSelectedTransport(transport);
    openModal();
  };

  return (
    <>
      <ComponentCard title={t("subject.company.transport.title")}>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
          <Table className="w-full">
            <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
              <TableRow className="bg-gray-100 dark:bg-gray-800">
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  № 
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  {t("subject.company.transport.licence_plate")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  {t("subject.company.transport.model")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  {t("subject.company.transport.type")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  {t("subject.company.transport.owner")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-end text-theme-xs dark:text-gray-300"
                >
                  Дейтвие
                </TableCell>
              </TableRow>
            </TableHeader>

            {transportCompaniesList.length > 0 ? (
              <TableBody>
                {transportCompaniesList.map((transport, index) => (
                  <TableRow
                    key={transport.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {transport.LicensePlate}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {transport.CarBrand}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {transport.Type}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {transport.Owner}
                    </TableCell>
                    <TableCell className="flex justify-end px-5 py-4 sm:px-6">
                      <Eye
                        onClick={() => handleEyeClick(transport)}
                        className="w-6 h-6 text-gray-600 hover:text-green-500 dark:hover:text-green-500 hover:cursor-pointer dark:text-gray-300"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <div>
                <p className="p-5 text-gray-500 sm:px-6">
                  {t("subject.company.transport.nodata")}
                </p>
              </div>
            )}
          </Table>

          {transportCompaniesList.length > 0 && (
            <TablePagination
              className="table-pagination"
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalCount}
              rowsPerPage={itemsPerPage}
              page={currentPage - 1}
              onPageChange={(_event, newPage) => setCurrentPage(newPage + 1)}
              onRowsPerPageChange={(event) => {
                setItemsPerPage(parseInt(event.target.value, 10));
                setCurrentPage(1);
              }}
              labelRowsPerPage={`${t("common.rows_per_page")}`}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} ${t("common.from_to")} ${count}`
              }
            />
          )}
        </div>
      </ComponentCard>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[650px]">
        <h4 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
          Просмотр транспорта:{" "}
          {selectedTransport && selectedTransport.LicensePlate}
        </h4>
        {selectedTransport && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { label: "Гос. номер", value: selectedTransport.LicensePlate },
              { label: "Марка", value: selectedTransport.CarBrand },
              { label: "Модель", value: selectedTransport.CarModel },
              { label: "Тип", value: selectedTransport.Type },
              { label: "Владелец", value: selectedTransport.Owner },
              { label: "Цвет", value: selectedTransport.Color },
              {
                label: "Год выпуска",
                value: selectedTransport.YearOfManufacture,
              },
              {
                label: "Макс. вес порожний",
                value: selectedTransport.MaxWeightUnladen,
              },
              {
                label: "Макс. вес полный",
                value: selectedTransport.MaxWeightLaden,
              },
              { label: "Тип двигателя", value: selectedTransport.EngineType },
              {
                label: "Мощность двигателя (л.с.)",
                value: selectedTransport.EnginePowerHp,
              },
              {
                label: "Мощность двигателя (кВт)",
                value: selectedTransport.EnginePowerKw,
              },
              {
                label: "Объем двигателя",
                value: selectedTransport.EngineCapacity,
              },
              {
                label: "Кол-во мест",
                value: selectedTransport.NumberOfSeats,
              },
              { label: "VIN", value: selectedTransport.Vin },
              {
                label: "Серия паспорта",
                value: selectedTransport.RegistrationCertificateSeries,
              },
              { label: "Номер кузова", value: selectedTransport.BodyNo },
              { label: "Тип кузова", value: selectedTransport.BodyType },
              { label: "Телефон", value: selectedTransport.Phone },
            ].map((field) => (
              <div key={field.label} className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={field.value || ""}
                  readOnly
                  className="px-3 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={closeModal}>
            Закрыть
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ViewTransportCompany;
