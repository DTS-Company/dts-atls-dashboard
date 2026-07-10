import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronRight, Eye } from "lucide-react";
import { useGetAppListNewQuery } from "../api/api";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import Select from "@components/form/Select";
import { TablePagination } from "@mui/material";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

interface DozvolApplication {
  id: string;
  app_number: string;
  carrier_inn: string;
  carrier_FullName: string;
  carrier_date_submit: string;
  status_name: string;
  status_id?: number;
}

const DozvolTable = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>("1");

  const { data, isLoading, error, refetch } = useGetAppListNewQuery(
    selectedStatus !== "1" ? { status: parseInt(selectedStatus) } : undefined,
    { refetchOnMountOrArgChange: true },
  );
  const { t } = useLocalization();

  const STATUS_MAPPING: Record<number, string> = {
    1: t("permit_table.all"),
    2: t("permit_table.new"),
    3: t("permit_table.closed"),
    4: t("permit_table.waiting_payment"),
    5: t("permit_table.rejected"),
    6: t("permit_table.issued"),
    7: t("permit_table.payment_expired"),
    8: t("permit_table.on_approval"),
  };

  const applications: DozvolApplication[] = data?.content || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalCount = applications.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplications = applications.slice(startIndex, endIndex);

  useEffect(() => {
    refetch();
    setCurrentPage(1);
  }, [selectedStatus, refetch]);

  const getStatusColor = (statusName: string): string => {
    switch (statusName) {
      case "Отклонен":
      case "Срок оплаты истек":
        return "text-red-500";
      case "Документы выданы":
        return "text-green-500";
      case "Ожидает оплату":
        return "text-yellow-500";
      case "На утверждении":
        return "text-blue-500";
      default:
        return "text-gray-800 dark:text-white/90";
    }
  };

  const handleView = (id: string) => {
    navigate(`/permits/dozvolTable/view/${id}`);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  return (
    <>
      <PageMeta title={t("permit_table.title")} description="" />
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
            {t("permit_table.title")}
          </>
        }
      />
      <ComponentCard title={t("permit_table.second_title")}>
        <div className="mb-4 w-full md:w-64">
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            options={Object.entries(STATUS_MAPPING).map(([key, value]) => ({
              value: key,
              label: value,
            }))}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-2">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[600px]">
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-800">
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    №
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    {t("permit_table.app_number")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    {t("permit_table.carrier_inn")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    {t("permit_table.carrier_fullname")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    {t("permit_table.date")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    {t("permit_table.status")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    {t("permit_table.actions")}
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell className="text-center" isHeader={false}>
                      {t("permit_table.loading")}
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <p className="p-5 sm:px-6 text-gray-500">
                      {t("permit_table.error")}
                    </p>
                  </TableRow>
                ) : paginatedApplications.length === 0 ? (
                  <TableRow>
                    <TableCell
                      className="pl-5 py-4 text-gray-500 dark:text-white/70"
                      isHeader={false}
                    >
                      {t("permit_table.empty")}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedApplications.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <TableCell
                        className="px-5 py-4 text-start"
                        isHeader={false}
                      >
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {startIndex + index + 1}
                        </span>
                      </TableCell>
                      <TableCell
                        className="px-5 py-4 text-start"
                        isHeader={false}
                      >
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item.app_number}
                        </span>
                      </TableCell>
                      <TableCell
                        className="px-5 py-4 text-start"
                        isHeader={false}
                      >
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item.carrier_inn}
                        </span>
                      </TableCell>
                      <TableCell
                        className="px-5 py-4 text-start"
                        isHeader={false}
                      >
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item.carrier_FullName}
                        </span>
                      </TableCell>
                      <TableCell
                        className="px-5 py-4 text-start"
                        isHeader={false}
                      >
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {new Date(
                            item.carrier_date_submit,
                          ).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell
                        className="px-5 py-4 text-start"
                        isHeader={false}
                      >
                        <span
                          className={`block font-medium text-theme-sm ${getStatusColor(
                            item.status_name,
                          )}`}
                        >
                          {item.status_name}
                        </span>
                      </TableCell>
                      <TableCell
                        className="px-5 py-4 text-start"
                        isHeader={false}
                      >
                        <Eye
                          size={24}
                          onClick={() => handleView(item.id)}
                          className="dark:text-white cursor-pointer hover:text-green-500 transition"
                        />
                      </TableCell>
                    </TableRow>
                  ))
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
              page={currentPage - 1}
              onPageChange={(_event, newPage) => setCurrentPage(newPage + 1)}
              onRowsPerPageChange={(event) => {
                const newSize = parseInt(event.target.value, 10);
                setItemsPerPage(newSize);
                setCurrentPage(1);
              }}
              labelRowsPerPage={t("common.rows_per_page")}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to}   ${t("common.from_to")} ${count}`
              }
            />
          )}
        </div>
      </ComponentCard>
    </>
  );
};

export default DozvolTable;
3;
