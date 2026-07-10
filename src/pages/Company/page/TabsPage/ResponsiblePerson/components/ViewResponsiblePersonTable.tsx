import { useState } from "react";
import { useParams } from "react-router";
import { skipToken } from "@reduxjs/toolkit/query";
import { TablePagination } from "@mui/material";

import { useGetAllResponsiblePersonQuery } from "../api/api";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { useLocalization } from "@hooks/useLocalization";

const ViewResponsiblePersonTable = () => {
  const { id: entityId } = useParams();
  const { data: responsiblePerson = [] } = useGetAllResponsiblePersonQuery(
    entityId ? { entityId } : skipToken
  );
  const { t } = useLocalization()

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalCount = responsiblePerson.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPersons = responsiblePerson.slice(startIndex, endIndex);

  const getGlobalIndex = (localIndex: number) => {
    return startIndex + localIndex + 1;
  };

  return (
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
              {t("subject.company.responsible_person_table.type")}
            </TableCell>
            <TableCell
              className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
              isHeader
            >
              {t(
                "subject.company.responsible_person_table.responsible_person"
              )}
            </TableCell>
          </TableRow>
        </TableHeader>

        {paginatedPersons.length > 0 ? (
          <TableBody>
            {paginatedPersons.map((person, index) => (
              <TableRow
                key={person.id}
                className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {getGlobalIndex(index)}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {person.type}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {person.fullName}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <p className="p-5 sm:px-6 text-gray-500">
            {t("subject.company.responsible_person_table.nodata")}
          </p>
        )}
      </Table>

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
  );
};

export default ViewResponsiblePersonTable;
