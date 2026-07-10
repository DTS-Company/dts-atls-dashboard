import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import TabsPage from "./TabsPage/TabsPage";
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import Select from "@components/form/Select";
import { useGetCityQuery } from "@pages/Reference/City/api/api";
import { useGetCountryQuery } from "@pages/Reference/Country/api/api";
import { useGetStatusQuery } from "@pages/Reference/Status/api/api";
import { useGetDistrictQuery } from "@pages/Reference/District/api/api";
import {
  useGetEntrepreneurByIdQuery, // Changed import
  useUpdateEntrepreneurMutation,
} from "../api/api";
import { useLocalization } from "@hooks/useLocalization";

interface FormData {
  name: string;
  tin: string;
  ein: string;
  countryID: string;
  cityID: string;
  districtID: string;
  office: string;
  address: string;
  statusID: string;
}

const EditEntrepreneur = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userTypeId = String(id);

  const {
    data: entrepreneurResponse,
    isLoading,
    isError,
  } = useGetEntrepreneurByIdQuery(userTypeId);
  const entrepreneur = entrepreneurResponse?.content;

  const { data: listCity = [] } = useGetCityQuery();
  const { data: listCountry = [] } = useGetCountryQuery();
  const { data: listStatus = [] } = useGetStatusQuery();
  const { data: listDistrict = [] } = useGetDistrictQuery();
  const { t } = useLocalization();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    tin: "",
    ein: "",
    countryID: "",
    cityID: "",
    districtID: "",
    office: "",
    address: "",
    statusID: "",
  });

  const [editEntrepreneur] = useUpdateEntrepreneurMutation();

  useEffect(() => {
    if (entrepreneur) {
      setFormData({
        name: entrepreneur.name || "",
        tin: entrepreneur.tin || "",
        ein: entrepreneur.ein || "",
        countryID: entrepreneur.country?.id || "",
        cityID: entrepreneur.city?.id || "",
        districtID: entrepreneur.district?.id || "",
        office: entrepreneur.office || "",
        address: entrepreneur.address || "",
        statusID: entrepreneur.activityStatus?.id || "",
      });
    }
  }, [entrepreneur]);

  // Handle error and loading states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !entrepreneur) {
    navigate("/entrepreneur/3");
    return null;
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editEntrepreneur({
        id: userTypeId,
        userType: userTypeId,
        tin: formData.tin,
        ein: formData.ein,
        name: formData.name,
        office: formData.office,
        districtID: formData.districtID,
        district: { id: "", name: "" },
        address: formData.address,
        actualAddress: "",
        activityStatusID: formData.statusID,
        activityStatus: { id: "", name: "" },
        countryID: formData.countryID,
        country: { id: "", name: "", code: "" },
        cityID: formData.cityID,
        city: { id: "", name: "" },
        content: undefined,
      }).unwrap();

      toast.success("Индивидуальный предприниматель успешно обновлён!");
    } catch (err: any) {
      if (err.error?.status === 409) {
        toast.error("Такой индивидуальный предприниматель уже существует!");
      } else {
        toast.error(" Ошибка при обновлении индивидуального предпринимателя.");
      }
    }
  };

  return (
    <>
      <PageMeta title={t("subject.enter.edit.title")} description="" />
      <PageBreadcrumb
        pageTitle={
          <div className="flex items-center gap-2">
            <Link
              to="/registeredentrepreneurs/ENTREPRENEUR"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
            >
              <span>{t("subject.enter.table.title")}</span>
              <ChevronRight size={16} />
            </Link>
            <span className="text-sm text-gray-800 dark:text-white/90">
              {t("subject.enter.edit.title")} {formData.name || "Неизвестно"}
            </span>
          </div>
        }
      />
      <ComponentCard title={t("subject.enter.edit.title")}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mt-[1%] md:grid-cols-2">
            <div>
              <Label>{t("subject.enter.common.inn")}</Label>
              <Input
                value={formData.tin}
                disabled
                type="text"
                placeholder={`${t("subject.enter.common.inn")}`}
              />
            </div>
            <div>
              <Label>{t("subject.enter.common.name")}</Label>
              <Input
                value={formData.name}
                disabled
                type="text"
                placeholder={`${t("subject.enter.common.name")}`}
              />
            </div>
            <div>
              <Label>{t("subject.enter.common.ein")}</Label>
              <Input
                value={formData.ein}
                disabled
                type="text"
                placeholder={`${t("subject.enter.common.ein")}`}
              />
            </div>
            <div>
              <Label>{`${t("subject.enter.view.country")}`}</Label>
              <Select
                options={[
                  {
                    value: "",
                    label: t("subject.enter.common.choose_country"),
                  },
                  ...listCountry.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  })),
                ]}
                value={formData.countryID}
                onChange={(value) => handleChange("countryID", value)}
              />
            </div>
            <div>
              <Label>{t("subject.enter.view.city")}</Label>
              <Select
                options={[
                  { value: "", label: t("subject.enter.common.choose_city") },
                  ...listDistrict.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  })),
                ]}
                value={formData.districtID}
                onChange={(value) => handleChange("districtID", value)}
              />
            </div>
            <div>
              <Label>{t("subject.enter.view.district")}</Label>
              <Select
                options={[
                  {
                    value: "",
                    label: t("subject.enter.common.choose_district"),
                  },
                  ...listCity.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  })),
                ]}
                value={formData.cityID}
                onChange={(value) => handleChange("cityID", value)}
              />
            </div>
            <div>
              <Label>{t("subject.enter.common.street")}</Label>
              <Input
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                type="text"
                placeholder={`${t("subject.enter.common.street")}`}
              />
            </div>
            <div>
              <Label>{t("subject.enter.common.home_office")}</Label>
              <Input
                value={formData.office}
                onChange={(e) => handleChange("office", e.target.value)}
                type="text"
                placeholder={`${t("subject.enter.common.home_office")}`}
              />
            </div>
            <div>
              <Label>{t("subject.enter.common.status")}</Label>
              <Select
                options={[
                  { value: "", label: t("subject.enter.common.choose_status") },
                  ...listStatus.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  })),
                ]}
                value={formData.statusID}
                onChange={(value) => handleChange("statusID", value)}
              />
            </div>
          </div>
          <Button className="w-full mt-4 sm:w-auto">
            {t("subject.enter.common.save")}
          </Button>
        </form>
      </ComponentCard>
      <TabsPage />
    </>
  );
};

export default EditEntrepreneur;
