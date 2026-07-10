import { useState } from "react";
import { useGetTrafficIntensityQuery } from "../api/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { TablePagination } from "@mui/material";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const TrafficIntensityTable = () => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [loadData, setLoadData] = useState(false);
  const { t } = useLocalization();

  const { data, isLoading } = useGetTrafficIntensityQuery(
    { date, page: currentPage, size: itemsPerPage },
    { skip: !loadData },
  );
  const totalCount = data?.meta?.totalCount || 0;

  return (
    <div>
      <PageMeta title={t("reports.traffic_intensity.title")} description="" />
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t("reports.traffic_intensity.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("reports.traffic_intensity.header")}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("reports.traffic_intensity.date")}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setLoadData(false);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <button
              onClick={() => setLoadData(true)}
              className="px-4 py-[10px] bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
            >
              {t("reports.traffic_intensity.show_data")}
            </button>
          </div>
        </div>

        {!isLoading && data && data.content.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <Table className="w-full min-w-[600px]">
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
                      {t("reports.traffic_intensity.check_point")}
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                    >
                      {t("reports.traffic_intensity.licence_plate")}
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                    >
                      {t("reports.traffic_intensity.time")}
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                    >
                      {t("reports.traffic_intensity.speed")}
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                    >
                      {t("reports.traffic_intensity.transport_type")}
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.content.map((record, index) => (
                    <TableRow
                      key={`${record.plateNumber}-${record.time}-${index}`}
                      className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 dark:text-white">
                        {index + 1 + currentPage * itemsPerPage}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 dark:text-gray-200 text-start">
                        {record.checkpoint}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="font-mono bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded">
                          {record.plateNumber}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 dark:text-gray-400">
                        {new Date(record.time).toLocaleString("ru-RU")}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span
                          className={`inline-flex items-center dark:text-white px-2.5 py-0.5 rounded-full text-xs font-medium`}
                        >
                          {record.speed}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 dark:text-gray-200 py-4 sm:px-6 text-start">
                        {record.vehicleType}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalCount > 0 && (
              <TablePagination
                className="table-pagination"
                rowsPerPageOptions={[8, 25, 50, 100]}
                component="div"
                count={totalCount}
                rowsPerPage={itemsPerPage}
                page={currentPage}
                onPageChange={(_event, newPage) => setCurrentPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setItemsPerPage(parseInt(event.target.value, 10));
                  setCurrentPage(0);
                }}
                labelRowsPerPage={`${t("common.rows_per_page")}`}
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} ${t("common.from_to")} ${count}`
                }
              />
            )}
          </>
        )}

        {!isLoading && data && data.content.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {t("reports.traffic_intensity.nodata")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficIntensityTable;
