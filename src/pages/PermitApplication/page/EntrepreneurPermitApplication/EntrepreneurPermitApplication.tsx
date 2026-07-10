import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronRight, Eye } from "lucide-react";
import { useGetEntrepreneurPermitApplicationsQuery } from "@pages/PermitApplication/api/api";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@components/ui/table";
import Button from "@components/ui/button/Button";

const EntrepreneurPermitApplication = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const { data } = useGetEntrepreneurPermitApplicationsQuery({
    page: currentPage,
    size: itemsPerPage,
  });

  const applications = data?.content || [];
  const totalPages = Math.ceil((data?.meta.totalCount || 0) / itemsPerPage);

  const handleView = (entityId: string) => {
    navigate(`/permit-applications/entrepreneur/${entityId}`);
  };

  return (
    <>
      <PageBreadcrumb
        pageTitle={
          <>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/licensing"
            >
              Лицензии
              <ChevronRight size={18} />
            </Link>
            Заявки на разрешения (ИП)
          </>
        }
      />
      <ComponentCard title="Список заявок ИП">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[600px]">
              <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
                <TableRow className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    № заявки
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    ИНН
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    ФИО
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    Адрес
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-start dark:text-gray-300"
                  >
                    Статус
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-600 text-end dark:text-gray-300"
                  >
                    Действия
                  </TableCell>
                </TableRow>
              </TableHeader>

              {applications.length > 0 ? (
                <TableBody>
                  {applications.map((application) => (
                    <TableRow
                      key={application.entityId}
                      className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {application.applicationNumber}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {application.tin}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {application.lastName} {application.firstName}{" "}
                          {application.surname}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {application.city}, {application.street}{" "}
                          {application.building}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {application.applicationStatus}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                        <div className="flex gap-2 justify-end">
                          <Eye
                            onClick={() => handleView(application.entityId)}
                            className="w-6 h-6 cursor-pointer hover:text-green-500 transition"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <div>
                  <p className="p-5 text-gray-500 dark:text-gray-400">
                    Нет заявок на разрешения (ИП) для отображения.
                  </p>
                </div>
              )}
            </Table>
          </div>
          <div className="flex items-center justify-center gap-2 py-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              ←
            </Button>
            <Button>{currentPage}</Button>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              →
            </Button>
          </div>
        </div>
      </ComponentCard>
    </>
  );
};

export default EntrepreneurPermitApplication;
