import { useState } from "react";
import { toast } from "react-toastify";
import { Building2 } from "lucide-react";
import { useAddCityMutation, useGetCityQuery } from "../api/api";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import { useLocalization } from "@hooks/useLocalization";

const CityForm = () => {
  const [name, setName] = useState("");
  const [addCity] = useAddCityMutation();
  const { data: cities = [] } = useGetCityQuery();
  const totalCount = cities.length;
  const { t } = useLocalization();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.warning("Введите название Города/Района!");
      return;
    }
    try {
      await addCity({ id: "", name }).unwrap();
      setName("");
      toast.success("Город/Район успешно добавлен!");
    } catch (err: any) {
      if (err.error?.status === 409) {
        toast.error("Этот Город/Район уже существует!");
      } else {
        toast.error("Ошибка при добавлении Город/Района.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-4 items-center justify-between mt-[1%]"
    >
      <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-4 h-12 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md dark:bg-gray-700">
          <Building2 className="text-gray-800 size-5 dark:text-white/90" />
        </div>
        <div className="text-start flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t("references.cities.all")}
          </span>
          <h4 className="font-bold text-gray-800 text-lg dark:text-white/90">
            {totalCount}
          </h4>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <Input
          placeholder={`${t("references.common.name")}`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12"
        />
        <Button className="h-12">{t("references.common.save")}</Button>
      </div>
    </form>
  );
};

export default CityForm;
