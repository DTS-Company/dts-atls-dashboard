import { Link, useParams } from "react-router";
import { ChevronRight } from "lucide-react";
import { useGetAppViewMinistryQuery } from "../api/api";
import PageBreadcrumb from "@components/common/PageBreadCrumb";

const DozvolViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetAppViewMinistryQuery(
    { idApp: Number(id) },
    { skip: !id }
  );

  const application = data?.content?.[0];

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;
  if (!application) return <div>Заявка не найдена</div>;

  return (
    <>
      <PageBreadcrumb
        pageTitle={
          <>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/permits"
            >
              Разрешения (дозволов)
              <ChevronRight size={18} />
            </Link>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/permits/dozvolTable"
            >
              Заявки на разрешения (Юридические лица)
              <ChevronRight size={18} />
            </Link>
            Просмотр заявки {application.app_number}
          </>
        }
      />
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Просмотр заявки №{application.app_number}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Номер заявки
            </label>
            <div className="w-full mt-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white">
              {application.app_number}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              ИНН перевозчика
            </label>
            <div className="w-full mt-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white">
              {application.carrier_inn}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Наименование перевозчика
            </label>
            <div className="w-full mt-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white">
              {application.carrier_FullName}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Статус
            </label>
            <div className="w-full mt-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white">
              {application.status_FullName}
            </div>
          </div>

          {application.review_date && (
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300">
                Дата рассмотрения
              </label>
              <div className="w-full mt-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white">
                {new Date(application.review_date).toLocaleDateString()}
              </div>
            </div>
          )}

          {application.blanks?.length > 0 && (
            <div className="sm:col-span-2">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Бланки разрешений
              </h2>
              <div className="space-y-2">
                {application.blanks.map((blank: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Страна:
                        </span>
                        <div className="dark:text-gray-200">
                          {blank.country_code}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Тип:
                        </span>
                        <div className="dark:text-gray-200">
                          {blank.permit_type}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Количество:
                        </span>
                        <div className="dark:text-gray-200">
                          {blank.quantity} (одобрено: {blank.quantity_approved})
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DozvolViewPage;
