import { useState } from "react";
import {
  useDeleteDocumentTypeMutation,
  useEditDocumentTypeMutation,
  useGetAllDocumentTypesQuery,
} from "../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pencil, Trash2 } from "lucide-react";
import { TablePagination } from "@mui/material";
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
import Button from "@components/ui/button/Button";
import { useModal } from "@hooks/useModal";
import { useLocalization } from "@hooks/useLocalization";

const DOC_TYPES = [
  "DOC_USER",
  "LICENSE",
  "LICENSE_CARD",
  "CERTIFICATE",
  "SPECIAL_PERMITS",
  "E_TIR",
  "I_T_PERMITS",
] as const;

const DocumentTypeTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField] = useState("id");
  const { t } = useLocalization();

  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [refersEdit, setRefersEdit] = useState("");
  const [editUserType, setEditUserType] = useState<
    ("INDIVIDUAL" | "COMPANY" | "ENTREPRENEUR" | "TRANSPORT")[]
  >([]);
  const [editDocType, setEditDocType] =
    useState<(typeof DOC_TYPES)[number]>("DOC_USER");
  const [editDocView, setEditDocView] = useState("");
  const [editDescriptionLabel, setEditDescriptionLabel] = useState("");
  const [editDescriptionValues, setEditDescriptionValues] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, isError } = useGetAllDocumentTypesQuery({
    page: currentPage,
    size: itemsPerPage,
    sort: sortField,
  });

  const [editDocumentType] = useEditDocumentTypeMutation();
  const [deleteDocumentType] = useDeleteDocumentTypeMutation();

  const openModalEdit = (doc: any) => {
    setEditId(doc.id);
    setEditName(doc.name);
    setRefersEdit(doc.refers || "");
    setEditUserType(doc.userType ?? []);
    setEditDocType(doc.docType ?? "DOC_USER");
    setEditDocView(doc.docView || "");
    setEditDescriptionLabel(doc.descriptionLabel || "");
    setEditDescriptionValues(doc.descriptionValues || "");
    openModal();
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await editDocumentType({
        id: editId,
        name: editName,
        refers: refersEdit,
        userType: editUserType,
        docType: editDocType,
        docView: editDocView,
        descriptionLabel: editDescriptionLabel,
        descriptionValues: editDescriptionValues,
      }).unwrap();
      toast.success("Документ успешно сохранён!");
      closeModal();
    } catch (error) {
      toast.error("Ошибка при сохранении документа.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocumentType(id).unwrap();
      toast.success("Документ успешно удалён!");
    } catch (error) {
      toast.error("Ошибка при удалении документа.");
      console.error(error);
    }
  };

  if (isLoading) return <div className="p-4">Загрузка...</div>;
  if (isError || !data)
    return <div className="p-4 text-red-500">Ошибка загрузки данных.</div>;

  const { content = [], meta } = data;
  const totalCount = meta?.totalCount || 0;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-[2%]">
        <Table className="overflow-x-auto w-full">
          <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
            <TableRow className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
              >
                №
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
              >
                {t("references.document_types.name_table")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
              >
                {t("references.document_types.users")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
              >
                {t("references.document_types.doc_type")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
              >
                docView
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
              >
                Описания
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
              >
                Значения описания
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 dark:text-gray-300 text-end"
              >
                {t("references.common.actions")}
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.map((doc, index) => (
              <TableRow
                key={doc.id}
                className="bg-white dark:bg-gray-900 border-b dark:border-gray-700"
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {doc.name}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {doc.userType?.join(", ") || "—"}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {doc.docType}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {doc.docView || "—"}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {doc.descriptionLabel || "—"}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {doc.descriptionValues || "—"}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                  <div className="flex gap-2 justify-end">
                    <Pencil
                      onClick={() => openModalEdit(doc)}
                      className="w-5 h-5 cursor-pointer hover:text-blue-500 transition"
                    />
                    <Trash2
                      onClick={() => handleDelete(doc.id)}
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

        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[500px] m-4"
        >
          <div className="w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
            <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {t("references.document_types.edit")}
            </h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="flex flex-col space-y-4"
            >
              <div>
                <Label>{t("references.document_types.name_table")}</Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div>
                <Label>{t("references.document_types.users")}</Label>
                <div className="flex gap-2 flex-wrap">
                  {(
                    [
                      "INDIVIDUAL",
                      "COMPANY",
                      "ENTREPRENEUR",
                      "TRANSPORT",
                    ] as const
                  ).map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editUserType.includes(type)}
                        onChange={(e) => {
                          const t = type as
                            | "INDIVIDUAL"
                            | "COMPANY"
                            | "ENTREPRENEUR"
                            | "TRANSPORT";
                          if (e.target.checked) {
                            setEditUserType([...editUserType, t]);
                          } else {
                            setEditUserType(
                              editUserType.filter((item) => item !== t),
                            );
                          }
                        }}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>{t("references.document_types.doc_type")}</Label>
                <select
                  className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  value={editDocType}
                  onChange={(e) =>
                    setEditDocType(e.target.value as (typeof DOC_TYPES)[number])
                  }
                >
                  <option value="">
                    {t("references.document_types.choose_doc_type")}
                  </option>
                  {DOC_TYPES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>{t("references.document_types.doc_view")}</Label>
                <Input
                  value={editDocView}
                  onChange={(e) => setEditDocView(e.target.value)}
                  placeholder="NULL или значение"
                />
              </div>

              <div>
                <Label>Описания</Label>
                <Input
                  value={editDescriptionLabel}
                  onChange={(e) => setEditDescriptionLabel(e.target.value)}
                  placeholder="Описания"
                />
              </div>

              <div>
                <Label>Значения описания</Label>
                <Input
                  value={editDescriptionValues}
                  onChange={(e) => setEditDescriptionValues(e.target.value)}
                  placeholder="Значения описания"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  {t("references.common.cancel")}
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving
                    ? t("references.common.saving")
                    : t("references.common.save")}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default DocumentTypeTable;
