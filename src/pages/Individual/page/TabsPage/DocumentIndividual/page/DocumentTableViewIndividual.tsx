import { Link, useParams } from "react-router";
import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import Tippy from "@tippyjs/react";
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
import { useGetIndividualsQuery } from "@pages/Individual/api/api";
import { TableLoadingAnimation } from "@components/common/TableLoadingAnimation";

const DocumentTableViewIndividual = () => {
  const params = useParams();
  const entityId = params.entityId!;
  const type = params.docType!;
  const { t } = useLocalization();

  const { data: documents = [], isLoading: isDocumentsLoading } =
    useGetDocumentByTypeQuery(
      entityId && type ? { entityId, docType: type } : skipToken,
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
              to={`/registeredIndividuals/INDIVIDUAL/view/${individual?.id}?tabs=documents`}
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("subject.individual.view.title")}:{" "}
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
          <Table className="w-full">
            <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
              <TableRow className="bg-gray-100 rounded-lg shadow-md dark:bg-gray-800">
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
                    className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700"
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

export default DocumentTableViewIndividual;
