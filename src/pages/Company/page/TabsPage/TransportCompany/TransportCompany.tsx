import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Eye, RefreshCw, Search, Unlink } from "lucide-react";
import { toast } from "react-toastify";
import { useModal } from "@hooks/useModal";
import ComponentCard from "@components/common/ComponentCard";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import { TablePagination } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Modal } from "@components/ui/modal";
import {
  useAddTransportToCompanyMutation,
  useDeleteTransportMutation,
  useGetCompanyTransportsQuery,
  useSynchronizeAllTransportsMutation,
} from "@pages/Company/api/api";
import { useLazyCheckTransportlicensePlateQuery } from "@pages/Individual/api/api";
import { TTransport, TTransportResponse } from "@pages/Transport/types/types";
import { useLocalization } from "@hooks/useLocalization";

const containsRussianLetters = (text: string): boolean => {
  const russianRegex = /[а-яА-ЯёЁ]/;
  return russianRegex.test(text);
};

const TransportCompany = () => {
  const { id } = useParams();
  const entityId = String(id);
  const navigate = useNavigate();
  const { t } = useLocalization();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [searchError, setSearchError] = useState("");

  const [licensePlateError, setLicensePlateError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: transportCompanies, refetch } = useGetCompanyTransportsQuery({
    id: entityId,
    page: currentPage - 1,
    limit: itemsPerPage,
    search: debouncedSearch,
  });

  const transportCompaniesList: TTransport[] =
    (transportCompanies as TTransportResponse)?.content || [];
  const totalCount =
    (transportCompanies as TTransportResponse)?.meta?.totalCount || 0;

  const [checkTransportlicensePlate] = useLazyCheckTransportlicensePlateQuery();
  const [addTransport] = useAddTransportToCompanyMutation();
  const [deleteTransport] = useDeleteTransportMutation();
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncModalData, setSyncModalData] = useState<{
    title: string;
    successCount: number;
    totalCount: number;
    failedList: Array<{ name: string; message: string }>;
  } | null>(null);

  const {
    isOpen: isCheckModalOpen,
    openModal: openCheckModal,
    closeModal: closeCheckModal,
  } = useModal();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<TTransport | null>(
    null,
  );

  const [synchronizeAllTransports] = useSynchronizeAllTransportsMutation();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncTransports = async () => {
    setIsSyncing(true);

    try {
      const result = await synchronizeAllTransports(entityId).unwrap();

      const failedList: Array<{ name: string; message: string }> = [];

      if (result.failedTransports && result.failedTransports.length > 0) {
        result.failedTransports.forEach((transport: any) => {
          failedList.push({
            name:
              transport.registrationNumber ||
              transport.transportId ||
              "Неизвестный транспорт",
            message: transport.message,
          });
        });
      }

      setSyncModalData({
        title: "Синхронизация транспортов",
        successCount: result.successSynchronize,
        totalCount: result.allSynchronize,
        failedList,
      });
      setIsSyncModalOpen(true);
      refetch();
    } catch (error: any) {
      console.error("Sync error:", error);

      if (error?.status === 400 && error?.data) {
        const errorData = error.data;
        const failedList: Array<{ name: string; message: string }> = [];

        if (
          errorData.failedTransports &&
          errorData.failedTransports.length > 0
        ) {
          errorData.failedTransports.forEach((transport: any) => {
            failedList.push({
              name:
                transport.registrationNumber ||
                transport.transportId ||
                "Неизвестный транспорт",
              message: transport.message,
            });
          });
        }

        setSyncModalData({
          title: errorData.title || "Синхронизация транспортов",
          successCount: errorData.successSynchronize || 0,
          totalCount: errorData.allSynchronize || 0,
          failedList,
        });
        setIsSyncModalOpen(true);
      } else if (error?.status === 404) {
        setSyncModalData({
          title: "Ошибка",
          successCount: 0,
          totalCount: 0,
          failedList: [{ name: "Компания", message: "Компания не найдена" }],
        });
        setIsSyncModalOpen(true);
      } else if (error?.status === 409) {
        setSyncModalData({
          title: "Ошибка",
          successCount: 0,
          totalCount: 0,
          failedList: [
            { name: "Конфликт", message: "Конфликт данных при синхронизации" },
          ],
        });
        setIsSyncModalOpen(true);
      } else {
        setSyncModalData({
          title: "Ошибка",
          successCount: 0,
          totalCount: 0,
          failedList: [
            {
              name: "Ошибка",
              message:
                error?.data?.message || "Ошибка при синхронизации транспортов",
            },
          ],
        });
        setIsSyncModalOpen(true);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transportToDelete, setTransportToDelete] = useState<{
    id: string;
    licensePlate: string;
  } | null>(null);

  const [licensePlate, setLicensePlate] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [canLink, setCanLink] = useState(false);
  const [selectedTransportId, setSelectedTransportId] = useState("");

  const validateSearchInput = (input: string): boolean => {
    if (containsRussianLetters(input)) {
      setSearchError("Пожалуйста, введите номер на латинском языке");
      return false;
    }
    setSearchError("");
    return true;
  };

  const validateLicensePlate = (input: string): boolean => {
    if (containsRussianLetters(input)) {
      setLicensePlateError("Пожалуйста, введите номер на латинском языке");
      return false;
    }
    setLicensePlateError("");
    return true;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLicensePlate(searchInput)) {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }
  };

  const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLicensePlate(value);
    validateLicensePlate(value);
  };

  const handleEyeClick = (transport: TTransport) => {
    setSelectedTransport(transport);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTransport(null);
  };

  const openDeleteModal = (transport: { id: string; licensePlate: string }) => {
    setTransportToDelete(transport);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTransportToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteTransport = async () => {
    if (!transportToDelete) return;
    try {
      await deleteTransport({
        id: entityId,
        transportId: transportToDelete.id,
      }).unwrap();
      toast.success("Транспорт успешно откреплен!");
      refetch();
    } catch {
      toast.error("Ошибка при откреплении транспорта.");
    } finally {
      closeDeleteModal();
    }
  };

  const handleCheckTransport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLicensePlate(licensePlate)) {
      return;
    }

    try {
      const result = await checkTransportlicensePlate(licensePlate).unwrap();

      if (!result.exists) {
        setModalMessage(
          result.message || t("subject.company.transport.error_text"),
        );
        setCanLink(false);
      } else {
        setModalMessage(
          `${t("subject.company.transport.success")}: ${
            result.licensePlate?.licensePlate || "N/A"
          }`,
        );
        setSelectedTransportId(result.licensePlate?.id || "");
        setCanLink(true);
      }
      openCheckModal();
    } catch (error: any) {
      if (error.status === 404) {
        toast.warning("Транспорт не найден! Проверьте введенный номер.");
      } else if (error.status === 409) {
        toast.warning("Транспорт уже связан с другой компанией.");
      } else {
        toast.error("Ошибка при проверке транспорта.");
      }
    }
  };

  const handleSaveTransport = async () => {
    if (!canLink || !selectedTransportId) return;

    try {
      await addTransport({
        transportId: selectedTransportId,
        companyId: entityId,
      }).unwrap();

      toast.success("Транспорт успешно добавлен!");
      closeCheckModal();
      setLicensePlate("");
      refetch();
    } catch (error: any) {
      if (error.status === 409) {
        toast.warning("Этот транспорт уже привязан к другой компании!");
      } else {
        toast.error("Ошибка при сохранении транспорта.");
      }
    }
  };

  return (
    <ComponentCard title={t("subject.company.transport.title")}>
      <button
        onClick={handleSyncTransports}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-lg dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        <RefreshCw className="w-4 h-4" />
        Синхронизировать
      </button>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
        <div className="grid justify-between grid-cols-1 gap-4 p-4 mb-2 sm:flex sm:grid-cols-2">
          <div className="flex gap-2">
            <form onSubmit={handleCheckTransport} className="flex gap-2">
              <div className="relative">
                <Input
                  placeholder={`${t("subject.company.transport.auto_number")}`}
                  value={licensePlate}
                  onChange={handleLicensePlateChange}
                  className={licensePlateError ? "border-red-500" : ""}
                />
                {licensePlateError && (
                  <p className="absolute mt-1 text-xs text-red-500">
                    {licensePlateError}
                  </p>
                )}
              </div>
              <Button disabled={!!licensePlateError}>
                {t("subject.company.transport.check")}
              </Button>
            </form>
          </div>

          <div className="block">
            <form onSubmit={handleSearchSubmit} className="flex">
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <Search className="text-gray-400" />
                </span>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    validateSearchInput(e.target.value);
                  }}
                  placeholder={`${t("subject.individual.table.search")}`}
                  className={`dark:bg-dark-900 h-11 w-full rounded-lg border ${
                    searchError ? "border-red-500" : "border-gray-200"
                  } bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-600 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]`}
                />
                {searchError && (
                  <p className="absolute mt-1 text-xs text-red-500">
                    {searchError}
                  </p>
                )}
              </div>
              <Button className="ml-4" disabled={!!searchError}>
                {t("subject.individual.table.search_button")}
              </Button>
            </form>
          </div>

          <Button
            onClick={() => navigate("/transport/add-new-transport")}
            className="whitespace-nowrap"
          >
            + {t("subject.company.transport.add")}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full min-w-[600px]">
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
                  Действия
                </TableCell>
              </TableRow>
            </TableHeader>

            {transportCompaniesList.length > 0 ? (
              <TableBody>
                {transportCompaniesList.map((transport: any, index) => (
                  <TableRow
                    key={transport.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700"
                  >
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </span>
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
                    <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                      <div className="flex justify-end gap-4">
                        <Unlink
                          onClick={() =>
                            openDeleteModal({
                              id: transport.id,
                              licensePlate: transport.LicensePlate,
                            })
                          }
                          className="w-6 h-6 transition cursor-pointer hover:text-red-500"
                        />
                        <Eye
                          onClick={() => handleEyeClick(transport)}
                          className="w-6 h-6 text-gray-600 hover:text-green-500 dark:hover:text-green-500 hover:cursor-pointer dark:text-gray-300"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <p className="p-5 text-gray-500 sm:px-6">
                {t("subject.company.transport.nodata")}
              </p>
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
              onPageChange={(_event, newPage) => {
                setCurrentPage(newPage + 1);
              }}
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

        <Modal
          isOpen={isCheckModalOpen}
          onClose={closeCheckModal}
          className="max-w-[500px] text-start m-4"
        >
          <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
            <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {t("subject.company.transport.check_text")}
            </h4>
            <p className="text-gray-600 dark:text-white/80">{modalMessage}</p>
            <div className="flex justify-end gap-3 mt-4">
              {canLink && (
                <Button onClick={handleSaveTransport}>
                  {t("subject.company.transport.link")}
                </Button>
              )}
              <Button variant="outline" onClick={closeCheckModal}>
                {t("subject.company.transport.close")}
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          className="max-w-[450px] m-4"
        >
          <div className="p-6 bg-white rounded-3xl dark:bg-gray-900">
            <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {t("subject.company.transport.modal_text")}
            </h4>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {t("subject.company.transport.modal_text_two")}{" "}
              <strong>{transportToDelete?.licensePlate}</strong>?{" "}
              {t("subject.company.transport.modal_text_three")}
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeDeleteModal}>
                {t("subject.company.transport.cancel")}
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-700"
                onClick={confirmDeleteTransport}
              >
                {t("subject.company.transport.deattached_text")}
              </Button>
            </div>
          </div>
        </Modal>
      </div>

      <Modal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        className="max-w-[650px]"
      >
        <div className="p-6">
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
            <Button variant="outline" onClick={closeViewModal}>
              Закрыть
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isSyncing} onClose={() => {}} className="max-w-[400px]">
        <div className="p-8 bg-white rounded-3xl dark:bg-gray-900">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full dark:border-gray-700"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 rounded-full border-brand-500 animate-spin border-t-transparent"></div>
            </div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Синхронизация...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Синхронизация транспортов
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        className="max-w-[500px] max-h-[600px]"
      >
        <div className="p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-2xl font-semibold dark:text-gray-200">
            {syncModalData?.title || "Результат синхронизации"}
          </h4>

          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-300">
              Синхронизировано:{" "}
              <strong>{syncModalData?.successCount ?? 0}</strong> из{" "}
              <strong>{syncModalData?.totalCount ?? 0}</strong>
            </p>

            {syncModalData?.failedList &&
              syncModalData.failedList.length > 0 && (
                <>
                  <p className="font-medium text-red-500 dark:text-red-400">
                    Ошибки синхронизации ({syncModalData.failedList.length}):
                  </p>
                  <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                    {syncModalData.failedList.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800"
                      >
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {item.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

            {syncModalData?.totalCount === 0 && (
              <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                Нет транспортов для синхронизации
              </p>
            )}

            {syncModalData &&
              syncModalData.successCount === syncModalData.totalCount &&
              syncModalData.totalCount > 0 && (
                <div className="p-3 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                  <p className="text-sm text-center text-green-600 dark:text-green-400">
                    ✅ Все транспорты успешно синхронизированы!
                  </p>
                </div>
              )}
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={() => setIsSyncModalOpen(false)}>Понятно</Button>
          </div>
        </div>
      </Modal>
    </ComponentCard>
  );
};

export default TransportCompany;
