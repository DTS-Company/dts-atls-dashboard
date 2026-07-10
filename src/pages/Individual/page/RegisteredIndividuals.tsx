import { useState } from "react";
import { Eye, UsersRound } from "lucide-react";
import { TablePagination } from "@mui/material";
import { useGetIndividualsQuery } from "../api/api";
// import Button from "@components/ui/button/Button";
import { useNavigate } from "react-router";
import SearchButton from "../components/SearchButton";
// import { usePermissions } from "@permissions/usePermissions";
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

const RegisteredIndividuals = () => {
  const navigate = useNavigate();
  // const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const { t } = useLocalization();

  const { data, isLoading, isFetching } = useGetIndividualsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: search,
  });

  const individualsList = data?.content || [];
  const totalCount = data?.meta.totalCount || 0;

  // const { hasPermission } = usePermissions();
  // const canAddIndividual = hasPermission({
  //   name: "individual",
  //   path: "/api/v1/individual/",
  //   method: "POST",
  // });

  // const canEditIndividual = hasPermission({
  //   name: "individual",
  //   path: "/api/v1/individual/{id}",
  //   method: "PUT",
  // });

  // const canDeleteIndividual = hasPermission({
  //   name: "individual",
  //   path: "/api/v1/individual/{id}",
  //   method: "DELETE",
  // });

  // const [deleteIndividual] = useDeleteIndividualMutation();

  // const handleEdit = (id: string) => {
  //   navigate(`/registeredIndividuals/INDIVIDUAL/edit/${id}`);
  // };

  const handleView = (id: string) => {
    navigate(`/registeredIndividuals/INDIVIDUAL/view/${id}`);
  };

  return (
    <>
      <PageBreadcrumb pageTitle={t("subject.individual.table.title")} />
      <PageMeta title={t("subject.individual.table.title")} description="" />
      <ComponentCard title={t("subject.individual.table.title")}>
        <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex gap-4 items-center dark:border-white/[0.03] dark:bg-white/[0.03]">
            <div className="flex items-center justify-center bg-gray-100 w-14 h-14 rounded-xl dark:bg-gray-700">
              <UsersRound className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="text-start">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("subject.individual.table.all_users")}
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
            {/* {canAddIndividual && (
              <Button
                onClick={() => navigate(`/registeredIndividuals/${id}/add-new`)}
              >
                {t("subject.individual.table.add_new")}
              </Button>
            )} */}
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full min-w-[600px]">
              <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
                <TableRow className="bg-gray-100 rounded-lg shadow-md dark:bg-gray-800">
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    №
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    {t("subject.individual.common.inn")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    {t("subject.company.common.name")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    {t("subject.individual.common.street")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    {t("subject.individual.table.status")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-end dark:text-gray-300"
                  >
                    {t("subject.individual.table.actions")}
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading || isFetching ? (
                  <TableLoadingAnimation />
                ) : individualsList.length > 0 ? (
                  individualsList.map((individual, index) => (
                    <TableRow
                      key={individual.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700"
                    >
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {index + 1 + (currentPage - 1) * itemsPerPage}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {individual.tin}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {individual.individualName}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {individual.address || (
                            <span className="italic text-gray-500 dark:text-gray-400">
                              {t("subject.individual.table.not_specified")}
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="font-medium text-gray-800 dark:text-white/90">
                          {individual.activityStatus ? (
                            <>
                              {individual.activityStatus.name ===
                                "Активный" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-medium text-sm">
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                  {individual.activityStatus.name}
                                </span>
                              )}
                              {individual.activityStatus.name ===
                                "Неактивный" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 font-medium text-sm">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  {individual.activityStatus.name}
                                </span>
                              )}
                              {individual.activityStatus.name ===
                                "Временно приостановлен" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 font-medium text-sm">
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                  {individual.activityStatus.name}
                                </span>
                              )}
                              {individual.activityStatus.name ===
                                "Заблокирован" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 font-medium text-sm">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  {individual.activityStatus.name}
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
                      <TableCell className="flex justify-end gap-2 px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                        <Eye
                          size={24}
                          onClick={() => handleView(individual.id)}
                          className="transition cursor-pointer hover:text-green-500"
                        />
                        {/* {canEditIndividual && (
                          <Pencil
                            size={23}
                            onClick={() => handleEdit(individual.id)}
                            className="transition cursor-pointer hover:text-blue-500"
                          />
                        )}
                        {canDeleteIndividual && (
                          <Trash2
                            size={24}
                            onClick={() => deleteIndividual(individual.id)}
                            className="transition cursor-pointer hover:text-red-500"
                          />
                        )} */}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <div>
                    <p className="p-5 text-center text-gray-500 sm:px-6">
                      {t("subject.individual.table.nodata")}
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
              const newSize = parseInt(event.target.value, 10);
              setItemsPerPage(newSize);
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

export default RegisteredIndividuals;
