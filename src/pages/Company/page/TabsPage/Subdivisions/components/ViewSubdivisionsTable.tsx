import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { skipToken } from "@reduxjs/toolkit/query";
import { TablePagination } from "@mui/material";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { useGetCompanySubdivisionsQuery } from "../api/api";
import { useLocalization } from "@hooks/useLocalization";
import { Eye } from "lucide-react";

const ViewSubdivisionsTable = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLocalization();

  const { data } = useGetCompanySubdivisionsQuery(
    id ? { id, page: 1, size: 100 } : skipToken
  );

  const subdivisions = data?.content ?? [];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalCount = subdivisions.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubdivisions = subdivisions.slice(startIndex, endIndex);

  const getGlobalIndex = (localIndex: number) => startIndex + localIndex + 1;

  const handleView = (companyId: string) =>
    navigate(`/registeredCompanies/COMPANY/view/${companyId}?tabs=employees`);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
      <Table className="w-full">
        <TableHeader>
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
              {t("subject.company.subdivisions_table.name")}
            </TableCell>

            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
            >
              {t("subject.company.subdivisions_table.sub")}
            </TableCell>

            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
            >
              {t("subject.company.subdivisions_table.inn")}
            </TableCell>

            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
            >
              {t("subject.company.subdivisions_table.ein")}
            </TableCell>

            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
            >
              {t("subject.company.subdivisions_table.country")}
            </TableCell>

            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
            >
              {t("subject.company.subdivisions_table.city")}
            </TableCell>

            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
            >
              {t("subject.company.subdivisions_table.district")}
            </TableCell>

            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
            >
              {t("subject.company.subdivisions_table.office")}
            </TableCell>

            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
            >
              {t("subject.company.subdivisions_table.address")}
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
            >
              Действие
            </TableCell>
          </TableRow>
        </TableHeader>

        {paginatedSubdivisions.length > 0 ? (
          <TableBody>
            {paginatedSubdivisions.map((item, index) => (
              <TableRow
                key={item.id}
                className="bg-white dark:bg-gray-900 rounded-lg"
              >
                <TableCell className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300">
                  {getGlobalIndex(index)}
                </TableCell>

                <TableCell className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300">
                  {item.name}
                </TableCell>

                <TableCell className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300">
                  {item.subdivision}
                </TableCell>

                <TableCell className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300">
                  {item.tin}
                </TableCell>

                <TableCell className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300">
                  {item.ein || (
                    <span className="text-gray-500 italic dark:text-gray-400">
                      {t("subject.company.subdivisions_table.no_specified")}
                    </span>
                  )}
                </TableCell>

                <TableCell className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300">
                  {item.country?.name}
                </TableCell>

                <TableCell className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300">
                  {item.city?.name}
                </TableCell>

                <TableCell className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300">
                  {item.district?.name}
                </TableCell>

                <TableCell className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300">
                  {item.office}
                </TableCell>

                <TableCell className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300">
                  {item.address}
                </TableCell>
                <TableCell className="px-4 py-4 text-gray-500 flex justify-end text-end text-theme-sm dark:text-gray-400">
                  <div className="flex gap-2 justify-end">
                    <Eye
                      size={24}
                      onClick={() => handleView(item.id)}
                      className="cursor-pointer hover:text-green-500 transition"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <p className="p-5 text-gray-500">
            {t("subject.company.subdivisions_table.nodata")}
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
          onPageChange={(_, newPage) => setCurrentPage(newPage + 1)}
          onRowsPerPageChange={(e) => {
            setItemsPerPage(parseInt(e.target.value, 10));
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

export default ViewSubdivisionsTable;
