import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import Button from "../../../../components/ui/button/Button";

import { useModal } from "../../../../hooks/useModal";
import { Modal } from "../../../../components/ui/modal";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import {
  useDeletePropertyMutation,
  useEditPropertyMutation,
  useGetPropertyQuery,
} from "../api/api";
import Alert from "../../../../components/ui/alert/Alert";
import { Pencil, Trash2 } from "lucide-react";

const PropertyTable = () => {
  const { data: propertyList = [] } = useGetPropertyQuery();
  const [editProperty, { error: editError }] = useEditPropertyMutation();
  const [deleteProperty, { error: deleteError }] = useDeletePropertyMutation();
  const { isOpen, openModal, closeModal } = useModal();
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(propertyList.length / itemsPerPage);
  const paginatedPropertyList = propertyList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModalEdit = (id: string, name: string) => {
    setEditId(id);
    setEditName(name);
    openModal();
  };

  const handleSave = async () => {
    await editProperty({ id: editId, name: editName });
    closeModal();
  };

  return (
    <>
      {/* Ошибки API (Alert) */}
      {deleteError && (
        <Alert
          variant="error"
          title="Ошибка удаления"
          message="⚠️ Не удалось удалить имущество.. Попробуйте позже."
        />
      )}
      {editError && (
        <Alert
          variant="error"
          title="Ошибка редактирования"
          message="⚠️ Не удалось изменить данные имущества.. Попробуйте позже."
        />
      )}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-[2%] ">
        <Table className="w-full">
          <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
            <TableRow className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
              >
                Название имущество
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-end text-theme-xs dark:text-gray-300"
              >
                Действия
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedPropertyList.map((property) => (
              <TableRow
                key={property.id}
                className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {property.name}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                  <div className="flex gap-2 justify-end">
                    <Pencil
                      onClick={() => openModalEdit(property.id, property.name)}
                      className="w-5 h-5 cursor-pointer hover:text-blue-500 transition"
                    />
                    <Trash2
                      onClick={() => deleteProperty(property.id)}
                      className="w-6 h-6 cursor-pointer hover:text-red-500 transition"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-center gap-2 py-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ←
          </Button>
          <Button>{currentPage}</Button>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            →
          </Button>
        </div>

        {/* Модальное окно редактирования */}
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[500px] m-4"
        >
          <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
            <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Изменить имущество
            </h4>
            <form className="flex flex-col space-y-4">
              <div>
                <Label>Название имущество</Label>
                <Input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Отмена
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Сохранить
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default PropertyTable;
