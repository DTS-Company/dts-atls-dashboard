import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import {
  CircleCheck,
  CircleX,
  FileCheck,
  FileX,
  ShieldQuestion,
} from "lucide-react";
import { TablePagination } from "@mui/material";

import ComponentCard from "@components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { useGetDocumentByTypeQuery } from "@pages/Individual/page/TabsPage/DocumentIndividual/api/api";
import { useReadFileQuery } from "@pages/Reference/Storage/reducers/files";
import { TableLoadingAnimation } from "@components/common/TableLoadingAnimation";
import { useLocalization } from "@hooks/useLocalization";

const DocumentView = () => {
  const { id } = useParams();
  const entityId = id!;
  const { t } = useLocalization();

  const [fileName, setFileName] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const docType = "DOC_USER";

  const { data: documents = [], isLoading } = useGetDocumentByTypeQuery(
    entityId ? { entityId, docType } : skipToken,
  );

  const { data: fileData } = useReadFileQuery(
    entityId && fileName ? { entityId, filename: fileName } : skipToken,
  );

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
    if (extractedFileName) {
      setFileName(extractedFileName);
    }
  };

  const getStatusBadge = (checkStatus: string | null | undefined) => {
    if (checkStatus === "ACCEPTED") {
      return (
        <div className="flex items-center gap-1">
          <CircleCheck className="w-5 h-5 text-green-500" />
          <span className="text-sm text-green-600">Принят</span>
        </div>
      );
    } else if (checkStatus === "REJECTED") {
      return (
        <div className="flex items-center gap-1">
          <CircleX className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-600">Отклонен </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          <ShieldQuestion className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">На одобрение</span>
        </div>
      );
    }
  };

  const paginatedDocs = documents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <ComponentCard title="Документы транспортного средства">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
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
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                isHeader
              >
                Номер документа
              </TableCell>
              <TableCell
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                isHeader
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
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                isHeader
              >
                Дата окончания
              </TableCell>
              <TableCell
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                isHeader
              >
                Статус
              </TableCell>
              <TableCell
                className="px-5 py-3 font-medium text-gray-600 text-end text-theme-xs dark:text-gray-300"
                isHeader
              >
                Скачать
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoadingAnimation />
            ) : documents.length > 0 ? (
              paginatedDocs.map((doc: any, index) => (
                <TableRow
                  className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700"
                  key={doc.id}
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
                      {doc.documentDate || "не указано"}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {doc.documentDateEnd || "не указано"}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {getStatusBadge(doc.checkStatus)}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-end">
                    {doc.documentLink ? (
                      <Tippy content="Скачать документ">
                        <button
                          onClick={() => handleDownload(doc.documentLink)}
                          className="inline-flex items-center text-green-600 transition hover:text-green-800"
                        >
                          <FileCheck size={20} />
                        </button>
                      </Tippy>
                    ) : (
                      <Tippy content="Документ не доступен">
                        <button className="inline-flex items-center text-red-600 transition hover:text-red-800">
                          <FileX size={20} />
                        </button>
                      </Tippy>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <div>
                <p className="p-5 text-gray-500 sm:px-6">
                  Нет доступных документов для отображения!
                </p>
              </div>
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
  );
};

export default DocumentView;
