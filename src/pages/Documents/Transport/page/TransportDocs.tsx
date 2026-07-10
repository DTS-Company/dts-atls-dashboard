import { useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router";
import { TablePagination } from "@mui/material";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import PageMeta from "@components/common/PageMeta";
import ComponentCard from "@components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { useLocalization } from "@hooks/useLocalization";
import { TableLoadingAnimation } from "@components/common/TableLoadingAnimation";
import { useGetTransportDocumentsQuery } from "../api/api";
import { StatusBadge } from "@utils/StatusBadge";

const TransportDocs = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();
  const { t } = useLocalization();

  const { data, isLoading } = useGetTransportDocumentsQuery({
    userType: "TRANSPORT",
    page: 0,
    size: 1000,
  });

  const allItems = data?.content || [];
  const totalCount = data?.meta?.totalCount || allItems.length;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = allItems.slice(startIndex, endIndex);

  const handleViewDocument = async (entityId: string) => {
    try {
      if (entityId) {
        navigate(`/transport/TRANSPORT/edit/${entityId}`);
      } else {
        console.error("Document type not found");
      }
    } catch (error) {
      console.error("Error fetching document type:", error);
    }
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setItemsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <PageBreadcrumb pageTitle={t("doccheck.titletransport")} />
      <PageMeta title={t("doccheck.titletransport")} description="" />
      <ComponentCard title={t("doccheck.titletransport")}>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[600px]">
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
                    {t("doccheck.createdate")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("doccheck.carModel")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("doccheck.licensePlate")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("doccheck.doctype")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("doccheck.status")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-end text-theme-xs dark:text-gray-300"
                  >
                    {t("doccheck.actions")}
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableLoadingAnimation />
                ) : paginatedItems.length > 0 ? (
                  paginatedItems.map((doc, index) => (
                    <TableRow
                      key={`${doc.entityId}-${doc.typeId}-${startIndex + index}`}
                      className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {startIndex + index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {formatDate(doc.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {doc.carModel}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {doc.licensePlate}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {doc.typeName}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-white/90">
                        <StatusBadge status={doc.checkStatus} />
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                        <div className="flex gap-2 justify-end">
                          <Eye
                            onClick={() => handleViewDocument(doc.entityId)}
                            className="w-6 h-6 cursor-pointer hover:text-green-500 transition"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="text-center py-6">
                      <p className="text-gray-500 dark:text-gray-400">
                        {t("doccheck.nodata")}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalCount > 0 && (
            <TablePagination
              className="table-pagination"
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalCount}
              rowsPerPage={itemsPerPage}
              page={currentPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
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

export default TransportDocs;
