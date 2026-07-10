import { useState } from "react";
import {
  useDeleteCompanyTypeMutation,
  useEditCompanyTypeMutation,
  useGetCompanyTypeQuery,
} from "../api/api";
import { toast } from "react-toastify";
import { Pencil, Trash2 } from "lucide-react";
import { TablePagination } from "@mui/material";
import { useModal } from "@hooks/useModal";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@components/ui/table";
import { Modal } from "@components/ui/modal";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import { useLocalization } from "@hooks/useLocalization";

const CompanyTypeTable = () => {
  const {
    data: companyTypes = [],
    isLoading,
    isError,
  } = useGetCompanyTypeQuery();
  const [editCompanyType, { isLoading: isEditing }] =
    useEditCompanyTypeMutation();
  const [deleteCompanyType, { isLoading: isDeleting }] =
    useDeleteCompanyTypeMutation();
  const {t} = useLocalization()

  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [deleteName, setDeleteName] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalCount = companyTypes.length;
  const paginatedCompanyTypes = companyTypes.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const openModalEdit = (id: string, name: string) => {
    setEditId(id);
    setEditName(name);
    openModal();
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
    openDeleteModal();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.warning("Введите название типа компании!");
      return;
    }
    try {
      await editCompanyType({ id: editId, name: editName.trim() }).unwrap();
      toast.success("Тип компании успешно изменён!");
      handleEditModalClose();
    } catch (error: any) {
      console.error("Edit error:", error);
      toast.error(error.data?.message || "Ошибка при изменении типа компании.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCompanyType(deleteId).unwrap();
      toast.success("Тип компании успешно удалён!");
      handleDeleteModalClose();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(
        error.data?.message ||
          "Не удалось удалить тип компании. Попробуйте позже."
      );
    }
  };

  const handleEditModalClose = () => {
    setEditId("");
    setEditName("");
    closeModal();
  };

  const handleDeleteModalClose = () => {
    setDeleteId("");
    setDeleteName("");
    closeDeleteModal();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600 dark:text-gray-400">Загрузка...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-600 dark:text-red-400">
          Ошибка загрузки данных
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-[2%]">
      <Table className="w-full">
        <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
          <TableRow className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
            >
              {t("references.company_types.name_table")}
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-600 text-end text-theme-xs dark:text-gray-300"
            >
              {t("references.common.actions")}
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedCompanyTypes.map((companyType) => (
            <TableRow
              key={companyType.id}
              className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <TableCell className="px-5 py-4 sm:px-6 text-start">
                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {companyType.name}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                <div className="flex gap-2 justify-end">
                  <Pencil
                    onClick={() =>
                      openModalEdit(companyType.id, companyType.name)
                    }
                    className="w-5 h-5 cursor-pointer hover:text-blue-500 transition"
                  />
                  <Trash2
                    onClick={() =>
                      handleDeleteClick(companyType.id, companyType.name)
                    }
                    className="w-6 h-6 cursor-pointer hover:text-red-500 transition"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {companyTypes.length > 0 && (
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
        />
      )}

      {companyTypes.length === 0 && (
        <div className="flex justify-center items-center p-8">
          <div className="text-gray-500 dark:text-gray-400">
            {t("references.company_types.nodata")}
          </div>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={handleEditModalClose}
        className="max-w-[500px] m-4"
      >
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {t("references.company_types.edit")} 
          </h4>
          <form className="flex flex-col space-y-4" onSubmit={handleSave}>
            <div>
              <Label>{t("references.company_types.name_table")} </Label>
              <Input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder={`${t("references.company_types.placeholder")}`}
                />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={handleEditModalClose}
                disabled={isEditing}
              >
                {t("references.common.cancel")}
              </Button>
              <Button size="sm" disabled={isEditing || !editName.trim()}>
                {isEditing ? t("references.common.saving") : t("references.common.save")}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={handleDeleteModalClose}
        className="max-w-[400px] m-4"
      >
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
            {t("references.common.confirm")}
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-5">
            {t("references.company_types.confirm_text")}{" "} 
            <strong>"{deleteName}"</strong>? {t("references.common.cant_cancel")}
          </p>
          <div className="flex justify-end gap-3"> 
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-500" 
              onClick={handleDeleteConfirm} 
              disabled={isDeleting}
            >
              {isDeleting ? t("references.common.deleting") : t("references.common.delete")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDeleteModalClose}
              disabled={isDeleting}
            >
              {t("references.common.cancel")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyTypeTable;
