import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import Select from "@components/form/Select";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import { useCreateResponsiblePersonMutation } from "../api/api";
import { useLocalization } from "@hooks/useLocalization";
import { useLazyGetIndividualByTinQuery } from "@pages/Individual/api/api";

const ResponsiblePersonForm = () => {
  const { id } = useParams();
  const entityId = String(id);
  const { t } = useLocalization();

  const [type, setType] = useState("");
  const [fullName, setFullName] = useState("");
  const [tin, setTin] = useState("");

  const [addResponsiblePerson] = useCreateResponsiblePersonMutation();
  const [fetchCompanyByTin] = useLazyGetIndividualByTinQuery();

  const handleFetch = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!tin.trim()) {
      toast.warning("ИНН не может быть пустым");
      return;
    }

    try {
      const response = await fetchCompanyByTin(tin).unwrap();
      setFullName(response.fullName);
    } catch (err: any) {
      toast.error(`ИНН не найден: '${tin}'`);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!type || !tin.trim() || !fullName.trim()) {
      toast.warning("Заполните все поля");
      return;
    }

    try {
      await addResponsiblePerson({
        entityId,
        data: { type, fullName, tin },
      }).unwrap();
      setType("");
      setFullName("");
      setTin("");
      toast.success("Ответственное лицо успешно добавлено!");
    } catch (error: any) {
      if (error?.status === 409) {
        toast.error("Ответственное лицо с таким инн уже существует");
      } else {
        toast.error("Ошибка при добавлении ответственного лица.");
      }
    }
  };

  return (
    <form className="flex-none gap-4 xl:flex" onSubmit={handleSubmit}>
      <div className="flex-none gap-4 xl:flex">
        <div className="xl:w-[50%]">
          <Select
            value={type}
            onChange={setType}
            options={[
              {
                label: t("subject.company.responsible_person_page.choose"),
                value: "",
              },
              {
                label: t(
                  "subject.company.responsible_person_page.gen_director"
                ),
                value: t(
                  "subject.company.responsible_person_page.gen_director"
                ),
              },
              {
                label: t("subject.company.responsible_person_page.director"),
                value: t("subject.company.responsible_person_page.director"),
              },
              {
                label: t("subject.company.responsible_person_page.accountant"),
                value: t("subject.company.responsible_person_page.accountant"),
              },
            ]}
          />
        </div>
        <div className="xl:w-[50%]">
          <Input
            placeholder={`${t(
              "subject.company.responsible_person_page.placeholder"
            )}`}
            type="text"
            value={fullName}
            disabled
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          value={tin}
          onChange={(e) => setTin(e.target.value)}
          type="text"
          placeholder={`${t("subject.company.employees_table.inn")}`}
        />
        <Button onClick={handleFetch}>
          {t("subject.company.common.data_from_inn")}
        </Button>
      </div>
      <Button>{t("subject.company.common.save")}</Button>
    </form>
  );
};

export default ResponsiblePersonForm;
