import { useState } from "react";
import { TablePagination, MenuItem, Select } from "@mui/material";
import { Eye, Search } from "lucide-react";
import { Link } from "react-router";
import { useGetCompanyReportsQuery } from "../api/api";
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
import { useGetCityQuery } from "@pages/Reference/City/api/api";
import { useGetDistrictQuery } from "@pages/Reference/District/api/api";
import Button from "@components/ui/button/Button";
import { useLocalization } from "@hooks/useLocalization";
import { TableLoadingAnimation } from "@components/common/TableLoadingAnimation";

const CompanyReports = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [selectedDistrict, setSelectedDistrict] = useState<
    string | undefined
  >();
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useState<{
    city?: string;
    district?: string;
  }>({});

  const { t } = useLocalization();

  const { data: cities } = useGetCityQuery();
  const { data: districts } = useGetDistrictQuery();
  const { data, isLoading, isError, isFetching } = useGetCompanyReportsQuery(
    hasSearched
      ? {
          city: searchParams.city,
          district: searchParams.district,
          page: currentPage + 1,
          size: itemsPerPage,
        }
      : {
          page: 1,
          size: itemsPerPage,
        },
    {
      skip: !hasSearched,
      refetchOnMountOrArgChange: true,
    },
  );

  const totalCount = data?.meta?.totalCount || 0;
  const totalEmployees = data?.total?.individual || 0;
  const totalTransport = data?.total?.transport || 0;

  const handleSearch = () => {
    if (!selectedCity && !selectedDistrict) {
      alert("Пожалуйста, выберите город или район для поиска");
      return;
    }

    setCurrentPage(0);
    setSearchParams({
      city: selectedCity,
      district: selectedDistrict,
    });
    setHasSearched(true);
  };

  const handleResetFilters = () => {
    setSelectedCity(undefined);
    setSelectedDistrict(undefined);
    setHasSearched(false);
    setSearchParams({});
    setCurrentPage(0);
  };

  const handlePageChange = (_event: any, newPage: number) => {
    if (!isFetching) {
      setCurrentPage(newPage);
    }
  };

  if (isError) {
    return <div className="p-6 text-red-500">Ошибка при загрузке</div>;
  }

  return (
    <>
      <PageBreadcrumb pageTitle={t("reports.company.title")} />
      <PageMeta title={t("reports.company.title")} description="" />
      <ComponentCard title={t("reports.company.title")}>
        <div className="flex flex-col items-start justify-between gap-4 mb-4 sm:flex-row sm:items-center">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:w-auto">
            <Select
              value={selectedCity || ""}
              onChange={(e) => setSelectedCity(e.target.value || undefined)}
              displayEmpty
              className="w-full min-w-[200px] max-h-[45px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              MenuProps={{
                PaperProps: {
                  className:
                    "bg-white dark:bg-gray-600 text-gray-800 dark:text-white",
                },
              }}
            >
              <MenuItem value="">{t("reports.company.all_cities")}</MenuItem>
              {cities?.map((c) => (
                <MenuItem
                  key={c.id}
                  value={c.id}
                  className="text-gray-800 bg-white dark:bg-gray-600 dark:text-white"
                >
                  {c.name}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={selectedDistrict || ""}
              onChange={(e) => setSelectedDistrict(e.target.value || undefined)}
              displayEmpty
              className="w-full min-w-[200px] max-h-[45px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              MenuProps={{
                PaperProps: {
                  className:
                    "bg-white dark:bg-gray-600 text-gray-800 dark:text-white",
                },
              }}
            >
              <MenuItem value="">{t("reports.company.all_districts")}</MenuItem>
              {districts?.map((d) => (
                <MenuItem
                  key={d.id}
                  value={d.id}
                  className="text-gray-800 bg-white dark:bg-gray-600 dark:text-white"
                >
                  {d.name}
                </MenuItem>
              ))}
            </Select>

            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                className="flex-1 sm:w-auto"
                disabled={!selectedCity && !selectedDistrict}
              >
                <Search className="w-4 h-4 mr-2" />
                {t("reports.company.search")}
              </Button>
              {hasSearched && (
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="flex-1 sm:w-auto"
                >
                  Сбросить 
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start w-full gap-4 sm:flex-row sm:items-center sm:w-auto">
            <div className="flex items-center justify-between w-full gap-2 px-4 py-2 bg-gray-100 rounded-lg shadow-sm dark:bg-gray-800 sm:w-auto">
              <div className="text-sm text-gray-500">
                {t("reports.company.company_total_count")}
              </div>
              <div className="text-lg font-semibold dark:text-white">
                {isLoading && hasSearched ? (
                  <span className="inline-block w-5 h-5 border-2 border-gray-300 rounded-full animate-spin border-t-gray-800" />
                ) : (
                  totalCount
                )}
              </div>
            </div>

            <div className="flex items-center justify-between w-full gap-2 px-4 py-2 bg-gray-100 rounded-lg shadow-sm dark:bg-gray-800 sm:w-auto">
              <div className="text-sm text-gray-500">
                {t("reports.company.employee_total_count")}
              </div>
              <div className="text-lg font-semibold dark:text-white">
                {isLoading && hasSearched ? (
                  <span className="inline-block w-5 h-5 border-2 border-gray-300 rounded-full animate-spin border-t-gray-800" />
                ) : (
                  totalEmployees
                )}
              </div>
            </div>

            <div className="flex items-center justify-between w-full gap-2 px-4 py-2 bg-gray-100 rounded-lg shadow-sm dark:bg-gray-800 sm:w-auto">
              <div className="text-sm text-gray-500">
                {t("reports.company.transport_total_count")}
              </div>
              <div className="text-lg font-semibold dark:text-white">
                {isLoading && hasSearched ? (
                  <span className="inline-block w-5 h-5 border-2 border-gray-300 rounded-full animate-spin border-t-gray-800" />
                ) : (
                  totalTransport
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[600px]">
              <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
                <TableRow className="bg-gray-100 rounded-lg shadow-md dark:bg-gray-800">
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    №
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("reports.company.created")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("reports.company.edited")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("reports.company.created_by")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("reports.company.edited_by")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("reports.company.name")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("reports.company.address")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("reports.company.city")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("reports.company.district")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("reports.company.employee_count")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("reports.company.transport_count")}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                  >
                    {t("reports.company.actions")}
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {!hasSearched ? (
                   <div>
                    <p className="p-6 text-gray-500 dark:text-gray-400">
                                          <p className="text-base text-gray-600 dark:text-gray-400">
                      Выберите фильтры для отображения данных
                    </p>  
                    </p> 
                  </div>
                ) : isFetching ? (
                  <TableLoadingAnimation />
                ) : data?.content?.length ? (
                  data.content.map((company, index) => (
                    <TableRow
                      key={company.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700"
                    >
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {index + 1 + currentPage * itemsPerPage}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {new Date(company.created_at).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {new Date(company.updated_at).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {company.created_by_name || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {company.updated_by_name || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {company.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {company.address ? (
                            company.address
                          ) : (
                            <span className="italic text-gray-500 dark:text-gray-400">
                              {t("reports.company.nodetails")}
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {company.city_name ? (
                            company.city_name
                          ) : (
                            <span className="italic text-gray-500 dark:text-gray-400">
                              {t("reports.company.nodetails")}
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {company.district_name ? (
                            company.district_name
                          ) : (
                            <span className="italic text-gray-500 dark:text-gray-400">
                              {t("reports.company.nodetails")}
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {company.individual_count}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {company.transport_count}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          <Link
                            to={`/registeredCompanies/COMPANY/view/${company.id}`}
                          >
                            <Eye
                              size={24}
                              className="hover:text-green-400 hover:cursor-pointer"
                            />
                          </Link>
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <div>
                    <p className="p-6 text-gray-500 dark:text-gray-400">
                      {t("reports.company.nodata")}
                    </p>
                  </div>
                )}
              </TableBody>
            </Table>
          </div>

          {hasSearched && totalCount > 0 && (
            <TablePagination
              className="table-pagination"
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalCount}
              rowsPerPage={itemsPerPage}
              page={currentPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={(event) => {
                const newSize = parseInt(event.target.value, 10);
                setItemsPerPage(newSize);
                setCurrentPage(0);
              }}
              labelRowsPerPage={`${t("common.rows_per_page")}`}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} ${t("common.from_to")} ${count}`
              }
              backIconButtonProps={{
                disabled: isFetching || currentPage === 0,
              }}
              nextIconButtonProps={{
                disabled:
                  isFetching ||
                  currentPage >= Math.ceil(totalCount / itemsPerPage) - 1,
              }}
              SelectProps={{
                disabled: isFetching,
              }}
            />
          )}
        </div>
      </ComponentCard>
    </>
  );
};

export default CompanyReports;
