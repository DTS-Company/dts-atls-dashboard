import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateBlankMutation,
  useGetMetaCountryQuery,
  useGetMetaPermitQuery,
} from "../api/api";
import Button from "@components/ui/button/Button";
import { Modal } from "@components/ui/modal";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import Select from "@components/form/Select";
import { useModal } from "@hooks/useModal";

const Dozvol = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [createBlank, { isLoading }] = useCreateBlankMutation();
  const { data: listCountry = [] } = useGetMetaCountryQuery();
  const { data: listPermit = [] } = useGetMetaPermitQuery();

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      closeModal();
      toast.success("Разрешение успешно создано!");
    } catch (error) {
      toast.success("Ошибка при создании разрешения");
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openModal}>+ Создать новое разрешение</Button>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
        <div className="p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-2xl font-semibold">
            Создать новое разрешение
          </h4>

          <form className="flex flex-col space-y-4">
            <div>
              <Label>Номер документа</Label>
              <Input
                name="doc_num"
                value={formData.doc_num}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>ID страны</Label>
              <Select
                options={[
                  { value: "", label: "Выберите страну" },
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
              <Label>Тип разрешения</Label>
              <Select
                options={[
                  { value: "", label: "Тип разрешения" },
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
              <Label>Серия</Label>
              <Input name="ser" value={formData.ser} onChange={handleChange} />
            </div>

            <div>
              <Label>Начальный номер</Label>
              <Input
                name="num_start"
                value={formData.num_start}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Конечный номер</Label>
              <Input
                name="num_end"
                value={formData.num_end}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Срок действия</Label>
              <Input
                type="date"
                name="date_expiry"
                value={formData.date_expiry}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeModal}>
                Отмена
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Dozvol;
