import { useState } from "react";
import { TablePagination } from "@mui/material";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import PageMeta from "@components/common/PageMeta";
import ComponentCard from "@components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { TableLoadingAnimation } from "@components/common/TableLoadingAnimation";
import { StatusBadge } from "@utils/StatusBadge";
import {
  useGetTransportTemporaryStatusQuery,
  useUpdateTransportTemporaryStatusMutation,
} from "@pages/Documents/Transport/api/api";
import { SquareCheck, SquareX } from "lucide-react";
import { toast } from "react-toastify";

const TransportTemporary = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data, isLoading, isError, refetch } =
    useGetTransportTemporaryStatusQuery(
      {
        page: currentPage,
        size: itemsPerPage,
      },
      {
        refetchOnMountOrArgChange: true,
      },
    );

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateTransportTemporaryStatusMutation();

  const allItems = data?.content || [];
  const totalCount = data?.meta?.totalCount || 0;

  const handlePageChange = (_event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setItemsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };

  const handleStatusUpdate = async (
    id: string,
    status: number,
    action: string,
  ) => {
    try {
      await updateStatus({ id, status }).unwrap();

      toast.success(
        `Статус успешно обновлен: ${action === "approve" ? "Подтверждено" : "Отменено"}`,
      );

      refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Ошибка при обновлении статуса");
    }
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-red-600">
          Ошибка при загрузке временного транспорта
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Повторить
        </button>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Транспорт на проверку" />
      <PageMeta title="Транспорт на проверку" description="" />
      <ComponentCard title="Транспорт на проверку">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800">
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
                    Госномер
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    Компания
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    Номер договора
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    Дата открепления
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    Статус
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    Действия
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableLoadingAnimation />
                ) : allItems.length > 0 ? (
                  allItems.map((item, index) => (
                    <TableRow
                      key={`${item.transportId}-${index}`}
                      className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {currentPage * itemsPerPage + index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item.licensePlate}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item.entityName}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item.contractNumber}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item.detachmentDate
                            ? new Date(item.detachmentDate).toLocaleDateString()
                            : "—"}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-white/90">
                        <StatusBadge status={item.checkStatus} />
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              handleStatusUpdate(item.id, 3, "reject")
                            }
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg
      bg-white dark:bg-gray-800
      border border-red-200 dark:border-red-900/50
      text-red-600 dark:text-red-400
      hover:bg-red-600 dark:hover:bg-red-600
      hover:text-white dark:hover:text-white
      hover:border-red-600 dark:hover:border-red-600
      shadow-sm hover:shadow-md
      disabled:opacity-50 disabled:cursor-not-allowed
      transform hover:-translate-y-0.5
      transition-all duration-200
      text-sm font-medium"
                          >
                            <SquareX className="w-4 h-4" />
                            Отменить
                          </button>

                          <button
                            onClick={() =>
                              handleStatusUpdate(item.id, 2, "approve")
                            }
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg
      bg-white dark:bg-gray-800
      border border-green-200 dark:border-green-900/50
      text-green-600 dark:text-green-400
      hover:bg-green-600 dark:hover:bg-green-600
      hover:text-white dark:hover:text-white
      hover:border-green-600 dark:hover:border-green-600
      shadow-sm hover:shadow-md
      disabled:opacity-50 disabled:cursor-not-allowed
      transform hover:-translate-y-0.5
      transition-all duration-200
      text-sm font-medium"
                          >
                            <SquareCheck className="w-4 h-4" />
                            Подтвердить
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <div>
                    <p className="p-5 sm:px-6 text-gray-500">
                      Нет данных для отображения
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
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              labelRowsPerPage="Строк на странице:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} из ${count}`
              }
            />
          )}
        </div>
      </ComponentCard>
    </>
  );
};

export default TransportTemporary;
