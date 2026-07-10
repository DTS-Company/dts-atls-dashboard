import { useState, useEffect } from "react";
import { TablePagination } from "@mui/material";
import { Search, FileText, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import Button from "@components/ui/button/Button";
import { useGetWaybill3cListQuery } from "../api";
import Input from "@components/form/input/InputField";
import { TableLoadingAnimation } from "@components/common/TableLoadingAnimation";

const getFirstDayOfMonth = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
};

const getEndOfMonthDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
};

const validateRma = (rma: string): boolean => {
  if (!rma) return true; 
  return /^\d{9,10}$/.test(rma);
};

const Waybill = () => {
  const [organizationRma, setOrganizationRma] = useState("");
  const [organizationKpp, setOrganizationKpp] = useState("");
  const [employeeRma, setEmployeeRma] = useState("");
  const [driverRma, setDriverRma] = useState("");
  const [transportRegistrationNumber, setTransportRegistrationNumber] =
    useState("");
  const [dateFrom, setDateFrom] = useState(getFirstDayOfMonth());
  const [dateTo, setDateTo] = useState(getEndOfMonthDate());

  const [validationErrors, setValidationErrors] = useState<{
    organizationRma?: string;
    organizationKpp?: string;
    employeeRma?: string;
    driverRma?: string;
  }>({});

  const [searchParams, setSearchParams] = useState<{
    organizationRma: string;
    organizationKpp: string;
    employeeRma: string;
    driverRma: string;
    transportRegistrationNumber: string;
    dateFrom: string;
    dateTo: string;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data: waybillResponse,
    isLoading,
    isFetching,
    error,
  } = useGetWaybill3cListQuery(
    searchParams
      ? {
          organizationRma: searchParams.organizationRma || undefined,
          organizationKpp: searchParams.organizationKpp || undefined,
          employeeRma: searchParams.employeeRma || undefined,
          driverRma: searchParams.driverRma || undefined,
          transportRegistrationNumber:
            searchParams.transportRegistrationNumber || undefined,
          dateFrom: searchParams.dateFrom || undefined,
          dateTo: searchParams.dateTo || undefined,
          perPage: itemsPerPage,
          page: currentPage,
        }
      : {},
    {
      skip: !searchParams,
    },
  );

  const apiErrorMessage = (error as any)?.data?.message || "";
  const isValidationError = (error as any)?.status === 400;
  const isNotFoundError = (error as any)?.status === 404;

  const waybillList =
    isNotFoundError || isValidationError ? [] : waybillResponse?.data || [];
  const totalCount =
    isNotFoundError || isValidationError ? 0 : waybillResponse?.total || 0;

  useEffect(() => {
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      setDateTo(dateFrom);
    }
  }, [dateFrom]);

  const handleSearch = () => {
    setValidationErrors({});

    if (!dateFrom || !dateTo) {
      alert("Пожалуйста, выберите период дат");
      return;
    }

    if (new Date(dateFrom) > new Date(dateTo)) {
      alert("Дата начала не может быть больше даты окончания");
      return;
    }

    const errors: typeof validationErrors = {};

    if (organizationRma && !validateRma(organizationRma)) {
      errors.organizationRma = "РМА организации должен содержать 9-10 цифр";
    }

    if (employeeRma && !validateRma(employeeRma)) {
      errors.employeeRma = "РМА сотрудника должен содержать 10 цифр";
    }

    if (driverRma && !validateRma(driverRma)) {
      errors.driverRma = "РМА водителя должен содержать 10 цифр";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSearchParams({
      organizationRma,
      organizationKpp,
      employeeRma,
      driverRma,
      transportRegistrationNumber,
      dateFrom,
      dateTo,
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setOrganizationRma("");
    setOrganizationKpp("");
    setEmployeeRma("");
    setDriverRma("");
    setTransportRegistrationNumber("");
    setDateFrom(getFirstDayOfMonth());
    setDateTo(getEndOfMonthDate());
    setValidationErrors({});
    setSearchParams(null);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("ru-RU");
    } catch {
      return dateString;
    }
  };

  const hasSearched = searchParams !== null;
  const showNoResults =
    hasSearched &&
    !isLoading &&
    !isFetching &&
    (isNotFoundError || isValidationError || waybillList.length === 0);

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-xl dark:border-gray-800 dark:bg-gray-900">
      <div className="p-4 border-b border-gray-200 sm:p-6 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-800 sm:text-xl dark:text-white">
          Путевые листы
        </h2>
      </div>

      <div className="p-4 border-b border-gray-200 sm:p-6 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
              РМА организации
            </label>
            <Input
              placeholder="Например: 1234567890"
              value={organizationRma}
              onChange={(e) => {
                setOrganizationRma(e.target.value);
                if (validationErrors.organizationRma) {
                  setValidationErrors((prev) => ({
                    ...prev,
                    organizationRma: undefined,
                  }));
                }
              }}
              onKeyDown={handleKeyDown}
              className={`w-full text-sm ${validationErrors.organizationRma ? "border-red-500" : ""}`}
              error={!!validationErrors.organizationRma}
            />
            {validationErrors.organizationRma && (
              <p className="mt-1 text-xs text-red-500">
                {validationErrors.organizationRma}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
              КПП организации
            </label>
            <Input
              placeholder="Например: 123456789"
              value={organizationKpp}
              onChange={(e) => setOrganizationKpp(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
              РМА сотрудника
            </label>
            <Input
              placeholder="Например: 9876543210"
              value={employeeRma}
              onChange={(e) => {
                setEmployeeRma(e.target.value);
                if (validationErrors.employeeRma) {
                  setValidationErrors((prev) => ({
                    ...prev,
                    employeeRma: undefined,
                  }));
                }
              }}
              onKeyDown={handleKeyDown}
              className={`w-full text-sm ${validationErrors.employeeRma ? "border-red-500" : ""}`}
              error={!!validationErrors.employeeRma}
            />
            {validationErrors.employeeRma && (
              <p className="mt-1 text-xs text-red-500">
                {validationErrors.employeeRma}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
              РМА водителя
            </label>
            <Input
              placeholder="Например: 9876543210"
              value={driverRma}
              onChange={(e) => {
                setDriverRma(e.target.value);
                if (validationErrors.driverRma) {
                  setValidationErrors((prev) => ({
                    ...prev,
                    driverRma: undefined,
                  }));
                }
              }}
              onKeyDown={handleKeyDown}
              className={`w-full text-sm ${validationErrors.driverRma ? "border-red-500" : ""}`}
              error={!!validationErrors.driverRma}
            />
            {validationErrors.driverRma && (
              <p className="mt-1 text-xs text-red-500">
                {validationErrors.driverRma}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
              Гос. номер транспорта
            </label>
            <Input
              placeholder="Например: 0000PP00"
              value={transportRegistrationNumber}
              onChange={(e) => setTransportRegistrationNumber(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
              Дата начала периода
            </label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
              Дата окончания периода
            </label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              min={dateFrom}
              className="w-full text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-2 mt-4 sm:flex-row sm:items-center">
          <Button
            onClick={handleSearch}
            className="flex items-center justify-center flex-1 gap-2 sm:flex-none"
            disabled={isLoading || isFetching}
          >
            <Search className="flex-shrink-0 w-4 h-4" />
            <span>{isLoading || isFetching ? "Загрузка..." : "Поиск"}</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleResetFilters}
            disabled={isLoading || isFetching}
            className="flex-1 sm:flex-none"
          >
            Сбросить
          </Button>
        </div>
      </div>

      <div className="relative">
        {!hasSearched ? (
          <div className="p-8 text-center sm:p-12">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-400 sm:w-16 sm:h-16" />
            <p className="text-base text-gray-600 sm:text-lg dark:text-gray-400">
              Выполните поиск для отображения данных
            </p>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm dark:text-gray-500">
              Используйте фильтры выше и нажмите "Поиск"
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center w-full">
            <TableLoadingAnimation />
          </div>
        ) : showNoResults ? (
          <div className="p-8 text-center sm:p-12">
            {isValidationError ? (
              <>
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-yellow-500 sm:w-16 sm:h-16" />
                <p className="text-base text-gray-600 sm:text-lg dark:text-gray-400">
                  Ошибка валидации
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                  {apiErrorMessage || "Проверьте правильность заполнения полей"}
                </p>
              </>
            ) : isNotFoundError ? (
              <>
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400 sm:w-16 sm:h-16" />
                <p className="text-base text-gray-600 sm:text-lg dark:text-gray-400">
                  Организация с указанными реквизитами не найдена
                </p>
              </>
            ) : (
              <>
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400 sm:w-16 sm:h-16" />
                <p className="text-base text-gray-600 sm:text-lg dark:text-gray-400">
                  По вашему запросу ничего не найдено
                </p>
              </>
            )}
            <p className="mt-1 text-xs text-gray-500 sm:text-sm dark:text-gray-500">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <div className="min-w-[1200px] lg:min-w-full">
                <Table className="w-full">
                  <TableHeader className="border-b border-gray-200 dark:border-gray-800">
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      <TableCell
                        isHeader
                        className="px-3 py-3 text-xs font-medium text-gray-700 sm:px-6 sm:py-4 dark:text-gray-300 text-start sm:text-sm whitespace-nowrap"
                      >
                        Номер
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-3 py-3 text-xs font-medium text-gray-700 sm:px-6 sm:py-4 dark:text-gray-300 text-start sm:text-sm whitespace-nowrap"
                      >
                        Дата выхода
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-3 py-3 text-xs font-medium text-gray-700 sm:px-6 sm:py-4 dark:text-gray-300 text-start sm:text-sm whitespace-nowrap"
                      >
                        Дата въезда
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-3 py-3 text-xs font-medium text-gray-700 sm:px-6 sm:py-4 dark:text-gray-300 text-start sm:text-sm whitespace-nowrap"
                      >
                        Организация
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-3 py-3 text-xs font-medium text-gray-700 sm:px-6 sm:py-4 dark:text-gray-300 text-start sm:text-sm whitespace-nowrap"
                      >
                        Водитель
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-3 py-3 text-xs font-medium text-gray-700 sm:px-6 sm:py-4 dark:text-gray-300 text-start sm:text-sm whitespace-nowrap"
                      >
                        РМА водителя
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-3 py-3 text-xs font-medium text-gray-700 sm:px-6 sm:py-4 dark:text-gray-300 text-start sm:text-sm whitespace-nowrap"
                      >
                        Транспорт
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isFetching && !isLoading ? (
                      <TableLoadingAnimation />
                    ) : (
                      waybillList.map((item: any) => (
                        <TableRow
                          key={item.id}
                          className="transition-colors border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <TableCell className="px-3 py-3 sm:px-6 sm:py-4">
                            <span className="text-xs font-medium text-blue-600 sm:text-sm dark:text-blue-400">
                              {item.number}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-3 sm:px-6 sm:py-4">
                            <span className="text-xs text-gray-700 sm:text-sm dark:text-gray-300 whitespace-nowrap">
                              {formatDateTime(item.exit_date)}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-3 sm:px-6 sm:py-4">
                            <span className="text-xs text-gray-700 sm:text-sm dark:text-gray-300 whitespace-nowrap">
                              {formatDateTime(item.entry_date)}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-3 sm:px-6 sm:py-4">
                            <span className="text-xs text-gray-700 sm:text-sm dark:text-gray-300 whitespace-nowrap">
                              {item.company?.name}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-3 sm:px-6 sm:py-4">
                            <span className="text-xs text-gray-800 sm:text-sm dark:text-gray-200">
                              {item.timesheet?.full_name ||
                                item.full_name ||
                                "-"}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-3 sm:px-6 sm:py-4">
                            <span className="font-mono text-xs font-medium text-gray-800 sm:text-sm dark:text-gray-200">
                              {item.timesheet?.rma || item.rma || "-"}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-3 sm:px-6 sm:py-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-gray-800 sm:text-sm dark:text-gray-200">
                                {item.parking?.registration_number ||
                                  item.registration_number ||
                                  "-"}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Тип:{" "}
                                {item.parking?.transport_type_id ||
                                  item.transport_type ||
                                  "-"}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {waybillList.length > 0 && (
              <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800 sm:px-6">
                <TablePagination
                  className="table-pagination"
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={totalCount}
                  rowsPerPage={itemsPerPage}
                  page={currentPage - 1}
                  onPageChange={(_event, newPage) => {
                    setCurrentPage(newPage + 1);
                  }}
                  onRowsPerPageChange={(event) => {
                    const newLimit = parseInt(event.target.value, 10);
                    setItemsPerPage(newLimit);
                    setCurrentPage(1);
                  }}
                  labelRowsPerPage="Строк на странице:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} из ${count}`
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Waybill;
