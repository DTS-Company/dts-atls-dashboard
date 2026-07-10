import { useNavigate, useParams } from "react-router";
import { Loader2 } from "lucide-react";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import Button from "@components/ui/button/Button";
import { useGetCompanyPermitApplicationByEntityIdQuery } from "@pages/PermitApplication/api/api";

const CompanyPermitApplicationView = () => {
  const { entityId } = useParams<{ entityId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetCompanyPermitApplicationByEntityIdQuery({
    entityId: entityId || "",
    page: 1,
    size: 30,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (
    !data?.applicationNumber &&
    !data?.companyName &&
    !data?.tin &&
    !data?.email &&
    !data?.phone
  ) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500 text-lg">
        Данные по заявке не найдены
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle={`Заявка #${data.applicationNumber}`} />
      <ComponentCard title={`Детали заявки ${data.companyName}`}>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6 p-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            ← Назад к списку
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Общая информация</h3>
              <div className="space-y-2">
                <p>
                  <strong>Номер заявки:</strong> {data.applicationNumber}
                </p>
                <p>
                  <strong>Статус:</strong> {data.applicationStatus}
                </p>
                <p>
                  <strong>Тип заявки:</strong> {data.applicationType}
                </p>
                <p>
                  <strong>Дата создания:</strong> {data.createdAt}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Данные компании</h3>
              <div className="space-y-2">
                <p>
                  <strong>ИНН:</strong> {data.tin}
                </p>
                <p>
                  <strong>Тип компании:</strong> {data.companyType}
                </p>
                <p>
                  <strong>Название:</strong> {data.companyName}
                </p>
                <p>
                  <strong>Банковский счет:</strong> {data.bankAccount}
                </p>
                <p>
                  <strong>Банк:</strong> {data.bankName}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Адрес</h3>
              <div className="space-y-2">
                <p>
                  <strong>Регион:</strong> {data.regionalManagement}
                </p>
                <p>
                  <strong>Город:</strong> {data.city}
                </p>
                <p>
                  <strong>Дом:</strong> {data.building}
                </p>
                <p>
                  <strong>Помещение:</strong> {data.room}
                </p>
                <p>
                  <strong>Индекс:</strong> {data.postalCode}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Контакты</h3>
              <div className="space-y-2">
                <p>
                  <strong>Телефон:</strong> {data.phone}
                </p>
                <p>
                  <strong>Email:</strong> {data.email}
                </p>
              </div>
            </div>
          </div>

          {data.notes && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
              <h3 className="text-lg font-semibold mb-2">Примечания</h3>
              <p>{data.notes}</p>
            </div>
          )}
        </div>
      </ComponentCard>
    </>
  );
};

export default CompanyPermitApplicationView;
