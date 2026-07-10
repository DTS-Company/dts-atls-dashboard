import { useState } from "react";
import { useCreateContactMutation } from "../api/api";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import Select from "@components/form/Select";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import { useLocalization } from "@hooks/useLocalization";

const ContactForm = () => {
  const { id } = useParams();
  const entityId = String(id);
  const [formData, setFormData] = useState({ type: "", contact: "" });
  const [addContact] = useCreateContactMutation();
  const { t } = useLocalization();

  const contactTypeLabels: Record<string, string> = {
    PHONE_NUMBER: t("subject.individual.contacts_page.type_phone_number"),
    E_MAIL: t("subject.individual.contacts_page.type_e_mail"),
    WEB_SITE: t("subject.individual.contacts_page.type_web_site"),
    POSTCODE: t("subject.individual.contacts_page.type_postcode"),
    FAX: t("subject.individual.contacts_page.type_fax"),
  };

  const contactTypeOptions = Object.entries(contactTypeLabels).map(
    ([value, label]) => ({ value, label })
  );

  const placeholderMap: Record<string, string> = { ...contactTypeLabels };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { type, contact } = formData;

    if (!type || !contact.trim()) {
      toast.error("Все поля обязательны для заполнения");
      return;
    }

    if (type === "E_MAIL" && !/\S+@\S+\.\S+/.test(contact)) {
      toast.error("Введите корректный email");
      return;
    }

    if ((type === "PHONE_NUMBER" || type === "FAX") && !/^\d{9}$/.test(contact)) {
      toast.error("Номер должен содержать ровно 9 цифр");
      return;
    }

    try {
      await addContact({ entityId, data: { type, contact } }).unwrap();
      setFormData({ type: "", contact: "" });
      toast.success("Контакт успешно добавлен!");
    } catch {
      toast.error("Ошибка при добавлении контакта");
    }
  };

  const handleContactChange = (value: string) => {
    if (formData.type === "PHONE_NUMBER" || formData.type === "FAX") {
      value = value.replace(/\D/g, "").slice(0, 9);
    }
    setFormData((prev) => ({ ...prev, contact: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <div className="flex-none gap-4 items-center xl:flex">
        <div>
          <Select
            value={formData.type}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
            options={[
              { label: "Выберите тип контакта", value: "" },
              ...contactTypeOptions,
            ]}
          />
        </div>

        <div className="flex items-center border dark:border-gray-700 rounded-lg">
          {formData.type === "PHONE_NUMBER" && (
            <span className="ml-2 text-gray-600 font-semibold">+992</span>
          )}
          <Input
            placeholder={placeholderMap[formData.type] || "Введите данные"}
            type="text"
            value={formData.contact}
            onChange={(e) => handleContactChange(e.target.value)}
            className="w-full border-none focus:ring-0"
          />
        </div>
        <Button>{t("subject.enter.common.save")}</Button>
      </div>
    </form>
  );
};

export default ContactForm;
