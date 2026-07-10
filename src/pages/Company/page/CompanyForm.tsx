import { useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { ChevronRight } from "lucide-react";
import { useGetCityQuery } from "@pages/Reference/City/api/api";
import { useGetCountryQuery } from "@pages/Reference/Country/api/api";
import { useGetStatusQuery } from "@pages/Reference/Status/api/api";
import { useGetDistrictQuery } from "@pages/Reference/District/api/api";
import { useAddCompanyMutation, useLazyGetCompanyByTinQuery } from "../api/api";
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import Select from "@components/form/Select";
import { useLocalization } from "@hooks/useLocalization";

const initialFormData = {
  name: "",
  shortName: "",
  subdivision: "",
  tin: "",
  ein: "",
  kpp: "",
  countryID: "59ea4b0f-549f-4070-8fd3-6c7d899ea709",
  cityID: "",
  districtID: "",
  office: "",
  address: "",
  statusID: "92b7c468-658e-45fe-ae87-0bc6d17ac8b2",
  username: "",
};

interface ValidationErrors {
  tin?: string;
  name?: string;
  shortName?: string;
  ein?: string;
  countryID?: string;
  cityID?: string;
  districtID?: string;
  office?: string;
  address?: string;
  statusID?: string;
  username?: string;
  subdivision?: string;
  kpp?: string;
}

const CompanyForm = () => {
  const { data: listCity = [] } = useGetCityQuery();
  const { data: listCountry = [] } = useGetCountryQuery();
  const { data: listStatus = [] } = useGetStatusQuery();
  const { data: listDistrict = [] } = useGetDistrictQuery();
  const { t } = useLocalization();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isTinVerified, setIsTinVerified] = useState(false);

  const [fetchCompanyByTin] = useLazyGetCompanyByTinQuery();
  const [addCompany] = useAddCompanyMutation();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.tin.trim()) {
      newErrors.tin = "ИНН не может быть пустым";
    } else if (!isTinVerified) {
      newErrors.tin = "Пожалуйста, проверьте ИНН";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Полное название не может быть пустым";
    }

    if (!formData.shortName.trim()) {
      newErrors.shortName = "Краткое название не может быть пустым";
    }

    if (!formData.ein.trim()) {
      newErrors.ein = "ЕИН не может быть пустым";
    }

    if (!formData.countryID.trim()) {
      newErrors.countryID = "Выберите страну";
    }

    if (!formData.districtID.trim()) {
      newErrors.districtID = "Выберите район";
    }

    if (!formData.cityID.trim()) {
      newErrors.cityID = "Выберите город";
    }

    if (!formData.office.trim()) {
      newErrors.office = "Домашний офис не может быть пустым";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Юридический адрес не может быть пустым";
    }

    if (!formData.statusID.trim()) {
      newErrors.statusID = "Выберите статус";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Телефон не может быть пустым";
    } else if (!/^\d{9}$/.test(formData.username)) {
      newErrors.username = "Телефон должен содержать 9 цифр";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    if (field === "tin" && isTinVerified) {
      setIsTinVerified(false);
      setFormData((prev) => ({
        ...prev,
        name: "",
        shortName: "",
        ein: "",
      }));
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, "");
    const limited = cleaned.slice(0, 9);

    setFormData((prev) => ({ ...prev, username: limited }));
    if (errors.username) {
      setErrors({ ...errors, username: undefined });
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleFetchByTin = async () => {
    if (!formData.tin.trim()) {
      setErrors({ ...errors, tin: "ИНН не может быть пустым!" });
      return;
    }

    setErrors({ ...errors, tin: undefined });

    try {
      const response: any = await fetchCompanyByTin(formData.tin).unwrap();
      setFormData((prev) => ({
        ...prev,
        name: response.fullName || "",
        shortName: response.shortName || "",
        ein: response.ein || "",
        address: response.adr || "",
      }));
      setIsTinVerified(true);

      if (errors.name) setErrors({ ...errors, name: undefined });
      if (errors.shortName) setErrors({ ...errors, shortName: undefined });
      if (errors.ein) setErrors({ ...errors, ein: undefined });

      toast.success("Данные успешно загружены по ИНН!");
    } catch (err: any) {
      setErrors({ ...errors, tin: "Юридическое лицо с таким ИНН не найдено" });
      setIsTinVerified(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setIsTinVerified(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Пожалуйста, исправьте ошибки в форме");
      return;
    }

    try {
      await addCompany({
        userType: "COMPANY",
        ...formData,
        username: formData.username,
        actualAddress: "string",
        latitude: "string",
        longitude: "string",
        propertyID: "95b3ba12-1b48-49cc-ba97-bc1c8bf7cc9c",
      }).unwrap();

      toast.success("Юридическое лицо успешно добавлено!");
      handleReset();
    } catch (err: any) {
      if (err.error?.status === 409) {
        toast.error("Это юридическое лицо уже существует!");
      } else {
        toast.error("Ошибка при добавлении юридического лица.");
      }
    }
  };

  return (
    <>
      <PageMeta title={t("subject.company.add.title")} description="" />
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
              {t("subject.company.add.title")}
            </span>
          </div>
        }
      />
      <ComponentCard title={t("subject.company.add.title")}>
        <div>
          <Label>{t("subject.company.common.inn")}</Label>
          <div className="sm:flex mb-2 sm:flex-row grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <Input
                value={formData.tin}
                onChange={(e) => handleChange("tin", e.target.value)}
                type="text"
                placeholder={`${t("subject.company.common.inn")}`}
                className={errors.tin ? "border-red-500" : ""}
                disabled={isTinVerified}
              />
              {errors.tin && (
                <p className="mt-1 text-sm text-red-500">{errors.tin}</p>
              )}
            </div>
            <Button onClick={handleFetchByTin} disabled={isTinVerified}>
              {t("subject.company.common.data_from_inn")}
            </Button>
            {isTinVerified && (
              <Button onClick={handleReset} variant="outline">
                Сбросить
              </Button>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mt-[1%] md:grid-cols-2">
            <div>
              <Label>{t("subject.company.common.name")}</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={`${t("subject.company.common.name")}`}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <Label>{t("subject.company.common.ein")}</Label>
              <Input
                type="text"
                value={formData.ein}
                onChange={(e) => handleChange("ein", e.target.value)}
                placeholder={`${t("subject.company.common.ein")}`}
                className={errors.ein ? "border-red-500" : ""}
              />
              {errors.ein && (
                <p className="mt-1 text-sm text-red-500">{errors.ein}</p>
              )}
            </div>
            <div>
              <Label>{t("subject.company.common.short_name")}</Label>
              <Input
                type="text"
                value={formData.shortName}
                onChange={(e) => handleChange("shortName", e.target.value)}
                placeholder={`${t("subject.company.common.short_name")}`}
                className={errors.shortName ? "border-red-500" : ""}
              />
              {errors.shortName && (
                <p className="mt-1 text-sm text-red-500">{errors.shortName}</p>
              )}
            </div>

            <div>
              <Label>{t("subject.company.common.choose_country")}</Label>
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
                value={formData.countryID}
                onChange={(value) => handleSelectChange("countryID", value)}
                className={errors.countryID ? "border-red-500" : ""}
              />
              {errors.countryID && (
                <p className="mt-1 text-sm text-red-500">{errors.countryID}</p>
              )}
            </div>
            <div>
              <Label>{t("subject.company.common.choose_district")}</Label>
              <Select
                options={[
                  {
                    value: "",
                    label: t("subject.company.common.choose_district"),
                  },
                  ...listDistrict.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  })),
                ]}
                value={formData.districtID}
                onChange={(value) => handleSelectChange("districtID", value)}
                className={errors.districtID ? "border-red-500" : ""}
              />
              {errors.districtID && (
                <p className="mt-1 text-sm text-red-500">{errors.districtID}</p>
              )}
            </div>
            <div>
              <Label>{t("subject.company.common.choose_city")}</Label>
              <Select
                options={[
                  { value: "", label: t("subject.company.common.choose_city") },
                  ...listCity.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  })),
                ]}
                value={formData.cityID}
                onChange={(value) => handleSelectChange("cityID", value)}
                className={errors.cityID ? "border-red-500" : ""}
              />
              {errors.cityID && (
                <p className="mt-1 text-sm text-red-500">{errors.cityID}</p>
              )}
            </div>

            <div>
              <Label>{t("subject.company.common.street")}</Label>
              <Input
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                type="text"
                placeholder={`${t("subject.company.common.street")}`}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>
            <div>
              <Label>{t("subject.company.common.home_office")}</Label>
              <Input
                value={formData.office}
                onChange={(e) => handleChange("office", e.target.value)}
                type="text"
                placeholder={`${t("subject.company.common.home_office")}`}
                className={errors.office ? "border-red-500" : ""}
              />
              {errors.office && (
                <p className="mt-1 text-sm text-red-500">{errors.office}</p>
              )}
            </div>
            <div>
              <Label>{t("subject.company.common.choose_status")}</Label>
              <div className="opacity-50 ">
                <Input
                  value={
                    listStatus.find((s) => s.id === formData.statusID)?.name ||
                    ""
                  }
                  disabled
                />
              </div>
            </div>
            <div>
              <Label>{t("subject.company.add.phone")}</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  +992
                </div>
                <Input
                  value={formData.username}
                  onChange={handlePhoneChange}
                  type="tel"
                  placeholder="XXXXXXXXX"
                  className={`pl-14 ${errors.username ? "border-red-500" : ""}`}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>
          </div>
          <Button className="mt-4 w-full sm:w-auto">
            {t("subject.company.common.save")}
          </Button>
        </form>
      </ComponentCard>
    </>
  );
};
export default CompanyForm;
