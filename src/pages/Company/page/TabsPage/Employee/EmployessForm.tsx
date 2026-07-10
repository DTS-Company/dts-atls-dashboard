import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Search, UserX } from "lucide-react";
import { toast } from "react-toastify";
import { useModal } from "@hooks/useModal";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Modal } from "@components/ui/modal";
import { useLazyCheckIndividualINNQuery } from "@pages/Individual/api/api";
import {
  useAddIndividualMutation,
  useDeleteIndividualMutation,
  useGetIndividualsQuery,
} from "@pages/Company/api/api";
import {
  TIndividual,
  TIndividualResponse,
} from "@pages/Individual/types/types";
import { TablePagination } from "@mui/material";
import { useLocalization } from "@hooks/useLocalization";

const EmployessForm = () => {
  const params = useParams();
  const entityId = params.id!;
  const position = params.type!;
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { t } = useLocalization();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: individualCompanies, refetch } = useGetIndividualsQuery({
    page: currentPage - 1,
    size: itemsPerPage,
    position,
    entityId,
    search: debouncedSearch,
  });

  const individuals: TIndividual[] =
    (individualCompanies as TIndividualResponse)?.content || [];
  const totalCount = individualCompanies?.meta.totalCount || 0;

  const [checkIndividualInn] = useLazyCheckIndividualINNQuery();
  const [addIndividual] = useAddIndividualMutation();
  const [deleteIndividual] = useDeleteIndividualMutation();

  const [tin, setTin] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [canLink, setCanLink] = useState(false);
  const [individualId, setIndividualId] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingIndividualId, setDeletingIndividualId] = useState("");

  const positionTitle =
    position === "DRIVER"
      ? t("subject.company.employees_page.first_role")
      : position === "DOCTOR"
        ? t("subject.company.employees_page.fourth_role")
        : position === "MECHANIC"
          ? t("subject.company.employees_page.third_role")
          : position === "DISPATCHER"
            ? t("subject.company.employees_page.second_role")
            : "Сотрудник";

  const positionLabelMap: Record<string, string> = {
    DRIVER: "водителя",
    DOCTOR: "врача",
    MECHANIC: "механика",
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleCheckIndividual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tin.trim()) {
      toast.warning("Поле ИНН не может быть пустым!");
      return;
    }

    try {
      const result = await checkIndividualInn(tin).unwrap();

      if (!result.exists) {
        setModalMessage("ИНН не найден");
        setCanLink(false);
      } else {
        setModalMessage(
          `ИНН найден. Хотите связать этот ИНН с вашей компанией?: ${
            result.individualId?.individualId || "N/A"
          }`,
        );
        setIndividualId(result.individualId?.id || "");
        setCanLink(true);
      }

      openModal();
    } catch (error: any) {
      if (error?.status === 404) toast.warning("ИНН не найден!");
      else if (error?.status === 409)
        toast.warning("ИНН уже связан с другой компанией");
      else toast.error("Ошибка при проверке ИНН");
    }
  };

  const handleSaveIndividual = async () => {
    if (!canLink || !individualId) return;

    try {
      await addIndividual({
        id: entityId!,
        individualId,
        position: position!,
      }).unwrap();

      toast.success("Новый сотрудник успешно добавлен!");
      refetch();
      closeModal();
      setTin("");
    } catch (error: any) {
      if (error?.status === 409)
        toast.warning("ИНН уже связан с другой компанией");
      else toast.error("Ошибка при сохранении сотрудника");
    }
  };

  const confirmDeleteIndividual = (id: string) => {
    setDeletingIndividualId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteIndividual = async () => {
    try {
      await deleteIndividual({
        id: entityId!,
        individualId: deletingIndividualId,
      }).unwrap();
      toast.success("Сотрудник успешно удален!");
      refetch();
      setDeleteModalOpen(false);
    } catch {
      toast.error("Ошибка при удалении сотрудника");
      setDeleteModalOpen(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle={positionTitle} />
      <ComponentCard title={positionTitle}>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
          <div className="grid justify-between grid-cols-1 gap-4 p-4 sm:flex sm:grid-cols-2">
            <div className="flex gap-2">
              <form onSubmit={handleCheckIndividual} className="flex gap-2">
                <div className="relative">
                  <Input
                    placeholder={`${t("subject.company.employees_table.inn")}`}
                    value={tin}
                    onChange={(e) => setTin(e.target.value)}
                  />
                </div>
                <Button>{t("subject.company.employees_form.check")}</Button>
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
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={`${t("subject.individual.table.search")}`}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-600 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                  />
                </div>
                <Button className="ml-4">
                  {t("subject.individual.table.search_button")}
                </Button>
              </form>
            </div>

            <Button disabled onClick={() => navigate("/individual/1")}>
              + {t("subject.company.employees_form.add")}{" "}
              {positionLabelMap[position!] ||
                t("subject.company.employees_form.employee")}
            </Button>
          </div>

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
                  {t("subject.company.employees_table.inn")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  {t("subject.company.employees_table.fullname")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  {t("subject.company.employees_table.phone")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-end text-theme-xs dark:text-gray-300"
                >
                  {t("subject.company.employees_form.delete")}
                </TableCell>
              </TableRow>
            </TableHeader>

            {individuals.length > 0 ? (
              <TableBody>
                {individuals.map((individual, index) => (
                  <TableRow
                    key={individual.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700"
                  >
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-5 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {individual.tin}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-5 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {individual.individualName}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-5 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {individual.username || (
                          <span className="italic text-gray-500 dark:text-gray-400">
                            {t("subject.company.employees_table.not_specified")}
                          </span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                      <div className="flex justify-end gap-2">
                        <UserX
                          onClick={() => confirmDeleteIndividual(individual.id)}
                          className="w-6 h-6 transition cursor-pointer hover:text-red-500"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <div>
                <p className="p-5 text-gray-500 dark:text-gray-400">
                  {t("subject.company.employees_table.nodata")}
                </p>
              </div>
            )}
          </Table>
          {individuals.length > 0 ? (
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
              labelRowsPerPage={`${t("common.rows_per_page")}:`}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} ${t("common.from_to")} ${count}`
              }
            />
          ) : null}

          <Modal
            isOpen={isOpen}
            onClose={closeModal}
            className="max-w-[500px] m-4"
          >
            <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
              <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {t("subject.company.employees_form.check_text")}
              </h4>
              <p className="text-gray-600 dark:text-white/80">{modalMessage}</p>
              <div className="flex justify-end gap-3 mt-4">
                {canLink && (
                  <Button onClick={handleSaveIndividual}>
                    {t("subject.company.employees_form.link")}
                  </Button>
                )}
                <Button variant="outline" onClick={closeModal}>
                  {t("subject.company.employees_form.close")}
                </Button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            className="max-w-[500px] m-4"
          >
            <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
              <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {t("subject.company.employees_form.modal_text")}
              </h4>
              <p className="text-gray-600 dark:text-white/80">
                {t("subject.company.employees_form.delete_question")}
              </p>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  onClick={handleDeleteIndividual}
                  className="bg-red-600 hover:bg-red-500"
                >
                  {t("subject.company.employees_form.delete_text")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  {t("subject.company.employees_form.cancel")}
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </ComponentCard>
    </>
  );
};

export default EmployessForm;
