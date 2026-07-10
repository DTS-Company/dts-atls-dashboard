import { Link, useParams } from "react-router";
import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { ChevronRight, FileCheck, FileX } from "lucide-react";
import { useGetDocumentByTypeQuery } from "../api/api";
import ComponentCard from "@components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import { useReadFileQuery } from "@pages/Reference/Storage/reducers/files";
import { useLocalization } from "@hooks/useLocalization";
import { useGetEntrepreneurByIdQuery } from "@pages/Entrepreneur/api/api";
import { TableLoadingAnimation } from "@components/common/TableLoadingAnimation";
import { TablePagination } from "@mui/material";

const DocumentTableViewEntrepreneur = () => {
  const { entityId, docType } = useParams();
  const { t } = useLocalization();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data: entrepreneurData, isLoading: isEntrepreneurLoading } =
    useGetEntrepreneurByIdQuery(entityId!);
  const entrepreneur = entrepreneurData?.content;

  const { data: documents = [], isLoading: isDocumentsLoading } =
    useGetDocumentByTypeQuery(
      entityId && docType ? { entityId, docType } : skipToken,
    );

  const [fileName, setFileName] = useState<string | null>(null);
  const { data: fileData } = useReadFileQuery(
    entityId && fileName ? { entityId, filename: fileName } : skipToken,
  );

  const handleDownload = (documentLink: string) => {
    const extractedFileName = documentLink.split("/").pop();
    setFileName(extractedFileName || null);

    if (fileData) {
      const blobUrl = URL.createObjectURL(fileData);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = extractedFileName || "document";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    }
  };

  const typeTitle =
    docType === "DOC_USER"
      ? t("subject.individual.documents_page.doc_user")
      : docType === "LICENSE"
        ? t("subject.individual.documents_page.licence")
        : docType === "LICENSE_CARD"
          ? t("subject.individual.documents_page.licence_card")
          : docType === "CERTIFICATE"
            ? t("subject.individual.documents_page.certificate")
            : docType === "SPECIAL_PERMITS"
              ? t("subject.individual.documents_page.special_permits")
              : docType === "E_TIR"
                ? "E_TIR"
                : docType === "I_T_PERMITS"
                  ? t("subject.individual.documents_page.it_permits")
                  : "Документ";

  const isLoading = isDocumentsLoading || isEntrepreneurLoading;

  const totalCount = documents.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDocuments = documents.slice(startIndex, endIndex);

  return (
    <>
      <PageBreadcrumb
        pageTitle={
          <>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/registeredentrepreneurs/ENTREPRENEUR"
            >
              {t("subject.enter.table.title")}
              <ChevronRight size={18} />
            </Link>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to={`/registeredentrepreneurs/ENTREPRENEUR/view/${entrepreneur?.id}?tabs=documents`}
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("subject.enter.view.title")}:{" "}
                <span className="text-gray-800 dark:text-white/90">
                  {entrepreneur?.name || "Неизвестно"}
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
          <Table className="w-full">
            <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
              <TableRow className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
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
                <TableCell
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  isHeader
                >
                  {t("subject.individual.document_form.file")}
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableLoadingAnimation />
              ) : paginatedDocuments.length > 0 ? (
                paginatedDocuments.map((document: any, index: number) => (
                  <TableRow
                    className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
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
                        {document.documentDate}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {document.documentDateEnd}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {document.type.name}
                      </span>
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
                            className="flex items-center space-x-2 text-green-600 hover:text-green-800 transition"
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
                          <button className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition">
                            <FileX size={20} />
                          </button>
                        </Tippy>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <p className="block p-5 font-medium text-gray-500 text-theme-sm dark:text-white/90">
                  {t("subject.individual.document_form.nodata")}
                </p>
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
    </>
  );
};

export default DocumentTableViewEntrepreneur;
