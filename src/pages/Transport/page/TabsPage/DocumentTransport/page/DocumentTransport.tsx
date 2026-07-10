import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { FileCheck, FileX, Pencil, Trash2 } from "lucide-react";
import { TablePagination } from "@mui/material";
import { toast } from "react-toastify";

import ComponentCard from "@components/common/ComponentCard";
import Button from "@components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { TableLoadingAnimation } from "@components/common/TableLoadingAnimation";

import { useLocalization } from "@hooks/useLocalization";
import { useModal } from "@hooks/useModal";
import { usePermissions } from "@permissions/usePermissions";
import {
  useGetDocumentByTypeQuery,
  useDeleteDocumentMutation,
} from "@pages/Individual/page/TabsPage/DocumentIndividual/api/api";
import { useReadFileQuery } from "@pages/Reference/Storage/reducers/files";
import DocumentFormModal from "@pages/Individual/page/TabsPage/DocumentIndividual/components/documentFormModal";
import { StatusBadge } from "@utils/StatusBadge";
import { Modal } from "@components/ui/modal";

const DocumentTransport = () => {
  const { id, entityType, docType: urlDocType } = useParams();

  const entityId = id || "";
  const currentDocType = urlDocType || "DOC_USER";
  const currentEntityType = entityType || "TRANSPORT";

  const { t } = useLocalization();
  const { isOpen, openModal, closeModal } = useModal();
  const { hasPermission } = usePermissions();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<any>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data: documents = [], isLoading } = useGetDocumentByTypeQuery(
    entityId ? { entityId, docType: currentDocType } : skipToken,
  );

  const { data: fileData } = useReadFileQuery(
    entityId && fileName ? { entityId, filename: fileName } : skipToken,
  );

  const [deleteDocument, { isLoading: isDeleting }] =
    useDeleteDocumentMutation();

  const canEdit = hasPermission({
    name: "document",
    method: "PUT",
    path: "/api/v1/{entityId}/document/{id}",
  });

  const canDelete = hasPermission({
    name: "document",
    method: "DELETE",
    path: "/api/v1/{entityId}/document/{id}",
  });

  useEffect(() => {
    if (fileData && fileName) {
      const blobUrl = URL.createObjectURL(fileData);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
      setFileName(null);
    }
  }, [fileData, fileName]);

  const handleDownload = (documentLink: string) => {
    const extractedFileName = documentLink.split("/").pop();
    if (extractedFileName) setFileName(extractedFileName);
  };

  const handleEdit = (doc: any) => {
    setEditingDocument(doc);
    openModal();
  };

  const handleDeleteClick = (doc: any) => {
    setDocumentToDelete(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!documentToDelete || !entityId) return;

    try {
      await deleteDocument({
        entityId,
        id: documentToDelete.id,
      }).unwrap();

      toast.success("Документ успешно удален!");
      setIsDeleteModalOpen(false);
      setDocumentToDelete(null);
    } catch (err: any) {
      let errorMessage = "Ошибка при удалении документа";
      if (err.status === 401) {
        errorMessage = "Ошибка авторизации. Пожалуйста, войдите снова.";
      } else if (err.status === 404) {
        errorMessage = "Документ не найден";
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  const handleAddNew = () => {
    setEditingDocument(null);
    openModal();
  };

  const paginatedDocs = documents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <>
      <ComponentCard title="Документы транспортного средства">
        <div className="flex justify-end p-4">
          <Button onClick={handleAddNew}>
            {t("subject.individual.document_form.add")}
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/[0.05] dark:bg-gray-800 mt-6">
          <Table className="w-full">
            <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
              <TableRow className="bg-gray-100 rounded-lg shadow-md dark:bg-gray-800">
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                >
                  №
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  Номер
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  Кем выдан
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  isHeader
                >
                  Дата выдачи
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  Дата окончания
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                >
                  Статус
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-end text-theme-xs dark:text-gray-300"
                >
                  Файл
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
              {isLoading ? (
                <TableLoadingAnimation />
              ) : documents.length > 0 ? (
                paginatedDocs.map((doc: any, index) => (
                  <TableRow
                    key={doc.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700"
                  >
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {doc.identificationNumber || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {doc.issuingAuthority || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {doc.documentDate || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {doc.documentDateEnd || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <StatusBadge status={doc.checkStatus} />
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-end">
                      {doc.documentLink ? (
                        <Tippy content="Скачать">
                          <button
                            onClick={() => handleDownload(doc.documentLink)}
                            className="inline-flex items-center text-green-600 transition hover:text-green-800"
                          >
                            <FileCheck size={20} />
                          </button>
                        </Tippy>
                      ) : (
                        <Tippy content="Файл отсутствует">
                          <button className="inline-flex items-center text-red-600">
                            <FileX size={20} />
                          </button>
                        </Tippy>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                      <div className="flex justify-end gap-2">
                        {canEdit && (
                          <Tippy content="Редактировать">
                            <Pencil
                              size={20}
                              className="transition cursor-pointer hover:text-blue-500"
                              onClick={() => handleEdit(doc)}
                            />
                          </Tippy>
                        )}
                        {canDelete && (
                          <Tippy content="Удалить">
                            <Trash2
                              size={20}
                              className="transition cursor-pointer hover:text-red-500"
                              onClick={() => handleDeleteClick(doc)}
                            />
                          </Tippy>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-gray-500">
                    Нет доступных документов для отображения
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {documents.length > 0 && (
            <TablePagination
              className="table-pagination"
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={documents.length}
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
          )}
        </div>
      </ComponentCard>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        showCloseButton={false}
      >
        <div className="p-6">
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Вы уверены, что хотите удалить документ{" "}
            <span className="font-semibold">
              {documentToDelete?.identificationNumber || ""}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="text-white bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </div>
        </div>
      </Modal>

      <DocumentFormModal
        isOpen={isOpen}
        onClose={() => {
          setEditingDocument(null);
          closeModal();
        }}
        entityId={entityId}
        entityType={currentEntityType}
        documentType={currentDocType}
        editingDocument={editingDocument}
      />
    </>
  );
};

export default DocumentTransport;
