import { TableLoadingAnimation } from "@components/common/TableLoadingAnimation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { useLocalization } from "@hooks/useLocalization";
import { TablePagination } from "@mui/material";
import { Eye } from "lucide-react";

interface LicenceTableProps {
  licencesList: any[];
  formDetails: any;
  statuses: any[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  handleView: (licence: any) => void;
  handleDownloadDocument: (licence: any) => void;
  entityType: "company" | "individual";
  isLoading: boolean;
}

const LicenceTable = ({
  licencesList,
  formDetails,
  statuses,
  totalCount,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
  handleView,
  entityType,
  isLoading,
}: LicenceTableProps) => {
  const { t } = useLocalization();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800">
      <div className="overflow-x-auto">
        <Table className="w-full min-w-[1000px]">
          <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
            <TableRow className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
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
                {t("licence_table.unique_num")}
              </TableCell>
              {entityType === "company" && (
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  {t("licence_table.org")}
                </TableCell>
              )}
              {entityType === "company" && (
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  {t("licence_table.rma")}
                </TableCell>
              )}
              {entityType === "company" && (
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  {t("licence_table.company_type")}
                </TableCell>
              )}
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
              >
                {entityType === "company"
                  ? t("licence_table.company")
                  : t("licence_table.rma")}
              </TableCell>
              {entityType !== "company" && (
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  {t("licence_table.fullname")}
                </TableCell>
              )}
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
              >
                {t("licence_table.status")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
              >
                {t("licence_table.city")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
              >
                {t("licence_table.create_date")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
              >
                {t("licence_table.actions")}
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableLoadingAnimation />
            ) : licencesList.length ? (
              licencesList.map((licence, index) => (
                <TableRow
                  key={licence.id}
                  className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <TableCell className="px-5 py-4 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {index + 1 + currentPage * itemsPerPage}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {licence.unique_number}
                    </span>
                  </TableCell>
                  {entityType === "company" && (
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {licence.organization || (
                          <span className="text-gray-500 italic dark:text-gray-400">
                            Не указано
                          </span>
                        )}
                      </span>
                    </TableCell>
                  )}
                  <TableCell className="px-5 py-4 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {licence.rma}
                    </span>
                  </TableCell>
                  {entityType === "company" && (
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {formDetails?.organization_type?.find(
                          (t: { id: number; value: string }) =>
                            t.id === parseInt(licence.organization_type),
                        )?.value ||
                          licence.organization_type || (
                            <span className="text-gray-500 italic dark:text-gray-400">
                              Не указано
                            </span>
                          )}
                      </span>
                    </TableCell>
                  )}
                  {entityType !== "company" && (
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {licence.name} {licence.surname}
                      </span>
                    </TableCell>
                  )}

                  {entityType === "company" && (
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {formDetails?.legal_entity?.find(
                          (e: { id: number; value: string }) =>
                            e.id === parseInt(licence.legal_entity),
                        )?.value ||
                          licence.legal_entity || (
                            <span className="text-gray-500 italic dark:text-gray-400">
                              Не указано
                            </span>
                          )}
                      </span>
                    </TableCell>
                  )}

                  <TableCell className="px-5 py-4 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {statuses?.find((s) => s.id === licence.status)?.title ||
                        licence.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {licence.city}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {new Date(licence.created_at).toLocaleDateString("ru-RU")}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Eye
                      size={24}
                      onClick={() => handleView(licence)}
                      className=" cursor-pointer hover:text-green-500 transition"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <div className="p-3">
                <p className="text-gray-500 dark:text-gray-400 whitespace-nowrap text-sm sm:text-base">
                  {t("licence_table.nodata")}
                </p>
              </div>
            )}
          </TableBody>
        </Table>
      </div>

      {totalCount > 0 && (
        <TablePagination
          className="table-pagination"
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={itemsPerPage}
          page={currentPage}
          onPageChange={(_event, newPage) => setCurrentPage(newPage)}
          onRowsPerPageChange={(event) => {
            const newSize = parseInt(event.target.value, 10);
            setItemsPerPage(newSize);
            setCurrentPage(0);
          }}
          labelRowsPerPage={`${t("common.rows_per_page")}`}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} ${t("common.from_to")} ${count}`
          }
          SelectProps={{
            className:
              "bg-white dark:bg-gray-600 text-gray-900 dark:text-white",
          }}
        />
      )}
    </div>
  );
};

export default LicenceTable;
