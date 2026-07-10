import { useState } from "react";
import { useParams } from "react-router";
import { skipToken } from "@reduxjs/toolkit/query";
import { TablePagination } from "@mui/material";

import { useGetAllContactsQuery } from "../api/api";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";

import { useLocalization } from "@hooks/useLocalization";

const ViewContactTable = () => {
  const { id } = useParams();
  const entityId = String(id);
  const { t } = useLocalization();

  const { data: contacts = [] } = useGetAllContactsQuery(
    entityId ? { entityId } : skipToken
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  const totalCount = contacts.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContacts = contacts.slice(startIndex, endIndex);

  const getGlobalIndex = (localIndex: number) => {
    return startIndex + localIndex + 1;
  };

  const contactTypeLabels: Record<string, string> = {
    PHONE_NUMBER: t("subject.individual.contacts_page.type_phone_number"),
    E_MAIL: t("subject.individual.contacts_page.type_e_mail"),
    WEB_SITE: t("subject.individual.contacts_page.type_web_site"),
    POSTCODE: t("subject.individual.contacts_page.type_postcode"),
    FAX: t("subject.individual.contacts_page.type_fax"),
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
      <Table className="w-full">
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
              {t("subject.individual.contacts_page.table_type")}
            </TableCell>
            <TableCell 
              isHeader
              className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
            >
              {t("subject.individual.contacts_page.table_contact")}
            </TableCell>
          </TableRow>
        </TableHeader>
        {paginatedContacts.length > 0 ? (
          <TableBody>
            {paginatedContacts.map((contact, index) => (
              <TableRow
                key={contact.id}
                className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {getGlobalIndex(index)}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {contactTypeLabels[contact.type] || contact.type}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {contact.contact}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <p className="p-5 text-gray-500 dark:text-gray-400 py-4">
            {t("subject.individual.contacts_page.nodata")} 
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
          labelRowsPerPage={t("common.rows_per_page")}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} ${t("common.from_to")} ${count}`
          } 
        />
      )}
    </div>
  );
};

export default ViewContactTable;
