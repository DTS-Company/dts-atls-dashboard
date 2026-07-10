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
import { useGetCompanyByIdQuery } from "@pages/Company/api/api";
import { TableLoadingAnimation } from "@components/common/TableLoadingAnimation"; 

const DocumentTableViewCompany = () => {
  const { entityId, docType } = useParams();
  const { t } = useLocalization();

  const { data: companyData, isLoading: isCompanyLoading } =
    useGetCompanyByIdQuery(entityId!);
  const company = companyData?.content;

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

  const isLoading = isDocumentsLoading || isCompanyLoading;

  return (
    <>
      <PageBreadcrumb
        pageTitle={
          <>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/registeredCompanies/COMPANY"
            >
              {t("subject.company.table.title")}
              <ChevronRight size={18} />
            </Link>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to={`/registeredCompanies/COMPANY/view/${company?.id}?tabs=documents`}
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("subject.company.view.title")}:{" "}
                <span className="text-gray-800 dark:text-white/90">
                  {company?.name || "Неизвестно"}
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
              ) : documents.length > 0 ? (
                documents.map((document: any) => (
                  <TableRow
                    className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
                    key={document.id}
                  >
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
        </div>
      </ComponentCard>
    </>
  );
};

export default DocumentTableViewCompany;
