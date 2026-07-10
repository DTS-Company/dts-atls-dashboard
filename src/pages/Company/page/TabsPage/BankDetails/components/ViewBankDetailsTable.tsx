import { useState } from "react";
import { useParams } from "react-router";
import { skipToken } from "@reduxjs/toolkit/query";
import { TablePagination } from "@mui/material";

import { useGetAllBankDetailsQuery } from "../api/api";

import ComponentCard from "@components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { useLocalization } from "@hooks/useLocalization";

const ViewBankDetailsTable = () => {
  const { id } = useParams();
  const userTypeId = String(id);
  const entityId = userTypeId;
  const { t } = useLocalization();

  const { data: bankdetails = [] } = useGetAllBankDetailsQuery(
    entityId ? { entityId } : skipToken
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalCount = bankdetails.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBankDetails = bankdetails.slice(startIndex, endIndex);

  return (
    <>
      <ComponentCard title={t("subject.company.bank_details_table.title")}> 
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
                    {t("subject.company.bank_details_page.account_name")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("subject.company.bank_details_page.bank_name")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("subject.company.bank_details_page.bik_bank")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("subject.company.bank_details_page.kor_shot")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("subject.company.bank_details_page.rac_shot")}
                  </TableCell>
                </TableRow>
              </TableHeader>
              {paginatedBankDetails.length > 0 ? (
                <TableBody>
                  {paginatedBankDetails.map((bankdetail, index) => (
                    <TableRow
                      className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
                      key={bankdetail.id}
                    >
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {index + 1 + (currentPage - 1) * itemsPerPage} 
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {bankdetail.accountName}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {bankdetail.bankName}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {bankdetail.bikBank}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {bankdetail.korShot}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {bankdetail.racShot}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <p className="p-5 sm:px-6 text-gray-500">
                  {t("subject.company.bank_details_table.nodata")}
                </p>
              )}
            </Table>
          </div>
          {totalCount > 0 && (
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

export default ViewBankDetailsTable;
