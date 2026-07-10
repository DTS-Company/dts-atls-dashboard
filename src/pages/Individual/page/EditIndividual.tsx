import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router";
import { ChevronRight } from "lucide-react";
import TabsPage from "./TabsPage/TabsPage";
import { useGetCityQuery } from "@pages/Reference/City/api/api";
import { useGetCountryQuery } from "@pages/Reference/Country/api/api";
import { useGetStatusQuery } from "@pages/Reference/Status/api/api";
import { useGetDistrictQuery } from "@pages/Reference/District/api/api";
import {
  useEditIndividualMutation,
  useGetIndividualByIdQuery,
} from "../api/api"; // Changed import
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import Select from "@components/form/Select";
import Button from "@components/ui/button/Button";
import { useLocalization } from "@hooks/useLocalization";

function EditIndividual() {
  const { id } = useParams();
  const userTypeId = String(id);

  const { data: listCity = [] } = useGetCityQuery();
  const { data: listCountry = [] } = useGetCountryQuery();
  const { data: listStatus = [] } = useGetStatusQuery();
  const { data: listDistrict = [] } = useGetDistrictQuery();
  const [editIndividual] = useEditIndividualMutation();
  const { t } = useLocalization();

  const { data: individualResponse, isLoading } =
    useGetIndividualByIdQuery(userTypeId);
  const individual = individualResponse?.content;

  const [formData, setFormData] = useState({
    tin: "",
    individualName: "",
    cityID: "",
    districtID: "",
    statusID: "",
    office: "",
    address: "",
    userName: "",
    countryID: "",
  });

  useEffect(() => {
    if (individual) {
      setFormData({
        tin: individual.tin || "",
        individualName: individual.individualName || "",
        cityID: individual.city?.id || "",
        districtID: individual.district?.id || "",
        statusID: individual.activityStatus?.id || "",
        office: individual.office || "",
        address: individual.address || "",
        userName: individual.username || "",
        countryID: individual.country?.id || "",
      });
    }
  }, [individual]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange =
    (name: keyof typeof formData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editIndividual({
        id: userTypeId,
        tin: formData.tin,
        individualName: formData.individualName,
        individualType: "INDIVIDUAL",
        countryID: formData.countryID,
        country: individual?.country || { id: "", name: "", code: "" },
        cityID: formData.cityID,
        city: individual?.city || { id: "", name: "" },
        office: formData.office,
        districtID: formData.districtID,
        district: individual?.district || { id: "", name: "" },
        address: formData.address,
        activityStatusID: formData.statusID,
        username: formData.userName,
        activityStatus: {
          id: "",
          name: "",
        },
      }).unwrap();
      toast.success("Физическое лицо успешно обновлено!");
    } catch (err: any) {
      if (err.error?.status === 409) {
        toast.error("Этот физическое лицо уже существует!");
      } else {
        toast.error("Ошибка при обновлении физического лица.");
      }
    }
  };

  // Add loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Add not found state
  if (!individual && !isLoading) {
    return <div>Individual not found</div>;
  }

  return (
    <>
      <PageMeta title={t("subject.individual.edit.title")} description="" />
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
              {t("subject.individual.edit.title")}:{" "}
              {individual?.individualName || "Неизвестно"}
            </span>
          </div>
        }
      />
      <ComponentCard title={t("subject.individual.edit.title")}>
        <form onSubmit={handleSubmit} className="max-h-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[1%]">
            <div>
              <Label>{t("subject.individual.common.inn")}</Label>
              <Input
                value={formData.tin}
                disabled
                type="text"
                placeholder={`${t("subject.individual.common.inn")}`}
              />
            </div>

            <div>
              <Label>{t("subject.individual.common.data_from_inn")}</Label>
              <Input
                type="text"
                value={formData.individualName}
                disabled
                placeholder={`${t("subject.individual.common.data_from_inn")}`}
              />
            </div>

            <div>
              <Label>{t("subject.individual.common.choose_country")}</Label>
              <Select
                options={[
                  {
                    value: "",
                    label: t("subject.individual.common.choose_country"),
                  },
                  ...listCountry.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  })),
                ]}
                value={formData.countryID}
                onChange={handleSelectChange("countryID")}
              />
            </div>

            <div>
              <Label>{t("subject.individual.common.choose_city")}</Label>{" "}
              {/* Fixed label */}
              <Select
                options={[
                  {
                    value: "",
                    label: t("subject.individual.common.choose_city"), // Fixed label
                  },
                  ...listCity.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  })),
                ]}
                value={formData.cityID}
                onChange={handleSelectChange("cityID")}
              />
            </div>

            <div>
              <Label>{t("subject.individual.common.home_office")}</Label>
              <Input
                name="office"
                value={formData.office}
                onChange={handleInputChange}
                type="text"
                placeholder={`${t("subject.individual.common.home_office")}`}
              />
            </div>

            <div>
              <Label>{t("subject.individual.common.street")}</Label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                type="text"
                placeholder={`${t("subject.individual.common.street")}`}
              />
            </div>

            <div>
              <Label>{t("subject.individual.common.choose_district")}</Label>
              <Select
                options={[
                  {
                    value: "",
                    label: t("subject.individual.common.choose_district"),
                  },
                  ...listDistrict.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  })),
                ]}
                value={formData.districtID}
                onChange={handleSelectChange("districtID")}
              />
            </div>

            <div>
              <Label>{t("subject.individual.common.choose_status")}</Label>
              <Select
                options={[
                  {
                    value: "",
                    label: t("subject.individual.common.choose_status"),
                  },
                  ...listStatus.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  })),
                ]}
                value={formData.statusID}
                onChange={handleSelectChange("statusID")}
              />
            </div>
          </div>

          <Button className="w-full mt-4 sm:w-auto">
            {t("subject.individual.common.save")}
          </Button>
        </form>
      </ComponentCard>
      <TabsPage />
    </>
  );
}

export default EditIndividual;
