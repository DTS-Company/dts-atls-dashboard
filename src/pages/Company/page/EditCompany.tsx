import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ChevronRight } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useGetCityQuery } from "@pages/Reference/City/api/api";
import { useGetCountryQuery } from "@pages/Reference/Country/api/api";
import { useGetStatusQuery } from "@pages/Reference/Status/api/api";
import { useGetDistrictQuery } from "@pages/Reference/District/api/api";
import { useGetCompanyByIdQuery, useUpdateCompanyMutation } from "../api/api";
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import Select from "@components/form/Select";
import Button from "@components/ui/button/Button";
import TabsPage from "./TabsPage/TabsPage";
import { useLocalization } from "@hooks/useLocalization";

const EditCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userTypeId = String(id);
  const { t } = useLocalization();

  const { data: listCity = [] } = useGetCityQuery();
  const { data: listCountry = [] } = useGetCountryQuery();
  const { data: listStatus = [] } = useGetStatusQuery();
  const { data: listDistrict = [] } = useGetDistrictQuery();

  const { data: companyData, isError, isLoading } = useGetCompanyByIdQuery(id!);
  const company = companyData?.content;

  const [formValues, setFormValues] = useState({
    name: "",
    shortName: "",
    tin: "",
    ein: "",
    kpp: "",
    countryID: "",
    cityID: "",
    districtID: "",
    office: "",
    address: "",
    subdivision: "",
    statusID: "",
  });

  const [editCompany] = useUpdateCompanyMutation();

  useEffect(() => {
    if (company) {
      setFormValues({
        name: company.name || "",
        shortName: company.shortName || "",
        tin: company.tin || "",
        ein: company.ein || "",
        kpp: company.kpp || "",
        countryID: company.country?.id || "",
        cityID: company.city?.id || "",
        districtID: company.district?.id || "",
        office: company.office || "",
        address: company.address || "",
        subdivision: company.subdivision || "",
        statusID: company.activityStatus?.id || "",
      });
    }
  }, [company]);

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await editCompany({
        id: userTypeId,
        name: formValues.name,
        shortName: formValues.shortName,
        subdivision: formValues.subdivision,
        tin: formValues.tin,
        ein: formValues.ein,
        kpp: formValues.kpp,
        companyTypeID: formValues.countryID,
        office: formValues.office,
        districtID: formValues.districtID,
        address: formValues.address,
        activityStatusID: formValues.statusID,
        countryID: formValues.countryID,
        cityID: formValues.cityID,
        companyType: { id: "", name: "" },
        district: { id: "", name: "" },
        actualAddress: "",
        activityStatus: { id: "", name: "" },
        country: { id: "", name: "", code: "" },
        latitude: "",
        longitude: "",
        propertyID: "",
        property: { id: "", name: "" },
        city: { id: "", name: "" },
        username: "",
        content: undefined,
      }).unwrap();

      toast.success("Юридическое лицо успешно обновлено!");
    } catch (err: any) {
      if (err.error?.status === 409) {
        toast.error("Такое юридическое лицо уже существует!");
      } else {
        toast.error("Ошибка при обновлении юридического лица.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
            Компания не найдена
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Не удалось загрузить данные компании
          </p>
          <button
            onClick={() => navigate("/registeredCompanies/COMPANY")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={t("subject.company.edit.title")} description="" />
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
              {t("subject.company.edit.title")}: {company.name}
            </span>
          </div>
        }
      />
      <ComponentCard title={t("subject.company.edit.title")}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mt-[1%] md:grid-cols-2">
            <div>
              <Label>{t("subject.company.common.inn")}</Label>
              <Input
                value={formValues.tin}
                disabled
                type="text"
                placeholder={`${t("subject.company.common.inn")}`}
              />
            </div>
            <div>
              <Label>{t("subject.company.common.name")}</Label>
              <Input
                value={formValues.name}
                onChange={(e) => handleChange("name", e.target.value)}
                type="text"
                placeholder={`${t("subject.company.common.name")}`}
              />
            </div>
            <div>
              <Label>{t("subject.company.common.ein")}</Label>
              <Input
                value={formValues.ein}
                disabled
                type="text"
                placeholder={`${t("subject.company.common.ein")}`}
              />
            </div>
            <div>
              <Label>{t("subject.company.common.short_name")}</Label>
              <Input
                value={formValues.shortName}
                onChange={(e) => handleChange("shortName", e.target.value)}
                type="text"
                placeholder={`${t("subject.company.common.short_name")}`}
              />
            </div>
            <div>
              <Label>{t("subject.company.view.city")}</Label>
              <Select
                options={[
                  {
                    value: "",
                    label: t("subject.company.common.choose_country"),
                  },
                  ...listCountry.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  })),
                ]}
                value={formValues.countryID}
                onChange={(value) => handleChange("countryID", value)}
              />
            </div>
            <div>
              <Label>{t("subject.company.view.district")}</Label>
              <Select
                options={[
                  { value: "", label: t("subject.company.common.choose_city") },
                  ...listDistrict.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  })),
                ]}
                value={formValues.districtID}
                onChange={(value) => handleChange("districtID", value)}
              />
            </div>
            <div>
              <Label>{t("subject.company.edit.oblast")}</Label>
              <Select
                options={[
                  {
                    value: "",
                    label: t("subject.company.common.choose_district"),
                  },
                  ...listCity.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  })),
                ]}
                value={formValues.cityID}
                onChange={(value) => handleChange("cityID", value)}
              />
            </div>
            <div>
              <Label>{t("subject.company.view.status")}</Label>
              <Select
                options={[
                  {
                    value: "",
                    label: t("subject.company.common.choose_status"),
                  },
                  ...listStatus.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  })),
                ]}
                value={formValues.statusID}
                onChange={(value) => handleChange("statusID", value)}
              />
            </div>
            <div>
              <Label>{t("subject.company.view.address")}</Label>
              <Input
                value={formValues.address}
                onChange={(e) => handleChange("address", e.target.value)}
                type="text"
                placeholder={`${t("subject.company.view.address")}`}
              />
            </div>
            <div>
              <Label>{t("subject.company.view.office")}</Label>
              <Input
                value={formValues.office}
                onChange={(e) => handleChange("office", e.target.value)}
                type="text"
                placeholder={`${t("subject.company.view.office")}`}
              />
            </div>
          </div>
          
          <Button className="mt-4 w-full sm:w-auto">
            {t("subject.company.common.save")}
          </Button>
        </form>
      </ComponentCard>
      <TabsPage />
    </>
  );
};

export default EditCompany;
