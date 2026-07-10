import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { useGetBlanksStatsQuery } from "../api/api";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";
import { useState } from "react";
import { TablePagination } from "@mui/material";

const DozvolBlankStats = () => {
  const { data: blanksstatsList = [] } = useGetBlanksStatsQuery({});
  const { t } = useLocalization();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalCount = blanksstatsList.length || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = blanksstatsList.slice(startIndex, endIndex);

  return (
    <>
      <PageMeta title={t("permits_awailable.title")} description="" />
      <PageBreadcrumb
        pageTitle={
          <>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/permits"
            >
              {t("permits.breadcrum")}
              <ChevronRight size={18} />
            </Link>
            {t("permits_awailable.title")}
          </>
        }
      />
      <ComponentCard title={t("permits_awailable.title")}>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
                <TableRow className="bg-gray-100 dark:bg-gray-800">
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("permits_awailable.country")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("permits_awailable.permits_type")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("permits_awailable.count")}
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!blanksstatsList || blanksstatsList.length === 0 ? (
                  <TableRow>
                    <TableCell className="pl-5 py-4 text-gray-500 dark:text-white/70">
                      {t("permits_awailable.nodata")}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((blanksstats) => (
                    <TableRow
                      key={blanksstats.id}
                      className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block text-sm text-gray-600 dark:text-white/70">
                          {blanksstats.country_FullName}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block text-sm text-gray-600 dark:text-white/70">
                          {blanksstats.permit_type_FullName}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block text-sm text-gray-600 dark:text-white/70">
                          {blanksstats.cnt}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {blanksstatsList && blanksstatsList.length > 0 && (
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
    </>
  );
};

export default DozvolBlankStats;
