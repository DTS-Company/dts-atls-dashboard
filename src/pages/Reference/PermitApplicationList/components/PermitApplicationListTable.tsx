import { useState } from "react";
import {
  useDeletePermitApplicationListMutation,
  useEditPermitApplicationListMutation,
  useGetPermitApplicationListQuery,
} from "../api/api";
import { useGetAllDocumentTypesQuery } from "../../DocumentType/api/api";
import PermitApplicationListForm from "./PermitApplicationListForm";
import { ClipboardList, Pencil, Trash2 } from "lucide-react";
import { TablePagination } from "@mui/material";
import { useModal } from "@hooks/useModal";
import Button from "@components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Modal } from "@components/ui/modal";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import { toast } from "react-toastify";
import { useLocalization } from "@hooks/useLocalization";

const PermitApplicationListTable = () => {
  const { data: cities = [] } = useGetPermitApplicationListQuery();
  const totalCount = cities.length;
  const [editPermitApplicationList] = useEditPermitApplicationListMutation();
  const [deletePermitApplicationList] =
    useDeletePermitApplicationListMutation();
  const { isOpen, openModal, closeModal } = useModal();
  const {t} = useLocalization()

  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");
  const [editDocTypeId, setEditDocTypeId] = useState<string>("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const paginatedCities = cities.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const { data: allDocTypesData } = useGetAllDocumentTypesQuery({
    page: 0,
    size: 100,
    sort: "id",
  });

  const allDocTypes = allDocTypesData?.content || [];

  const openModalEdit = (
    id: number,
    title: string,
    text: string,
    idDocType: string
  ) => {
    setEditId(id);
    setEditTitle(title);
    setEditText(text);
    setEditDocTypeId(idDocType);
    openModal();
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!editId) return;
    try {
      await editPermitApplicationList({
        id: editId,
        title: editTitle,
        text: editText,
        idDocType: editDocTypeId,
      }).unwrap();
      toast.success("Лицензия успешно изменена!");
      closeModal();
    } catch {
      toast.error("Не удалось изменить данные.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePermitApplicationList(id).unwrap();
      toast.success("Лицензия успешно удалена!");
    } catch {
      toast.error("Не удалось удалить элемент. Попробуйте позже.");
    }
  };

  return (
    <>
      <div className="flex gap-4 items-center justify-between mt-[1%]">
        <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-4 h-12 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md dark:bg-gray-700">
            <ClipboardList className="text-gray-800 size-5 dark:text-white/90" />
          </div>
          <div className="text-start flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("references.licences.all")}
            </span>
            <h4 className="font-bold text-gray-800 text-lg dark:text-white/90">
              {totalCount}
            </h4>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Button onClick={() => setIsAddOpen(true)}>{t("references.licences.add_new")}</Button>
        </div>
      </div>

      <PermitApplicationListForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-4">
        <Table className="w-full">
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
                {t("references.licences.name_table")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
              >
                {t("references.licences.text")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
              >
                {t("references.licences.doc_type")}
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
            {paginatedCities.map((el) => (
              <TableRow
                key={el.id}
                className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {el.id}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {el.title}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {el.text}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {allDocTypes.find((d) => d.id === el.idDocType)?.name || (
                    <span className="text-gray-500 italic dark:text-gray-400">
                      Не указано
                    </span>
                  )}
                </TableCell>
                <TableCell className="px-4 py-3 text-end font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  <div className="flex gap-2 justify-end">
                    <Pencil
                      onClick={() =>
                        openModalEdit(el.id, el.title, el.text, el.idDocType)
                      }
                      className="w-5 h-5 cursor-pointer hover:text-blue-500 transition"
                    />
                    <Trash2
                      onClick={() => handleDelete(el.id)}
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
          count={cities.length}
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
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {t("references.licences.edit")}
          </h4>
          <form className="flex flex-col space-y-4">
            <div>
              <Label>{t("references.licences.name_table")}</Label>
              <Input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div>
              <Label>{t("references.licences.text")}</Label>
              <Input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            </div>
            <div>
              <Label>{t("references.licences.doc_type")}</Label>
              <select
                value={editDocTypeId}
                onChange={(e) => setEditDocTypeId(e.target.value)}
                className="w-full border rounded-md p-2"
              >
                {allDocTypes.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
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
    </>
  );
};

export default PermitApplicationListTable;
