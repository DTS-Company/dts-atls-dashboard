import React, { useState } from "react";
import { Link, useParams } from "react-router";
import { ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { useGetCityQuery } from "@pages/Reference/City/api/api";
import { useGetCountryQuery } from "@pages/Reference/Country/api/api";
import { useGetStatusQuery } from "@pages/Reference/Status/api/api";
import { useGetDistrictQuery } from "@pages/Reference/District/api/api";
import {
  useAddIndividualMutation,
  useLazyGetIndividualByTinQuery,
} from "../api/api";
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import Select from "@components/form/Select";
import Button from "@components/ui/button/Button";
import { useLocalization } from "@hooks/useLocalization";

interface ValidationErrors {
  tin?: string;
  individualName?: string;
  cityID?: string;
  districtID?: string;
  statusID?: string;
  office?: string;
  address?: string;
  userName?: string;
  countryID?: string;
}

function IndividualForm() {
  const { id } = useParams();
  const userTypeId = String(id);

  const { data: listCity = [] } = useGetCityQuery();
  const { data: listCountry = [] } = useGetCountryQuery();
  const { data: listStatus = [] } = useGetStatusQuery();
  const { data: listDistrict = [] } = useGetDistrictQuery();
  const { t } = useLocalization();

  const [addIndividual] = useAddIndividualMutation();
  const [fetchIndividualByTin] = useLazyGetIndividualByTinQuery();

  const [formData, setFormData] = useState({
    tin: "",
    individualName: "",
    cityID: "",
    districtID: "",
    statusID: "92b7c468-658e-45fe-ae87-0bc6d17ac8b2",
    office: "",
    address: "",
    userName: "",
    countryID: "59ea4b0f-549f-4070-8fd3-6c7d899ea709",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isTinVerified, setIsTinVerified] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.tin.trim()) {
      newErrors.tin = "ИНН не может быть пустым";
    } else if (!isTinVerified) {
      newErrors.tin = "Пожалуйста, проверьте ИНН";
    }

    if (!formData.individualName.trim()) {
      newErrors.individualName = "ФИО не может быть пустым";
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

    if (!formData.statusID.trim()) {
      newErrors.statusID = "Выберите статус";
    }

    if (!formData.office.trim()) {
      newErrors.office = "Домашний офис не может быть пустым";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Улица не может быть пустой";
    }

    if (!formData.userName.trim()) {
      newErrors.userName = "Телефон не может быть пустым";
    } else if (!/^\d{9}$/.test(formData.userName)) {
      newErrors.userName = "Телефон должен содержать 9 цифр";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!formData.tin.trim()) {
      setErrors({ ...errors, tin: "ИНН не может быть пустым!" });
      return;
    }

    setErrors({ ...errors, tin: undefined });

    try {
      const response: any = await fetchIndividualByTin(formData.tin).unwrap();
      setFormData((prev) => ({
        ...prev,
        individualName: response.fullName,
        address: response.adr || "",
      }));
      setIsTinVerified(true);

      if (errors.individualName) {
        setErrors({ ...errors, individualName: undefined });
      }

      toast.success("Данные успешно загружены по ИНН!");
    } catch (err: any) {
      setErrors({ ...errors, tin: "Физическое лицо с таким ИНН не найдено" });
      setIsTinVerified(false);
    }
  };

  const handleReset = () => {
    setFormData({
      tin: "",
      individualName: "",
      cityID: "",
      districtID: "",
      statusID: "92b7c468-658e-45fe-ae87-0bc6d17ac8b2",
      office: "",
      address: "",
      userName: "",
      countryID: "59ea4b0f-549f-4070-8fd3-6c7d899ea709",
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

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    if (field === "tin" && isTinVerified) {
      setIsTinVerified(false);
      setFormData((prev) => ({ ...prev, individualName: "" }));
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSelectChange = (field: keyof typeof formData, value: string) => {
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
      await addIndividual({
        id: "",
        tin: formData.tin,
        individualName: formData.individualName,
        individualType: userTypeId,
        countryID: formData.countryID,
        country: { id: "", name: "", code: "" },
        cityID: formData.cityID,
        city: { id: "", name: "" },
        office: formData.office,
        districtID: formData.districtID,
        district: { id: "", name: "" },
        address: formData.address,
        activityStatusID: formData.statusID,
        activityStatus: { id: "", name: "" },
        username: formData.userName,
      }).unwrap();

      toast.success("Физическое лицо успешно добавлено!");
      handleReset();
    } catch (err: any) {
      if (err.error?.status === 409) {
        toast.error("Это физическое лицо уже существует!");
      } else {
        toast.error("Ошибка при добавлении физического лица.");
      }
    }
  };

  return (
    <>
      <PageMeta title={t("subject.individual.add.title")} description="" />
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
              {t("subject.individual.add.title")}
            </span>
          </div>
        }
      />
      <ComponentCard title={t("subject.individual.add.title")}>
        <form action="" onSubmit={handleSubmit}>
          <div>
            <Label>{t("subject.individual.common.inn")}</Label>
            <div className="sm:flex mb-2 sm:flex-row grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div>
                <Input
                  value={formData.tin}
                  onChange={(e) => handleInputChange("tin", e.target.value)}
                  type="text"
                  placeholder={`${t("subject.individual.common.inn")}`}
                  className={errors.tin ? "border-red-500" : ""}
                  disabled={isTinVerified}
                />
                {errors.tin && (
                  <p className="mt-1 text-sm text-red-500">{errors.tin}</p>
                )}
              </div>
              <Button onClick={handleClick} disabled={isTinVerified}>
                {t("subject.individual.common.data_from_inn")}
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
              <Label>{t("subject.individual.common.data_from_inn")}</Label>
              <Input
                type="text"
                value={formData.individualName}
                onChange={(e) =>
                  handleInputChange("individualName", e.target.value)
                }
                placeholder={`${t("subject.individual.common.fullname")}`}
                className={errors.individualName ? "border-red-500" : ""}
              />
              {errors.individualName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.individualName}
                </p>
              )}
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
                onChange={(value) => handleSelectChange("countryID", value)}
                className={errors.countryID ? "border-red-500" : ""}
              />
              {errors.countryID && (
                <p className="mt-1 text-sm text-red-500">{errors.countryID}</p>
              )}
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
                onChange={(value) => handleSelectChange("districtID", value)}
                className={errors.districtID ? "border-red-500" : ""}
              />
              {errors.districtID && (
                <p className="mt-1 text-sm text-red-500">{errors.districtID}</p>
              )}
            </div>
            <div>
              <Label>{t("subject.individual.common.choose_city")}</Label>
              <Select
                options={[
                  {
                    value: "",
                    label: t("subject.individual.common.choose_city"),
                  },
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
              <Label>{t("subject.individual.common.choose_status")}</Label>
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
              <Label>{t("subject.individual.common.home_office")}</Label>
              <Input
                value={formData.office}
                onChange={(e) => handleInputChange("office", e.target.value)}
                type="text"
                placeholder={`${t("subject.individual.common.home_office")}`}
                className={errors.office ? "border-red-500" : ""}
              />
              {errors.office && (
                <p className="mt-1 text-sm text-red-500">{errors.office}</p>
              )}
            </div>
            <div>
              <Label>{t("subject.individual.common.street")}</Label>
              <Input
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                type="text"
                placeholder={`${t("subject.individual.common.street")}`}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>
            <div>
              <Label>{t("subject.individual.add.phone")}</Label>
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
            {t("subject.individual.common.save")}
          </Button>
        </form>
      </ComponentCard>
    </>
  );
}

export default IndividualForm;
