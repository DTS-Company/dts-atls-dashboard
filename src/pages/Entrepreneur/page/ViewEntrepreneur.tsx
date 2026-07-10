import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Car, ChevronRight, ContactRound, UsersRound } from "lucide-react";
import ViewTabsPage from "./TabsPage/VeiwTabsPage";
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import {
  useGetEntrepreneurByIdQuery, 
  useGetEntrepreneurIndividualsQuery,
  useGetEntrepreneurTransportsQuery,
} from "../api/api";
import { useGetCompanyUserQuery } from "@pages/Company/api/api";
import { useLocalization } from "@hooks/useLocalization";

const ViewEntrepreneur = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLocalization();

  const { data: entrepreneurResponse, isLoading, isError } = useGetEntrepreneurByIdQuery(String(id));
  const entrepreneur = entrepreneurResponse?.content;

  const { data: transportCompany } = useGetEntrepreneurTransportsQuery({
    id: String(id),
    page: 1,
    limit: 1,
  });
  const transportTotalCount = transportCompany?.meta?.totalCount || 0;

  const { data: driverCount } = useGetEntrepreneurIndividualsQuery({
    entityId: String(id),
    position: "DRIVER",
  });
  const { data: dispatcherCount } = useGetEntrepreneurIndividualsQuery({
    entityId: String(id),
    position: "DISPATCHER",
  });
  const { data: doctorCount } = useGetEntrepreneurIndividualsQuery({
    entityId: String(id),
    position: "DOCTOR",
  });
  const { data: mechanicCount } = useGetEntrepreneurIndividualsQuery({
    entityId: String(id),
    position: "MECHANIC",
  });
  const employeeTotalCount =
    (driverCount?.meta.totalCount || 0) +
    (dispatcherCount?.meta.totalCount || 0) +
    (doctorCount?.meta.totalCount || 0) +
    (mechanicCount?.meta.totalCount || 0);

  const { data: companyUser } = useGetCompanyUserQuery(String(id));

  const [entrepreneurView, setEntrepreneurView] = useState({
    name: "",
    tin: "",
    ein: "",
    country: "",
    city: "",
    district: "",
    office: "",
    address: "",
    status: "",
  });

  useEffect(() => {
    if (entrepreneur) {
      setEntrepreneurView({
        name: entrepreneur.name || "",
        tin: entrepreneur.tin || "",
        ein: entrepreneur.ein || "",
        country: entrepreneur.country?.name || "",
        city: entrepreneur.city?.name || "",
        district: entrepreneur.district?.name || "",
        office: entrepreneur.office || "",
        address: entrepreneur.address || "",
        status: entrepreneur.activityStatus?.name || "",
      });
    }
  }, [entrepreneur]);

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !entrepreneur) {
    navigate("/entrepreneur/3");
    return null;
  }

  return (
    <>
      <PageMeta title={t("subject.enter.view.title")} description="" />
      <PageBreadcrumb
        pageTitle={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Link
                to="/registeredentrepreneurs/ENTREPRENEUR"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              >
                <span>{t("subject.enter.table.title")}</span> 
                <ChevronRight size={16} />
              </Link>
            </div>
            <span className="text-sm text-gray-800 dark:text-white/90">
              {t("subject.enter.view.title")}:{" "}
              {entrepreneur?.name || "Неизвестно"}
            </span>
          </div>
        }
      />
      <ComponentCard title={t("subject.enter.view.title")}>
        <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex gap-4 items-center dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-center bg-gray-100 w-14 h-14 rounded-xl dark:bg-gray-700">
              <UsersRound className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="text-start">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("subject.enter.view.employee_total_count")}
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
                {t("subject.enter.view.transport_total_count")}
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
                {t("subject.enter.view.contact")}
              </span>
              <h4 className="text-lg font-bold text-gray-800 dark:text-white/90">
                {companyUser?.name} ({companyUser?.userName})
              </h4>
            </div>
          </div>
        </div>
        <form>
          <div className="grid grid-cols-1 gap-4 mt-[1%] md:grid-cols-2">
            <div>
              <Label>{t("subject.enter.common.inn")}</Label>
              <Input
                value={entrepreneurView.tin}
                disabled
                type="text"
                placeholder={`${t("subject.enter.common.inn")}`}
              />
            </div>
            <div>
              <Label>{t("subject.enter.common.name")}</Label>
              <Input
                value={entrepreneurView.name}
                disabled
                type="text"
                placeholder={`${t("subject.enter.common.name")}`}
              />
            </div>
            <div>
              <Label>{t("subject.enter.common.ein")}</Label>
              <Input
                value={entrepreneurView.ein}
                disabled
                type="text"
                placeholder={`${t("subject.enter.common.ein")}`}
              />
            </div>
            <div>
              <Label>{t("subject.enter.view.country")}</Label>
              <Input
                value={entrepreneurView.country}
                disabled
                type="text"
                placeholder={`${t("subject.enter.view.country")}`}
              />
            </div>
            <div>
              <Label>{t("subject.enter.view.city")}</Label>
              <Input
                value={entrepreneurView.district}
                disabled
                type="text"
                placeholder={`${t("subject.enter.view.city")}`}
              />
            </div>
            <div>
              <Label>{t("subject.enter.view.district")}</Label>
              <Input
                value={entrepreneurView.city}
                disabled
                type="text"
                placeholder={`${t("subject.enter.view.district")}`}
              />
            </div>
            <div>
              <Label>{t("subject.enter.common.street")}</Label>
              <Input
                value={entrepreneurView.address}
                disabled
                type="text"
                placeholder={`${t("subject.enter.common.street")}`}
              />
            </div>
            <div>
              <Label>{t("subject.enter.common.home_office")}</Label>
              <Input
                value={entrepreneurView.office}
                disabled
                type="text"
                placeholder={`${t("subject.enter.common.home_office")}`}
              />
            </div>
            <div>
              <Label>{t("subject.enter.common.status")}</Label>
              <Input
                value={entrepreneurView.status}
                disabled
                type="text"
                placeholder={`${t("subject.enter.common.status")}`}
              />
            </div>
          </div>
        </form>
      </ComponentCard>
      <ViewTabsPage />
    </>
  );
};

export default ViewEntrepreneur;