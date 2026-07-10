import { useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "react-toastify";
import { ChevronRight } from "lucide-react";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import Select from "@components/form/Select";
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useGetCityQuery } from "@pages/Reference/City/api/api";
import { useGetCountryQuery } from "@pages/Reference/Country/api/api";
import { useGetStatusQuery } from "@pages/Reference/Status/api/api";
import { useGetDistrictQuery } from "@pages/Reference/District/api/api";
import {
  useAddEntrepreneurMutation,
  useLazyGetEntrepreneurByTinQuery,
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
  actualAddress: string;
  statusID: string;
  userName: string;
}

interface ValidationErrors {
  tin?: string;
  name?: string;
  ein?: string;
  countryID?: string;
  cityID?: string;
  districtID?: string;
  office?: string;
  address?: string;
  actualAddress?: string;
  statusID?: string;
  userName?: string;
}

const EntrepreneurForm = () => {
  const { data: listCity = [] } = useGetCityQuery();
  const { data: listCountry = [] } = useGetCountryQuery();
  const { data: listStatus = [] } = useGetStatusQuery();
  const { data: listDistrict = [] } = useGetDistrictQuery();
  const { t } = useLocalization();

  const { id } = useParams();
  const userTypeId = String(id);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    tin: "",
    ein: "",
    countryID: "59ea4b0f-549f-4070-8fd3-6c7d899ea709",
    cityID: "",
    districtID: "",
    office: "",
    address: "",
    actualAddress: "",
    statusID: "92b7c468-658e-45fe-ae87-0bc6d17ac8b2",
    userName: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isTinVerified, setIsTinVerified] = useState(false);

  const [fetchEntrepreneurByTin] = useLazyGetEntrepreneurByTinQuery();
  const [addEntrepreneur] = useAddEntrepreneurMutation();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.tin.trim()) {
      newErrors.tin = "ИНН не может быть пустым";
    } else if (!isTinVerified) {
      newErrors.tin = "Пожалуйста, проверьте ИНН";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Название не может быть пустым";
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

    if (!formData.actualAddress.trim()) {
      newErrors.actualAddress = "Фактический адрес не может быть пустым";
    }

    if (!formData.statusID.trim()) {
      newErrors.statusID = "Выберите статус";
    }

    if (!formData.userName.trim()) {
      newErrors.userName = "Телефон не может быть пустым";
    } else if (!/^\d{9}$/.test(formData.userName)) {
      newErrors.userName = "Телефон должен содержать 9 цифр";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    if (field === "tin" && isTinVerified) {
      setIsTinVerified(false);
      setFormData((prev) => ({
        ...prev,
        name: "",
        ein: "",
      }));
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!formData.tin.trim()) {
      setErrors({ ...errors, tin: "ИНН не может быть пустым!" });
      return;
    }

    setErrors({ ...errors, tin: undefined });

    try {
      const response: any = await fetchEntrepreneurByTin(formData.tin).unwrap();
      setFormData((prev) => ({
        ...prev,
        name: response.fullName,
        ein: response.ein,
        address: response.adr || "",
      }));
      setIsTinVerified(true);

      if (errors.name) setErrors({ ...errors, name: undefined });
      if (errors.ein) setErrors({ ...errors, ein: undefined });

      toast.success("Данные успешно загружены по ИНН!");
    } catch (err: any) {
      setErrors({
        ...errors,
        tin: "Индивидуальный предприниматель с таким ИНН не найден",
      });
      setIsTinVerified(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      tin: "",
      ein: "",
      countryID: "59ea4b0f-549f-4070-8fd3-6c7d899ea709",
      cityID: "",
      districtID: "",
      office: "",
      address: "",
      actualAddress: "",
      statusID: "92b7c468-658e-45fe-ae87-0bc6d17ac8b2",
      userName: "",
    });
    setErrors({});
    setIsTinVerified(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, "");
    const limited = cleaned.slice(0, 9);

    setFormData((prev) => ({ ...prev, userName: limited }));

    if (errors.userName) {
      setErrors({ ...errors, userName: undefined });
    }
  };

  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Пожалуйста, исправьте ошибки в форме");
      return;
    }

    try {
      await addEntrepreneur({
        id: "",
        userType: userTypeId,
        tin: formData.tin,
        ein: formData.ein,
        name: formData.name,
        office: formData.office,
        districtID: formData.districtID,
        district: { id: "", name: "" },
        address: formData.address,
        actualAddress: formData.actualAddress,
        activityStatusID: formData.statusID,
        activityStatus: { id: "", name: "" },
        countryID: formData.countryID,
        country: { id: "", name: "", code: "" },
        cityID: formData.cityID,
        city: { id: "", name: "" },
        username: formData.userName,
        content: undefined,
      }).unwrap();

      toast.success("Индивидуальный предприниматель успешно добавлен!");
      handleReset();
    } catch (err: any) {
      if (err.error?.status === 409) {
        toast.error("Этот индивидуальный предприниматель уже существует!");
      } else {
        toast.error("Ошибка при добавлении индивидуального предпринимателя.");
      }
    }
  };

  return (
    <>
      <PageMeta title={t("subject.enter.add.title")} description="" />
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
              {t("subject.enter.add.title")}
            </span>
          </div>
        }
      />
      <ComponentCard title={t("subject.enter.add.title")}>
        <form action="" onSubmit={handleSubmit}>
          <div>
            <Label>{t("subject.enter.common.inn")}</Label>
            <div className="sm:flex mb-2 sm:flex-row grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div>
                <Input
                  value={formData.tin}
                  onChange={(e) => handleChange("tin", e.target.value)}
                  type="text"
                  placeholder={`${t("subject.enter.common.inn")}`}
                  className={errors.tin ? "border-red-500" : ""}
                  disabled={isTinVerified}
                />
                {errors.tin && (
                  <p className="mt-1 text-sm text-red-500">{errors.tin}</p>
                )}
              </div>
              <Button onClick={handleClick} disabled={isTinVerified}>
                {t("subject.enter.common.data_from_inn")}
              </Button>
              {isTinVerified && (
                <Button onClick={handleReset} variant="outline">
                  Сбросить
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 mt-[1%] md:grid-cols-2">
            <div>
              <Label>{t("subject.enter.common.name")}</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={`${t("subject.enter.common.name")}`}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <Label>{t("subject.enter.common.ein")}</Label>
              <Input
                type="text"
                value={formData.ein}
                onChange={(e) => handleChange("ein", e.target.value)}
                placeholder={`${t("subject.enter.common.ein")}`}
                className={errors.ein ? "border-red-500" : ""}
              />
              {errors.ein && (
                <p className="mt-1 text-sm text-red-500">{errors.ein}</p>
              )}
            </div>
            <div>
              <Label>{t("subject.enter.common.choose_country")}</Label>
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
                onChange={(value) => handleSelectChange("countryID", value)}
                className={errors.countryID ? "border-red-500" : ""}
              />
              {errors.countryID && (
                <p className="mt-1 text-sm text-red-500">{errors.countryID}</p>
              )}
            </div>
            <div>
              <Label>{t("subject.enter.common.choose_district")}</Label>
              <Select
                options={[
                  {
                    value: "",
                    label: t("subject.enter.common.choose_district"),
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
              <Label>{t("subject.enter.common.choose_city")}</Label>
              <Select
                options={[
                  { value: "", label: t("subject.enter.common.choose_city") },
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
              <Label>{t("subject.enter.common.street")}</Label>
              <Input
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                type="text"
                placeholder={`${t("subject.enter.common.street")}`}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>
            <div>
              <Label>{t("subject.enter.common.home_office")}</Label>
              <Input
                value={formData.office}
                onChange={(e) => handleChange("office", e.target.value)}
                type="text"
                placeholder={`${t("subject.enter.common.home_office")}`}
                className={errors.office ? "border-red-500" : ""}
              />
              {errors.office && (
                <p className="mt-1 text-sm text-red-500">{errors.office}</p>
              )}
            </div>
            {/* <div>
              <Label>{t("subject.enter.common.actualAddress")}</Label>
              <Input
                value={formData.actualAddress}
                onChange={(e) => handleChange("actualAddress", e.target.value)}
                type="text"
                placeholder={`${t("subject.enter.common.actualAddress")}`}
                className={errors.actualAddress ? "border-red-500" : ""}
              />
              {errors.actualAddress && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.actualAddress}
                </p>
              )}
            </div> */}
            <div>
              <Label>{t("subject.enter.common.choose_status")}</Label>
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
              <Label>{t("subject.enter.add.phone")}</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  +992
                </div>
                <Input
                  value={formData.userName}
                  onChange={handlePhoneChange}
                  type="tel"
                  placeholder="XXXXXXXXX"
                  className={`pl-14 ${errors.userName ? "border-red-500" : ""}`}
                />
              </div>
              {errors.userName && (
                <p className="mt-1 text-sm text-red-500">{errors.userName}</p>
              )}
            </div>
          </div>
          <Button className="mt-4 w-full sm:w-auto">
            {t("subject.enter.common.save")}
          </Button>
        </form>
      </ComponentCard>
    </>
  );
};

export default EntrepreneurForm;
