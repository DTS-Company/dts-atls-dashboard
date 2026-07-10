import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react"; // Added useEffect
import { Search, Unlink } from "lucide-react"; // Added Search
import { toast } from "react-toastify";
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
import { useModal } from "@hooks/useModal";
import {
  useAddTransportToIndividualMutation,
  useDeleteTransportFromIndividualMutation,
  useGetTransportForIndividualQuery,
  useLazyCheckTransportlicensePlateQuery,
} from "@pages/Individual/api/api";
import { TTransport, TTransportResponse } from "@pages/Transport/types/types";
import { useLocalization } from "@hooks/useLocalization";

const containsRussianLetters = (text: string): boolean => {
  const russianRegex = /[а-яА-ЯёЁ]/;
  return russianRegex.test(text);
};

const TransportIndividual = () => {
  const { id } = useParams();
  const entityId = String(id);
  const navigate = useNavigate();
  const { t } = useLocalization();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [licensePlateError, setLicensePlateError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: transportIndividuals, refetch } =
    useGetTransportForIndividualQuery({
      id: entityId,
      page: currentPage - 1,
      limit: itemsPerPage,
      search: debouncedSearch,
    });

  const transportIndividualList: TTransport[] =
    (transportIndividuals as TTransportResponse)?.content || [];
  const totalCount =
    (transportIndividuals as TTransportResponse)?.meta?.totalCount || 0;

  const [checkTransportlicensePlate] = useLazyCheckTransportlicensePlateQuery();
  const [addInfoTransportIndividual] = useAddTransportToIndividualMutation();
  const [deleteTransportIndividual] =
    useDeleteTransportFromIndividualMutation();
  const { isOpen, openModal, closeModal } = useModal();
  const [licensePlate, setlicensePlate] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [canLink, setCanLink] = useState(false);
  const [ids, setIds] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState("");

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
    if (validateSearchInput(searchInput)) {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }
  };

  const handleChangeTransport = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();

    if (!validateLicensePlate(licensePlate)) {
      return;
    }

    try {
      const result = await checkTransportlicensePlate(licensePlate).unwrap();

      if (!result.exists) {
        setModalMessage(result.message || "Транспорт не найден");
        setCanLink(false);
      } else {
        setModalMessage(
          `Автомобильный номер найден. Хотите связать этот автомобиль с вашей компанией?: ${
            result.licensePlate?.licensePlate || "N/A"
          }`,
        );
        setIds(result.licensePlate?.id || "");
        setCanLink(true);
      }
      openModal();
    } catch (error: any) {
      if (error.status === 404) {
        toast.warning("Транспорт не найден! Проверьте введенный номер.");
      } else if (error.status === 409) {
        toast.warning("Транспорт уже связен с другой компании.");
      } else {
        toast.error("Ошибка при проверке транспорта.");
      }
    }
  };

  const handleSaveTransport = async () => {
    if (!canLink || !ids) return;

    try {
      await addInfoTransportIndividual({
        transportId: ids,
        individualId: entityId,
      }).unwrap();

      toast.success("Транспорт успешно добавлен!");
      refetch();
      closeModal();
      setlicensePlate("");
    } catch (error: any) {
      if (error.status === 409) {
        toast.warning("Этот транспорт уже привязан к другой компании!");
      } else {
        toast.error("Ошибка при сохранении транспорта.");
      }
    }
  };

  return (
    <>
      <ComponentCard title={t("subject.individual.transports_page.title")}>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
          <div className="sm:flex grid sm:grid-cols-2 grid-cols-1 justify-between p-4 gap-4">
            <div className="flex gap-2">
              <form onSubmit={handleChangeTransport} className="flex gap-2">
                <div className="relative">
                  <Input
                    placeholder={`${t("subject.individual.add_transport.auto_number")}`}
                    value={licensePlate}
                    onChange={(e) => {
                      setlicensePlate(e.target.value);
                      validateLicensePlate(e.target.value);
                    }}
                    className={licensePlateError ? "border-red-500" : ""}
                  />
                  {licensePlateError && (
                    <p className="absolute text-red-500 text-xs mt-1">
                      {licensePlateError}
                    </p>
                  )}
                </div>
                <Button disabled={!!licensePlateError}>
                  {t("subject.individual.add_transport.check")}
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
                    <p className="absolute text-red-500 text-xs mt-1">
                      {searchError}
                    </p>
                  )}
                </div>
                <Button className="ml-4" disabled={!!searchError}>
                  {t("subject.individual.table.search_button")}
                </Button>
              </form>
            </div>

            <Button onClick={() => navigate("/transport/add-new-transport")}>
              {t("subject.individual.add_transport.add")}
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
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-end text-theme-xs dark:text-gray-300"
                  >
                    {t("subject.individual.add_transport.deattached")}
                  </TableCell>
                </TableRow>
              </TableHeader>
              {transportIndividualList.length > 0 ? (
                <TableBody>
                  {transportIndividualList.map((transport, index) => (
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
                      <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                        <div className="flex gap-2 justify-end">
                          <Unlink
                            onClick={() => {
                              setDeleteMessage(
                                `Вы уверены, что хотите открепить транспорт с номером ${transport.LicensePlate}?`,
                              );
                              setDeleteId(transport.id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="w-6 h-6 cursor-pointer hover:text-red-500 transition"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <div>
                  <p className="p-5 sm:px-6 text-gray-500">
                    {t("subject.individual.transports_page.nodata")}
                  </p>
                </div>
              )}
            </Table>
            {transportIndividualList.length > 0 ? (
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
            ) : null}
          </div>
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            className="max-w-[500px] m-4"
          >
            <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
              <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {t("subject.individual.add_transport.modal_text")}
              </h4>
              <p className="text-gray-600 dark:text-white/80">
                {deleteMessage}
              </p>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={async () => {
                    if (!deleteId) return;
                    try {
                      await deleteTransportIndividual({
                        individualId: entityId,
                        transportId: deleteId,
                      }).unwrap();

                      toast.success("Транспорт откреплён успешно!");
                      refetch();
                      setIsDeleteModalOpen(false);
                      setDeleteId(null);
                    } catch (error: any) {
                      toast.error("Ошибка при откреплении транспорта.");
                    }
                  }}
                >
                  {t("subject.individual.add_transport.deattached_text")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  {t("subject.individual.add_transport.cancel")}
                </Button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={isOpen}
            onClose={closeModal}
            className="max-w-[500px] m-4"
          >
            <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
              <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {t("subject.individual.add_transport.check_text")}
              </h4>
              <p className="text-gray-600 dark:text-white/80">{modalMessage}</p>
              <div className="flex justify-end gap-3 mt-4">
                {canLink && (
                  <Button onClick={handleSaveTransport}>
                    {t("subject.individual.add_transport.link")}
                  </Button>
                )}
                <Button variant="outline" onClick={closeModal}>
                  {t("subject.individual.add_transport.close")}
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </ComponentCard>
    </>
  );
};

export default TransportIndividual;
