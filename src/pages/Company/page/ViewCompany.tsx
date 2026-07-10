import { Car, ChevronRight, ContactRound, UsersRound } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import {
  useGetCompanyByIdQuery,
  useGetCompanyTransportsQuery,
  useGetCompanyUserQuery,
  useGetIndividualsQuery,
} from "../api/api";
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import TabsPageView from "./TabsPage/TabsPageView";
import { useLocalization } from "@hooks/useLocalization";

const ViewCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLocalization();

  const { data: companyData, isError, isLoading } = useGetCompanyByIdQuery(id!);
  const company = companyData?.content;
  console.log("commpany data", company)

  const { data: transportCompany } = useGetCompanyTransportsQuery({
    id: String(id),
    page: 1,
    limit: 1,
  });
  const transportTotalCount = transportCompany?.meta?.totalCount || 0;

  const { data: driverCount } = useGetIndividualsQuery({
    entityId: String(id),
    position: "DRIVER",
    page: 1,
    size: 30,
  });
  const { data: dispatcherCount } = useGetIndividualsQuery({
    entityId: String(id),
    position: "DISPATCHER",
    page: 1,
    size: 30,
  });
  const { data: doctorCount } = useGetIndividualsQuery({
    entityId: String(id),
    position: "DOCTOR",
    page: 1,
    size: 30,
  });
  const { data: mechanicCount } = useGetIndividualsQuery({
    entityId: String(id),
    position: "MECHANIC",
    page: 1,
    size: 30,
  });

  const employeeTotalCount =
    (driverCount?.meta.totalCount || 0) +
    (dispatcherCount?.meta.totalCount || 0) +
    (doctorCount?.meta.totalCount || 0) +
    (mechanicCount?.meta.totalCount || 0);

  const { data: companyUser } = useGetCompanyUserQuery(String(id));

  const companyView = {
    name: company?.name || "",
    shortName: company?.shortName || "",
    tin: company?.tin || "",
    ein: company?.ein || "",
    country: company?.country?.name || "",
    city: company?.city?.name || "", 
    district: company?.district?.name || "", 
    office: company?.office || "", 
    address: company?.address || "",
    status: company?.activityStatus?.name || "",
    kpp: company?.kpp || "",
  };

  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 text-5xl text-red-500">!</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            Компания не найдена
          </h3>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Не удалось загрузить данные компании
          </p>
          <button
            onClick={() => navigate("/registeredCompanies/COMPANY")}
            className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={t("subject.company.view.title")} description="" />
      <PageBreadcrumb
        pageTitle={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Link
                to="/registeredCompanies/COMPANY"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              >
                <span>{t("subject.company.table.title")}</span>
                <ChevronRight size={16} />
              </Link>
            </div>
            <span className="text-sm text-gray-800 dark:text-white/90">
              {t("subject.company.view.title")}: {company.name}
            </span>
          </div>
        }
      />
      <ComponentCard title={t("subject.company.view.title")}>
        <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex gap-4 items-center dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-center bg-gray-100 w-14 h-14 rounded-xl dark:bg-gray-700">
              <UsersRound className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="text-start">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("subject.company.view.employee_total_count")}
              </span>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {employeeTotalCount}
              </h4>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex gap-4 items-center dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-center bg-gray-100 w-14 h-14 rounded-xl dark:bg-gray-700">
              <Car className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="text-start">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("subject.company.view.transport_total_count")}
              </span>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {transportTotalCount}
              </h4>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex gap-4 items-center dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-center bg-gray-100 w-14 h-14 rounded-xl dark:bg-gray-700">
              <ContactRound className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="text-start">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("subject.company.view.contacts")}
              </span>
              <h4 className="text-sm font-bold text-gray-800 sm:text-lg dark:text-white/90">
                {companyUser?.name} ({companyUser?.userName})
              </h4>
            </div>
          </div>
        </div>
        <form>
          <div className="grid grid-cols-1 gap-4 mt-[1%] md:grid-cols-2">
            <div>
              <Label>{t("subject.company.common.name")}</Label>
              <Input
                type="text"
                value={companyView.name}
                disabled
                placeholder={`${t("subject.company.common.name")}`}
              />
            </div>
            <div>
              <Label>{t("subject.company.common.short_name")}</Label>
              <Input
                type="text"
                value={companyView.shortName}
                disabled
                placeholder={`${t("subject.company.common.short_name")}`}
              />
            </div>
            <div>
              <Label>{t("subject.company.common.inn")}</Label>
              <Input
                type="text"
                value={companyView.tin}
                disabled
                placeholder={`${t("subject.company.common.inn")}`}
              />
            </div>
            <div>
              <Label>{t("subject.company.common.ein")}</Label>
              <Input
                type="text"
                value={companyView.ein}
                disabled
                placeholder={`${t("subject.company.common.ein")}`}
              />
            </div>
            <div>
              <Label>{t("subject.company.view.country")}</Label>
              <Input
                type="text"
                value={companyView.country}
                disabled
                placeholder={`${t("subject.company.view.country")}`}
              />
            </div>
            <div>
              <Label>{t("subject.company.view.district")}</Label>
              <Input
                type="text"
                value={companyView.district}
                disabled
                placeholder={`${t("subject.company.view.district")}`}
              />
            </div>
            <div>
              <Label>{t("subject.company.view.city")}</Label>
              <Input
                type="text"
                value={companyView.city}
                disabled
                placeholder={`${t("subject.company.view.city")}`}
              />
            </div>
            <div>
              <Label>{t("subject.company.view.address")}</Label>
              <Input
                type="text"
                value={companyView.address}
                disabled
                placeholder={`${t("subject.company.view.address")}`}
              />
            </div>
            <div>
              <Label>{t("subject.company.view.office")}</Label>
              <Input
                type="text"
                value={companyView.office}
                disabled
                placeholder={`${t("subject.company.view.office")}`}
              />
            </div>
            <div>
              <Label>{t("subject.company.view.status")}</Label>
              <Input
                type="text"
                value={companyView.status}
                disabled
                placeholder={`${t("subject.company.view.status")}`}
              />
            </div>
            <div>
              <Label>Kpp</Label>
              <Input
                type="text"
                value={companyView.kpp} 
                disabled
                placeholder="-" 
              /> 
            </div>
          </div>
        </form>
      </ComponentCard>
      <TabsPageView />
    </>
  );
};

export default ViewCompany;
