import { useParams } from "react-router";
import ComponentCard from "@components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { useGetEntrepreneurTransportsQuery } from "@pages/Entrepreneur/api/api";
import { TTransport, TTransportResponse } from "@pages/Transport/types/types";
import { useState } from "react";
import { TablePagination } from "@mui/material";
import { useLocalization } from "@hooks/useLocalization";

const ViewTransportEntrepreneur = () => {
  const { id } = useParams();
  const entityId = String(id);
  const { t } = useLocalization();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data: transportEntrepreneur } = useGetEntrepreneurTransportsQuery({
    id: entityId,
    page: currentPage - 1,
    limit: itemsPerPage,
  });

  const transportEntrepreneurList: TTransport[] =
    (transportEntrepreneur as TTransportResponse)?.content || [];
  const totalCount =
    (transportEntrepreneur as TTransportResponse)?.meta?.totalCount || 0;

  return (
    <>
      <ComponentCard title={t("subject.individual.transports_page.title")}>
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
                  {t("subject.individual.transports_page.auto_number")}
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  {t("subject.individual.transports_page.model")}
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  {t("subject.individual.transports_page.type")}
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  {t("subject.individual.transports_page.owner")}
                </TableCell>
              </TableRow>
            </TableHeader>
            {transportEntrepreneurList.length > 0 ? (
              <TableBody>
                {transportEntrepreneurList.map((transport: any, index) => (
                  <TableRow
                    key={transport.id}
                    className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {transport.LicensePlate}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {transport.CarBrand}
                      </span>
                    </TableCell>

                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {transport.Type}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {transport.Owner}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <div>
                <p className="p-5 text-gray-500 dark:text-gray-400 py-4">
                  {t("subject.individual.transports_page.nodata")}
                </p>
              </div>
            )}
          </Table>
          {transportEntrepreneurList.length > 0 ? (
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
                `${from}-${to}  ${t("common.from_to")} ${count}`
              }
            />
          ) : null}
        </div>
      </ComponentCard>
    </>
  );
};

export default ViewTransportEntrepreneur;
