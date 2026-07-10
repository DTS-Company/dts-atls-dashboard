import { useNavigate } from "react-router";
import { useState } from "react";
import { TablePagination } from "@mui/material";
import { Eye, UsersRound } from "lucide-react";
import { useGetAllCompaniesQuery } from "../api/api";
// import { usePermissions } from "@permissions/usePermissions";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import PageMeta from "@components/common/PageMeta";
import ComponentCard from "@components/common/ComponentCard";
import SearchButton from "@pages/Individual/components/SearchButton";
// import Button from "@components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { useLocalization } from "@hooks/useLocalization";
import { TableLoadingAnimation } from "@components/common/TableLoadingAnimation";

const RegisteredComapanies = () => {
  const navigate = useNavigate();
  // const { id } = useParams();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data, isLoading, isFetching } = useGetAllCompaniesQuery({
    page: currentPage,
    size: itemsPerPage,
    search,
  });
  const { t } = useLocalization();

  const companiesList = data?.content || [];
  const totalCount = data?.meta.totalCount || 0;
  // const [deleteCompany] = useDeleteCompanyMutation();

  // const { hasPermission } = usePermissions();
  // const canAddEntrepreneur = hasPermission({
  //   name: "company",
  //   path: "/api/v1/company/",
  //   method: "POST",
  // });

  // const canEditEntrepreneur = hasPermission({
  //   name: "company",
  //   path: "/api/v1/company/{id}",
  //   method: "PUT",
  // });

  // const canDeleteEntrepreneur = hasPermission({
  //   name: "company",
  //   path: "/api/v1/company/{id}",
  //   method: "DELETE",
  // });

  // const handleEdit = (companyId: string) =>
  //   navigate(`/registeredCompanies/COMPANY/edit/${companyId}`);
  const handleView = (companyId: string) =>
    navigate(`/registeredCompanies/COMPANY/view/${companyId}`);

  return (
    <>
      <PageBreadcrumb pageTitle={t("subject.company.table.title")} />
      <PageMeta title={t("subject.company.table.title")} description="" />
      <ComponentCard title={t("subject.company.table.title")}>
        <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex gap-4 items-center dark:border-white/[0.03] dark:bg-white/[0.03]">
            <div className="flex items-center justify-center bg-gray-100 w-14 h-14 rounded-xl dark:bg-gray-700">
              <UsersRound className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="text-start">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("subject.company.table.all_users")}
              </span>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {isLoading || isFetching ? (
                  <span className="inline-block w-5 h-5 border-2 border-gray-300 rounded-full animate-spin border-t-gray-800" />
                ) : (
                  totalCount
                )}
              </h4>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
          <div className="grid justify-end grid-cols-1 gap-4 p-4 sm:flex sm:grid-cols-2">
            <SearchButton setSearch={setSearch} />
            {/* {canAddEntrepreneur && (
              <Button
                onClick={() => navigate(`/registeredCompanies/${id}/add-new`)}
              >
                {t("subject.company.table.add_new")}
              </Button>
            )} */}
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full min-w-[600px]">
              <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
                <TableRow className="bg-gray-100 rounded-lg shadow-md dark:bg-gray-800">
                  {[
                    "№",
                    t("subject.company.common.inn"),
                    t("subject.company.common.name"),
                    t("subject.company.common.street"),
                    t("subject.company.common.subdivision"),
                    t("subject.company.table.status"),
                    t("subject.company.table.actions"),
                  ].map((title, idx) => (
                    <TableCell
                      key={idx}
                      isHeader
                      className={`px-5 py-3 sm:px-6 font-medium text-gray-600 dark:text-gray-300 ${
                        idx == 6 ? "text-end" : "text-start"
                      }`}
                    >
                      {title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading || isFetching ? (
                  <TableLoadingAnimation />
                ) : companiesList.length > 0 ? (
                  companiesList.map((company, index) => (
                    <TableRow
                      key={company.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700"
                    >
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {index + 1 + (currentPage - 1) * itemsPerPage}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {company.tin}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {company.shortName}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {company.address || (
                            <span className="italic text-gray-500 dark:text-gray-400">
                              {t("subject.individual.table.not_specified")}
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {company.subdivision || (
                            <span className="italic text-gray-500 dark:text-gray-400">
                              {t("subject.individual.table.not_specified")}
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="font-medium text-gray-800 dark:text-white/90">
                          {company.activityStatus ? (
                            <>
                              {company.activityStatus.name === "Активный" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-medium text-sm">
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                  {company.activityStatus.name}
                                </span>
                              )}
                              {company.activityStatus.name === "Неактивный" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 font-medium text-sm">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  {company.activityStatus.name}
                                </span>
                              )}
                              {company.activityStatus.name ===
                                "Временно приостановлен" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 font-medium text-sm">
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                  {company.activityStatus.name}
                                </span>
                              )}
                              {company.activityStatus.name ===
                                "Заблокирован" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 font-medium text-sm">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  {company.activityStatus.name}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 font-medium text-sm">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              Неактивный
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="flex justify-end px-4 py-4 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                        <div className="flex justify-end gap-2">
                          <Eye
                            size={24}
                            onClick={() => handleView(company.id)}
                            className="transition cursor-pointer hover:text-green-500"
                          />
                          {/* {canEditEntrepreneur && (
                            <Pencil
                              size={23}
                              onClick={() => handleEdit(company.id)}
                              className="transition cursor-pointer hover:text-blue-500"
                            />
                          )}
                          {canDeleteEntrepreneur && (
                            <Trash2
                              size={24}
                              onClick={() => deleteCompany(company.id)}
                              className="transition cursor-pointer hover:text-red-500"
                            />
                          )} */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <div>
                    <p className="p-5 text-gray-500 sm:px-6">
                      {t("subject.company.table.nodata")}
                    </p>
                  </div>
                )}
              </TableBody>
            </Table>
          </div>
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
            labelRowsPerPage={`${t("common.rows_per_page")}`}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} ${t("common.from_to")} ${count}`
            }
          />
        </div>
      </ComponentCard>
    </>
  );
};

export default RegisteredComapanies;
