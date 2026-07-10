import { useNavigate } from "react-router";
import { useState } from "react";
import { Eye, Layout, Search } from "lucide-react";
import { TablePagination } from "@mui/material";
import {
  useDeleteTransportMutation,
  useGetAllTransportsQuery,
} from "../api/api";
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import Select from "@components/form/Select";
import Button from "@components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { usePermissions } from "@permissions/usePermissions";
import { useModal } from "@hooks/useModal";
import { Modal } from "@components/ui/modal";
import { toast } from "react-toastify";
import { useLocalization } from "@hooks/useLocalization";
import { TableLoadingAnimation } from "@components/common/TableLoadingAnimation";

const TransportTable = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [searchInput, setSearchInput] = useState("");
  const [pendingStatus, setPendingStatus] = useState("ALL");
  const [searchError, setSearchError] = useState("");

  const { data, isLoading, isFetching } = useGetAllTransportsQuery({
    page: currentPage,
    size: itemsPerPage,
    search,
    status: status === "ALL" ? undefined : status,
  });

  const { t } = useLocalization();

  const transportsList = data?.content || [];
  const totalCount = data?.meta.totalCount || 0;
  const [deleteTransport] = useDeleteTransportMutation();

  // const { hasPermission } = usePermissions();
  // const canAddNewTransport = hasPermission({
  //   name: "transport",
  //   path: "/api/v1/transport/",
  //   method: "POST",
  // });

  // const canEditTransport = hasPermission({
  //   name: "transport",
  //   path: "/api/v1/transport/{id}",
  //   method: "PUT",
  // });

  // const canDeleteTransport = hasPermission({
  //   name: "transport",
  //   path: "/api/v1/transport/{id}",
  //   method: "DELETE",
  // });

  // const handleEdit = (id: string) => {
  //   navigate(`/transport/TRANSPORT/edit/${id}`);
  // };
  const handleView = (id: string) => {
    navigate(`/transport/TRANSPORT/view/${id}`);
  };

  const containsRussianLetters = (text: string): boolean => {
    const russianRegex = /[\u0400-\u04FF]/;
    return russianRegex.test(text);
  };

  const validateSearchInput = (input: string): boolean => {
    if (containsRussianLetters(input)) {
      setSearchError("Пожалуйста, введите номер на латинском языке");
      return false;
    }
    setSearchError("");
    return true;
  };

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    if (value.trim() !== "") {
      validateSearchInput(value);
    } else {
      setSearchError("");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchInput.trim() !== "" && !validateSearchInput(searchInput)) {
    }

    setSearch(searchInput);
    setStatus(pendingStatus);
    setCurrentPage(1);
  };

  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const [transportToDelete, setTransportToDelete] = useState<{
    id: string;
    license_plate: string;
  } | null>(null);

  const handleDeleteClick = (transport: {
    id: string;
    license_plate: string;
  }) => {
    setTransportToDelete(transport);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    if (!transportToDelete) return;
    try {
      await deleteTransport(transportToDelete.id).unwrap();
      toast.success("Транспорт удален!");
    } catch (error) {
      toast.error("Ошибка при удалении транспорта!");
    } finally {
      setTransportToDelete(null);
      closeDeleteModal();
    }
  };

  return (
    <>
      <PageMeta title={t("transport_table.title")} description="" />
      <PageBreadcrumb pageTitle={t("transport_table.title")} />
      <ComponentCard title={t("transport_table.title")}>
        <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex gap-4 items-center dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-center bg-gray-100 w-14 h-14 rounded-xl dark:bg-gray-700">
              <Layout className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="text-start">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("transport_table.count")}
              </span>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {isLoading || isFetching ? (
                  <span className="inline-block w-5 h-5 border-2 border-gray-300 rounded-full animate-spin border-t-gray-800" />
                ) : (
                  totalCount
                )}
              </h4>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
          <div className="flex flex-col items-start justify-end gap-4 p-4 mb-2 sm:flex-row sm:items-center">
            <form
              onSubmit={handleSearch}
              className="flex flex-col items-stretch w-full gap-3 sm:flex-row sm:items-center sm:w-auto"
            >
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <Search className="text-gray-400 dark:text-gray-500" />
                </span>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  placeholder={`${t("transport_table.search")}`}
                  className={`dark:bg-dark-900 h-11 w-full rounded-lg border ${
                    searchError
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-brand-300 dark:border-gray-600 dark:focus:border-brand-800"
                  } bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring focus:ring-brand-500/10 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 xl:w-[430px]`}
                />
                {searchError && (
                  <div className="absolute left-0 mt-1 top-full">
                    <p className="text-xs text-red-500 dark:text-red-400 max-w-[430px]">
                      {searchError}
                    </p>
                  </div>
                )}
              </div>
              <div className="w-full mt-3 sm:mt-0 sm:w-auto">
                <Select
                  value={pendingStatus}
                  onChange={(val) => setPendingStatus(val)}
                  options={[
                    { value: "ALL", label: t("transport_table.all") },
                    { value: "ATTACHED", label: t("transport_table.attached") },
                    {
                      value: "NOT ATTACHED",
                      label: t("transport_table.not_attached"),
                    },
                  ]}
                />
              </div>

              <Button disabled={!!searchError && searchInput.trim() !== ""}>
                {t("transport_table.search_button")}
              </Button>
            </form>

            {/* {canAddNewTransport && (
              <Button
                onClick={() => navigate(`/transport/add-new-transport`)}
                className="w-full mt-3 sm:mt-0 sm:ml-3 sm:w-auto"
              >
                {t("transport_table.add_new")}
              </Button>
            )} */}
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full min-w-[600px]">
              <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
                <TableRow className="bg-gray-100 rounded-lg shadow-md dark:bg-gray-800">
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    №
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("transport_table.licence_plate")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("transport_table.car_brand")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("transport_table.type")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("transport_table.owner")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("transport_table.object_name")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-600 text-end text-theme-xs dark:text-gray-300"
                  >
                    {t("transport_table.actions")}
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading || isFetching ? (
                  <TableLoadingAnimation />
                ) : transportsList.length > 0 ? (
                  transportsList.map((transport: any, index) => (
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
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {transport.license_plate}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {transport.car_brand}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {transport.type}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {transport.owner}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {transport.object_name === "NOT ATTACHED" ? (
                            <span className="italic text-gray-500 dark:text-gray-400">
                              {t("transport_table.now_attached_text")}
                            </span>
                          ) : (
                            transport.object_name
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                        <div className="flex justify-end gap-2">
                          <Eye
                            size={24}
                            onClick={() => handleView(transport.id)}
                            className="transition cursor-pointer hover:text-green-500"
                          />
                          {/* {canEditTransport && (
                            <Pencil
                              size={24}
                              onClick={() => handleEdit(transport.id)}
                              className="transition cursor-pointer hover:text-blue-500"
                            />
                          )}
                          {canDeleteTransport && (
                            <Trash2
                              size={24}
                              onClick={() =>
                                handleDeleteClick({
                                  id: transport.id,
                                  license_plate: transport.license_plate,
                                })
                              }
                              className="transition cursor-pointer hover:text-red-500"
                            />
                          )} */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <div>
                    <p className="p-5 text-gray-500 sm:px-6">
                      {t("transport_table.nodata")}
                    </p>
                  </div>
                )}
              </TableBody>
            </Table>
          </div>
          {transportsList.length > 0 && (
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
                `${from}-${to} ${t("common.from_to")} ${count}`
              }
              SelectProps={{
                className:
                  "bg-white dark:bg-gray-600 text-gray-900 dark:text-white",
              }}
            />
          )}
        </div>
        <Modal
          isOpen={isDeleteOpen}
          onClose={closeDeleteModal}
          className="max-w-[400px] m-4"
        >
          <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
            <h4 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">
              {t("transport_table.modal.header")}
            </h4>
            <p className="mb-5 text-gray-600 dark:text-gray-400">
              {t("transport_table.modal.second_text")}{" "}
              <strong>{transportToDelete?.license_plate}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-500"
                onClick={handleDeleteConfirm}
              >
                {t("transport_table.modal.delete")}
              </Button>
              <Button size="sm" variant="outline" onClick={closeDeleteModal}>
                {t("transport_table.modal.cancel")}
              </Button>
            </div>
          </div>
        </Modal>
      </ComponentCard>
    </>
  );
};

export default TransportTable;
