import { useEffect, useState } from "react";
import { Car, ChevronRight, ContactRound, Info } from "lucide-react";
import { Link, useParams } from "react-router";
import {
  useGetAttachedIndividualQuery,
  useGetIndividualByIdQuery,
  useGetTransportForIndividualQuery,
} from "../api/api";
import ViewTabsPage from "./TabsPage/VeiwTabsPage";
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import { useGetCompanyUserQuery } from "@pages/Company/api/api";
import { useLocalization } from "@hooks/useLocalization";

// Update the type to include new fields
export type TAttachedIndividual = {
  entity_type: string;
  entity_name: string;
  entity_id: string;
  id: string;
  position: string;
  detachment_date: string | null;
  contract_number: string | null;
};

function ViewIndividual() {
  const { id } = useParams();
  const { data: individualResponse, isLoading } = useGetIndividualByIdQuery(
    String(id),
  );
  const individual = individualResponse?.content;

  const { t } = useLocalization();

  const { data: transportsData } = useGetTransportForIndividualQuery({
    id: String(id),
    page: 1,
    limit: 1,
  });
  const transportTotalCount = transportsData?.meta?.totalCount || 0;
  const { data: attachedIndividuals } = useGetAttachedIndividualQuery(
    String(id),
  );

  const { data: companyUser } = useGetCompanyUserQuery(String(id));

  const [formData, setFormData] = useState({
    tin: "",
    individualName: "",
    city: "",
    district: "",
    status: "",
    office: "",
    address: "",
    country: "",
  });

  useEffect(() => {
    if (individual) {
      setFormData({
        tin: individual.tin || "",
        individualName: individual.individualName || "",
        city: individual.city?.name || "",
        district: individual.district?.name || "",
        status: individual.activityStatus?.name || "",
        office: individual.office || "",
        address: individual.address || "",
        country: individual.country?.name || "",
      });
    }
  }, [individual]);

  const userRole: { [key: string]: string } = {
    DRIVER: "Водитель",
    MECHANIC: "Механик",
    DOCTOR: "Доктор",
    DISPATCHER: "Диспетчер",
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!individual && !isLoading) {
    return <div>Individual not found</div>;
  }

  return (
    <>
      <PageMeta title={t("subject.individual.view.title")} description="" />
      <PageBreadcrumb
        pageTitle={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Link
                to="/registeredIndividuals/INDIVIDUAL"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              >
                <span>{t("subject.individual.table.title")}</span>
                <ChevronRight size={16} />
              </Link>
            </div>
            <span className="text-sm text-gray-800 dark:text-white/90">
              {t("subject.individual.view.title")} :{" "}
              {individual?.individualName || "Неизвестно"}
            </span>
          </div>
        }
      />
      <ComponentCard title={t("subject.individual.view.title")}>
        {attachedIndividuals && attachedIndividuals.length > 0 ? (
          attachedIndividuals.map((attachment) => (
            <div key={attachment.id} className="rounded-2xl border border-gray-200 bg-white p-4 flex gap-4 items-center mb-4 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-center bg-gray-100 w-14 h-14 rounded-xl dark:bg-gray-700">
                <Info className="text-gray-800 size-6 dark:text-white/90" />
              </div>
              <div className="flex-1 text-start">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white/90">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("subject.individual.view.attached_to")}{" "}
                      </span>
                      {attachment.entity_name}
                    </h4>
                    <p className="text-sm font-bold text-gray-900 dark:text-white/90">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("subject.individual.view.role")}:
                      </span>{" "}
                      {userRole[attachment.position] || attachment.position}
                    </p>
                    <div>
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                        Номер контракта:
                      </span>{" "}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {attachment.contract_number || "не указано"}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                        Срок действие контракта до:
                      </span>{" "}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {attachment.detachment_date ? new Date(attachment.detachment_date).toLocaleDateString() : "без срока"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex gap-4 items-center mb-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-center bg-gray-100 w-14 h-14 rounded-xl dark:bg-gray-700">
              <Info className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="text-start">
              <h4 className="text-lg font-bold text-gray-800 dark:text-white/90">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t("subject.individual.view.attached_to")}{" "}
                </span>
                <span className="italic text-gray-500 dark:text-gray-400">
                  {t("subject.individual.view.not_attached")}
                </span>
              </h4>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex gap-4 items-center dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-center bg-gray-100 w-14 h-14 rounded-xl dark:bg-gray-700">
              <Car className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="text-start">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("subject.individual.view.transport_total_count")}
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
                {t("subject.individual.view.contact")}
              </span>
              <div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white/90">
                  {companyUser?.name || "-"} ({companyUser?.userName || "-"})
                </h4>
              </div>
            </div>
          </div>
        </div>

        <form className="max-h-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[1%]">
            <div>
              <Label>{t("subject.individual.common.inn")}</Label>
              <Input
                value={formData.tin}
                disabled
                type="text"
                placeholder="-"
              />
            </div>
            <div>
              <Label>{t("subject.individual.common.data_from_inn")}</Label>
              <Input
                value={formData.individualName}
                disabled
                type="text"
                placeholder="-"
              />
            </div>
            <div>
              <Label>{t("subject.individual.view.city")}</Label>
              <Input
                value={formData.city}
                disabled
                type="text"
                placeholder="-"
              />
            </div>
            <div>
              <Label>{t("subject.individual.view.country")}</Label>
              <Input
                value={formData.country}
                disabled
                type="text"
                placeholder="-"
              />
            </div>
            <div>
              <Label>{t("subject.individual.common.home_office")}</Label>
              <Input
                value={formData.office}
                disabled
                type="text"
                placeholder="-"
              />
            </div>
            <div>
              <Label>{t("subject.individual.common.street")}</Label>
              <Input
                value={formData.address}
                disabled
                type="text"
                placeholder="-"
              />
            </div>
            <div>
              <Label>{t("subject.individual.view.district")}</Label>
              <Input
                value={formData.district}
                disabled
                type="text"
                placeholder="-"
              />
            </div>
            <div>
              <Label>{t("subject.individual.view.status")}</Label>
              <Input
                value={formData.status}
                disabled
                type="text"
                placeholder="-"
              />
            </div>
          </div>
        </form>
      </ComponentCard>
      <ViewTabsPage />
    </>
  );
}

export default ViewIndividual;