import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { useCreateContactMutation } from "../api/api";
import Select from "@components/form/Select";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import { useLocalization } from "@hooks/useLocalization";

const ContactForm = () => {
  const { id } = useParams();
  const entityId = String(id);
  const { t } = useLocalization();

  const [type, setType] = useState("");
  const [contact, setContact] = useState("");
  const [addContact] = useCreateContactMutation();

  const placeholders: Record<string, string> = {
    PHONE_NUMBER: t("subject.individual.contacts_page.table_phone"),
    E_MAIL: t("subject.individual.contacts_page.type_e_mail"),
    WEB_SITE: t("subject.individual.contacts_page.type_web_site"),
    POSTCODE: t("subject.individual.contacts_page.type_postcode"),
    FAX: t("subject.individual.contacts_page.type_fax"),
  };

  const validateContact = () => {
    if (!type || !contact.trim()) return "Все поля обязательны для заполнения";
    if (type === "E_MAIL" && !/\S+@\S+\.\S+/.test(contact))
      return "Введите корректный email";
    if ((type === "PHONE_NUMBER" || type === "FAX") && !/^\d{9}$/.test(contact))
      return "Номер должен содержать ровно 9 цифр";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const errorMessage = validateContact();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      await addContact({ entityId, data: { type, contact } }).unwrap();
      setType("");
      setContact("");
      toast.success("Контакт успешно добавлен!");
    } catch {
      toast.error("Ошибка при добавлении контакта");
    }
  };

  const handleContactChange = (value: string) => {
    if (type === "PHONE_NUMBER" || type === "FAX") {
      value = value.replace(/\D/g, "").slice(0, 9);
    }
    setContact(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <div className="flex-none gap-4 items-center xl:flex">
        <div>
          <Select
            value={type}
            onChange={setType}
            options={[
              {
                label: t("subject.individual.contacts_page.form_select_type"),
                value: "",
              },
              {
                label: t("subject.individual.contacts_page.table_phone"),
                value: "PHONE_NUMBER",
              },
              {
                label: t("subject.individual.contacts_page.type_e_mail"),
                value: "E_MAIL",
              },
              {
                label: t("subject.individual.contacts_page.type_web_site"),
                value: "WEB_SITE",
              },
              {
                label: t("subject.individual.contacts_page.type_postcode"),
                value: "POSTCODE",
              },
              {
                label: t("subject.individual.contacts_page.type_fax"),
                value: "FAX",
              },
            ]}
          />
        </div>

        <div className="flex items-center border dark:border-gray-700 rounded-lg">
          {type === "PHONE_NUMBER" && (
            <span className="ml-2 text-gray-600 font-semibold">+992</span>
          )}
          <Input
            placeholder={placeholders[type] || "Введите данные"}
            type="text"
            value={contact}
            onChange={(e) => handleContactChange(e.target.value)}
            className="w-full border-none focus:ring-0"
          />
        </div>
        <Button>{t("subject.individual.contacts_page.btn_save")}</Button>
      </div>
    </form>
  );
};

export default ContactForm;
