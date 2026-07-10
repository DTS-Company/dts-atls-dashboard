import { useNavigate, useParams } from "react-router";
import ComponentCard from "@components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { useGetIndividualsQuery } from "@pages/Company/api/api";
import PageBreadcrumb from "@pages/Individual/components/PageBreadCrumb";
import { useState } from "react";
import { TablePagination } from "@mui/material";
import { useLocalization } from "@hooks/useLocalization";
import { Eye } from "lucide-react";
import { TableLoadingAnimation } from "@components/common/TableLoadingAnimation"; 

const EmployessTableView = () => {
  const params = useParams();
  const navigate = useNavigate();
  const entityId = params.id!;
  const position = params.type!;
  const { t } = useLocalization();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const {
    data: individualCompanies,
    isLoading,
    isFetching,
  } = useGetIndividualsQuery({
    page: currentPage,
    size: itemsPerPage,
    position,
    entityId,
  });

  const totalCount = individualCompanies?.meta.totalCount || 0;
  const individuals = individualCompanies?.content || [];

  const positionTitle =
    position === "DRIVER"
      ? t("subject.company.employees_page.first_role")
      : position === "DOCTOR"
        ? t("subject.company.employees_page.fourth_role")
        : position === "MECHANIC"
          ? t("subject.company.employees_page.third_role")
          : position === "DISPATCHER"
            ? t("subject.company.employees_page.second_role")
            : "Сотрудник";

  const handleView = (individId: string) =>
    navigate(`/registeredIndividuals/INDIVIDUAL/view/${individId}`);

  return (
    <>
      <PageBreadcrumb pageTitle={positionTitle} />
      <ComponentCard title={positionTitle}>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[600px]">
              <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
                <TableRow className="bg-gray-100 dark:bg-gray-800">
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
                    {t("subject.company.employees_table.inn")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("subject.company.employees_table.fullname")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("subject.company.employees_table.phone")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-end text-theme-xs dark:text-gray-300"
                  >
                    Действие
                  </TableCell>
                </TableRow>
              </TableHeader>
              {isLoading || isFetching ? (
                <TableLoadingAnimation />
              ) : individuals.length > 0 ? (
                <TableBody>
                  {individuals.map((individual, index) => (
                    <TableRow
                      key={individual.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700"
                    >
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {index + 1 + (currentPage - 1) * itemsPerPage}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {individual.tin}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {individual.individualName}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {individual.username || (
                            <span className="italic text-gray-500 dark:text-gray-400">
                              {t(
                                "subject.company.employees_table.not_specified",
                              )}
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="flex justify-end px-5 py-4 sm:px-6">
                        <Eye
                          onClick={() => handleView(individual.id)}
                          className="w-6 h-6 text-gray-600 hover:text-green-500 dark:hover:text-green-500 hover:cursor-pointer dark:text-gray-300"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <div>
                  <p className="p-5 text-gray-500">
                    {t("subject.company.employees_table.nodata")}
                  </p>
                </div>
              )}
            </Table>
          </div>
          {individuals.length > 0 && (
            <TablePagination
              className="table-pagination"
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalCount}
              rowsPerPage={itemsPerPage}
              page={currentPage - 1}
              onPageChange={(_event, newPage) => setCurrentPage(newPage + 1)}
              onRowsPerPageChange={(event) => {
                setItemsPerPage(parseInt(event.target.value, 10));
                setCurrentPage(1);
              }}
              labelRowsPerPage={`${t("common.rows_per_page")}:`}
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

export default EmployessTableView;
