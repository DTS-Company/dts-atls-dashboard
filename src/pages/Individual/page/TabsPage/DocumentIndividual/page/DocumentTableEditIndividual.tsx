import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import { skipToken } from "@reduxjs/toolkit/query";
import { ChevronRight, FileCheck, FileX, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { TablePagination } from "@mui/material";
import {
  useDeleteDocumentMutation,
  useGetDocumentByTypeQuery,
} from "../api/api";
import { useModal } from "@hooks/useModal";
import Button from "@components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useReadFileQuery } from "@pages/Reference/Storage/reducers/files";
import { usePermissions } from "@permissions/usePermissions";
import DocumentFormModal from "../components/documentFormModal";
import { Modal } from "@components/ui/modal";
import { useLocalization } from "@hooks/useLocalization";
import { useGetIndividualsQuery } from "@pages/Individual/api/api";
import { StatusBadge } from "@utils/StatusBadge";
import { TableLoadingAnimation } from "@components/common/TableLoadingAnimation";

const DocumentTableEditIndividual = () => {
  const params = useParams();
  const entityId = params.entityId!;
  const type = params.docType!;
  const entityType = params.entityType!;
  const { t } = useLocalization();

  const { isOpen, openModal, closeModal } = useModal();
  const [deleteDocument] = useDeleteDocumentMutation();
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{
    id: string;
    identificationNumber: string;
  } | null>(null);

  const openDeleteModal = (document: {
    id: string;
    identificationNumber: string;
  }) => {
    setDocumentToDelete(document);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDocumentToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteDocument = async () => {
    if (!documentToDelete) return;
    try {
      await deleteDocument({ entityId, id: documentToDelete.id }).unwrap();
      toast.success("Документ успешно удален!");

      const newTotalCount = totalCount - 1;
      const maxPage = Math.ceil(newTotalCount / itemsPerPage);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage);
      }
    } catch {
      toast.error("Ошибка при удалении документа.");
    } finally {
      closeDeleteModal();
    }
  };

  const { data: documents = [], isLoading: isDocumentsLoading } =
    useGetDocumentByTypeQuery(
      entityId && type ? { entityId, docType: type } : skipToken,
    );

  const { data: fileData } = useReadFileQuery(
    entityId && fileName ? { entityId, filename: fileName } : skipToken,
  );

  const totalCount = documents.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDocuments = documents.slice(startIndex, endIndex);

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
    setFileName(extractedFileName || null);
  };

  const handleEdit = (document: any) => {
    setEditingDocument(document);
    openModal();
  };

  const handleAddNew = () => {
    setEditingDocument(null);
    openModal();
  };

  const handleModalClose = () => {
    setEditingDocument(null);
    closeModal();
  };

  const typeTitle =
    type === "DOC_USER"
      ? t("subject.individual.documents_page.doc_user")
      : type === "LICENSE"
        ? t("subject.individual.documents_page.licence")
        : type === "LICENSE_CARD"
          ? t("subject.individual.documents_page.licence_card")
          : type === "CERTIFICATE"
            ? t("subject.individual.documents_page.certificate")
            : type === "SPECIAL_PERMITS"
              ? t("subject.individual.documents_page.special_permits")
              : type === "E_TIR"
                ? "E_TIR"
                : type === "I_T_PERMITS"
                  ? t("subject.individual.documents_page.it_permits")
                  : "Документ";

  const { data, isLoading: isIndividualsLoading } = useGetIndividualsQuery({
    page: 1,
    limit: 100,
  });
  const individual = data?.content?.find((item) => item.id === entityId);

  const { hasPermission } = usePermissions();
  const canEditDocuments = hasPermission({
    name: "document",
    path: "/api/v1/{entityId}/document/{id}",
    method: "PUT",
  });
  const canDeleteDocuments = hasPermission({
    name: "document",
    path: "/api/v1/{entityId}/document/{id}",
    method: "DELETE",
  });

  const isLoading = isDocumentsLoading || isIndividualsLoading;

  return (
    <>
      <PageBreadcrumb
        pageTitle={
          <>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/registeredIndividuals/INDIVIDUAL"
            >
              Физические лица
              <ChevronRight size={18} />
            </Link>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to={`/registeredIndividuals/INDIVIDUAL/edit/${individual?.id}?tabs=documents`}
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("subject.individual.edit.title")}:{" "}
                <span className="text-gray-800 dark:text-white/90">
                  {individual?.individualName || "Неизвестно"}
                </span>
              </span>
              <ChevronRight size={18} />
            </Link>

            {typeTitle}
          </>
        }
      />
      <ComponentCard title={typeTitle}>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
          <div className="flex justify-end gap-4 p-4">
            <Button onClick={handleAddNew}>
              {t("subject.individual.document_form.add")}
            </Button>
          </div>
          <Table className="w-full">
            <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
              <TableRow className="bg-gray-100 rounded-lg shadow-md dark:bg-gray-800">
                <TableCell
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  isHeader
                >
                  №
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  isHeader
                >
                  {t("subject.individual.document_form.doc_num")}
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  isHeader
                >
                  {t("subject.individual.document_form.given")}
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  isHeader
                >
                  {t("subject.individual.document_form.doc_date_end")}
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  isHeader
                >
                  {t("subject.individual.document_form.doc_type")}
                </TableCell>
                <TableCell className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300">
                  {t("subject.individual.document_form.status")}
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  isHeader
                >
                  {t("subject.individual.document_form.file")}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-end text-theme-xs dark:text-gray-300"
                >
                  {t("subject.individual.document_form.actions")}
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableLoadingAnimation />
              ) : paginatedDocuments.length > 0 ? (
                paginatedDocuments.map((document: any, index: number) => (
                  <TableRow
                    className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700"
                    key={document.id}
                  >
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {document.identificationNumber}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {document.issuingAuthority}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {document.documentDateEnd}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {document.type?.name || "Не указан"}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-white/90 whitespace-nowrap">
                      <StatusBadge status={document.checkStatus} />
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {document.documentLink ? (
                        <Tippy
                          content={t(
                            "subject.individual.document_form.tooltip_text",
                          )}
                        >
                          <button
                            onClick={() =>
                              handleDownload(document.documentLink)
                            }
                            className="flex items-center space-x-2 text-green-600 transition hover:text-green-800"
                          >
                            <FileCheck size={20} />
                          </button>
                        </Tippy>
                      ) : (
                        <Tippy
                          content={t(
                            "subject.individual.document_form.tooltip_error_text",
                          )}
                        >
                          <button className="flex items-center space-x-2 text-red-600 transition hover:text-red-800">
                            <FileX size={20} />
                          </button>
                        </Tippy>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                      <div className="flex justify-end gap-2">
                        {canEditDocuments && (
                          <Pencil
                            onClick={() => handleEdit(document)}
                            className="w-6 h-6 transition cursor-pointer hover:text-blue-500"
                          />
                        )}
                        {canDeleteDocuments && (
                          <Trash2
                            onClick={() =>
                              openDeleteModal({
                                id: document.id,
                                identificationNumber:
                                  document.identificationNumber,
                              })
                            }
                            className="w-6 h-6 transition cursor-pointer hover:text-red-500"
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <div>
                  <p className="p-5 text-gray-500 sm:px-6">
                    {t("subject.individual.document_form.nodata")}
                  </p>
                </div>
              )}
            </TableBody>
          </Table>

          {!isLoading && totalCount > 0 && (
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
        onClose={closeDeleteModal}
        className="max-w-[450px] text-start m-4"
      >
        <div className="p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {t("subject.individual.document_form.modal.header")}
          </h4>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {t("subject.individual.document_form.modal.question")}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeDeleteModal}>
              {t("subject.individual.document_form.modal.cancel")}
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-700"
              onClick={confirmDeleteDocument}
            >
              {t("subject.individual.document_form.modal.delete")}
            </Button>
          </div>
        </div>
      </Modal>

      <DocumentFormModal
        isOpen={isOpen}
        onClose={handleModalClose}
        entityId={entityId}
        entityType={entityType}
        documentType={type}
        editingDocument={editingDocument}
      />
    </>
  );
};

export default DocumentTableEditIndividual;
