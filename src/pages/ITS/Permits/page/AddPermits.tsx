import { useState } from "react";
import { toast } from "react-toastify";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import Select from "@components/form/Select";
import Button from "@components/ui/button/Button";
import {
  useCreateBlankMutation,
  useGetMetaCountryQuery,
  useGetMetaPermitQuery,
} from "@pages/PermitApplication/page/Dozvol/api/api";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const AddPermits = () => {
  const [createBlank, { isLoading }] = useCreateBlankMutation();
  const { data: listCountry = [] } = useGetMetaCountryQuery();
  const { data: listPermit = [] } = useGetMetaPermitQuery();
  const { t } = useLocalization();

  const [formData, setFormData] = useState({
    doc_num: "",
    id_country: "",
    permit_type: "",
    ser: "",
    num_start: "",
    num_end: "",
    date_expiry: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBlank(formData).unwrap();
      setFormData({
        doc_num: "",
        id_country: "",
        permit_type: "",
        ser: "",
        num_start: "",
        num_end: "",
        date_expiry: "",
      });
      toast.success("Разрешение успешно создано!");
    } catch (error) {
      toast.error("Ошибка при создании разрешения");
    }
  };

  return (
    <>
      <PageMeta title={t("add_permits.title")} description="" />
      <PageBreadcrumb
        pageTitle={
          <>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/permits"
            >
              {t("permits.breadcrum")}
              <ChevronRight size={18} />
            </Link>
            {t("add_permits.title")}
          </>
        }
      />
      <ComponentCard title={t("add_permits.title")}>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <Label>{t("add_permits.doc_num")}</Label>
            <Input
              name="doc_num"
              value={formData.doc_num}
              onChange={handleChange}
              placeholder={`${t("add_permits.doc_num")}`}
            />
          </div>

          <div>
            <Label>{t("add_permits.country_id")}</Label>
            <Select
              options={[
                { value: "", label: t("add_permits.choose_country") },
                ...listCountry.map(({ country_Name, country_code }) => ({
                  value: country_code,
                  label: country_Name,
                })),
              ]}
              value={formData.id_country}
              onChange={(value) => handleSelectChange("id_country", value)}
            />
          </div>

          <div>
            <Label>{t("add_permits.permits_type")}</Label>
            <Select
              options={[
                { value: "", label: t("add_permits.permits_type") },
                ...listPermit.map(({ permit_Name, permit_type }) => ({
                  value: permit_type,
                  label: permit_Name,
                })),
              ]}
              value={formData.permit_type}
              onChange={(value) => handleSelectChange("permit_type", value)}
            />
          </div>

          <div>
            <Label>{t("add_permits.ser")}</Label>
            <Input
              name="ser"
              value={formData.ser}
              onChange={handleChange}
              placeholder={`${t("add_permits.ser")}`}
            />
          </div>

          <div>
            <Label>{t("add_permits.start_num")}</Label>
            <Input
              name="num_start"
              value={formData.num_start}
              onChange={handleChange}
              placeholder={`${t("add_permits.start_num_placeholder")}`}
            />
          </div>

          <div>
            <Label>{t("add_permits.end_num")}</Label>
            <Input
              name="num_end"
              value={formData.num_end}
              onChange={handleChange}
              placeholder={`${t("add_permits.end_num_placeholder")}`}
            />
          </div>

          <div>
            <Label>{t("add_permits.date_expiry")}</Label>
            <Input
              type="date"
              name="date_expiry"
              value={formData.date_expiry}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2 flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() =>
                setFormData({
                  doc_num: "",
                  id_country: "",
                  permit_type: "",
                  ser: "",
                  num_start: "",
                  num_end: "",
                  date_expiry: "",
                })
              }
            >
              {t("add_permits.cancel")}
            </Button>
            <Button disabled={isLoading}>
              {isLoading ? t("add_permits.saving") : t("add_permits.save")}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
};

export default AddPermits;
