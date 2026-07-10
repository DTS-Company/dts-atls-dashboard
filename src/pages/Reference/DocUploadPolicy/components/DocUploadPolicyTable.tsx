import { useState } from "react";
import { ToastContainer } from "react-toastify";
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
import { useLocalization } from "@hooks/useLocalization";
import { useGetAllDocUploadPolicyQuery } from "../api/api";
import DocUploadPolicyEditModal from "./DocUploadPolicyEditModal";
import type { DocUploadPolicy } from "../types/docUploadPolicyConstants";

const DocUploadPolicyTable = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField] = useState("id");
  const [editingPolicy, setEditingPolicy] = useState<DocUploadPolicy | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { t } = useLocalization();

  const { data, isLoading, isError, refetch } = useGetAllDocUploadPolicyQuery({
    page: currentPage,
    size: itemsPerPage,
    sort: sortField,
  });

  const handleEdit = (policy: DocUploadPolicy) => {
    setEditingPolicy(policy);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingPolicy(null);
    setIsEditModalOpen(false);
  };

  const handleSuccess = () => {
    refetch();
  };

  if (isLoading) return <div className="p-4">Загрузка...</div>;
  if (isError || !data)
    return <div className="p-4 text-red-500">Ошибка загрузки данных.</div>;

  const { content = [], meta } = data;
  const totalCount = meta?.totalCount || 0;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <DocUploadPolicyEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        editingPolicy={editingPolicy}
        onSuccess={handleSuccess}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-[2%]">
        <Table className="overflow-x-auto w-full">
          <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
            <TableRow className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
              >
                {t("references.doc_upload_policy.userType")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
              >
                {t("references.doc_upload_policy.docType")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
              >
                {t("references.doc_upload_policy.docView")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
              >
                {t("references.doc_upload_policy.externalApi")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
              >
                {t("references.doc_upload_policy.requirement")}
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
            {content.map((doc) => (
              <TableRow
                key={doc.id}
                className="bg-white dark:bg-gray-900 border-b dark:border-gray-700"
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {doc.userType || "—"}
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
                    {doc.externalApi || "—"}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {doc.requirement || "—"}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                  <div className="flex gap-2 justify-end">
                    <Pencil
                      className="w-5 h-5 cursor-pointer hover:text-blue-500 transition"
                      onClick={() => handleEdit(doc as DocUploadPolicy)}
                    />
                    <Trash2 className="w-6 h-6 cursor-pointer hover:text-red-500 transition" />
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
      </div>
    </>
  );
};

export default DocUploadPolicyTable;
