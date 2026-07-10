import { useState } from "react";
import {
  useDeleteCityMutation,
  useEditCityMutation,
  useGetCityQuery,
} from "../api/api";
import { toast } from "react-toastify";
import { Pencil, Trash2 } from "lucide-react";
import { TablePagination } from "@mui/material";
import { useModal } from "@hooks/useModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Modal } from "@components/ui/modal";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import Label from "@components/form/Label";
import { useLocalization } from "@hooks/useLocalization";

const CityTable = () => {
  const { data: cities = [] } = useGetCityQuery();
  const [editCity] = useEditCityMutation();
  const [deleteCity] = useDeleteCityMutation();
  const { t } = useLocalization();

  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalCount = cities.length;
  const paginatedCities = cities.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const openModalEdit = (id: string, name: string) => {
    setEditId(id);
    setEditName(name);
    openModal();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Название не может быть пустым");
      return;
    }
    try {
      await editCity({
        id: editId,
        name: editName.trim(),
      }).unwrap();
      closeModal();
      setEditName("");
      setEditId("");
      toast.success("Город/Район успешно изменён!");
    } catch (error: any) {
      console.error("Edit error:", error);
      toast.error(error.data?.message || "Ошибка при изменении Город/Района.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCity(deleteId).unwrap();
      toast.success("Город/Район успешно удалён!");
      closeDeleteModal();
      setDeleteId("");
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(
        error.data?.message ||
          "Не удалось удалить Город/Район. Попробуйте позже."
      );
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-[2%]">
      <Table className="w-full">
        <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
          <TableRow className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
            >
              {t("references.cities.name_table")}
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
          {paginatedCities.map((city) => (
            <TableRow
              key={city.id}
              className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <TableCell className="px-5 py-4 sm:px-6 text-start">
                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {city.name}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                <div className="flex gap-2 justify-end">
                  <Pencil
                    onClick={() => openModalEdit(city.id, city.name)}
                    className="w-5 h-5 cursor-pointer hover:text-blue-500 transition"
                  />
                  <Trash2
                    onClick={() => {
                      setDeleteId(city.id);
                      openDeleteModal();
                    }}
                    className="w-6 h-6 cursor-pointer hover:text-red-500 transition"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {t("references.cities.edit")}
          </h4>
          <form className="flex flex-col space-y-4">
            <div>
              <Label>{t("references.cities.name_table")}</Label>
              <Input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button size="sm" variant="outline" onClick={closeModal}>
                {t("references.common.cancel")}
              </Button>
              <Button size="sm" onClick={handleSave}>
                {t("references.common.save")}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        className="max-w-[400px] m-4"
      >
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
            {t("references.common.confirm")}
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-5">
            {t("references.cities.confirm_text")}
          </p>
          <div className="flex justify-end gap-3">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-500"
              onClick={handleDeleteConfirm}
            >
              {t("references.common.delete")}
            </Button>
            <Button size="sm" variant="outline" onClick={closeDeleteModal}>
              {t("references.common.cancel")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CityTable;
