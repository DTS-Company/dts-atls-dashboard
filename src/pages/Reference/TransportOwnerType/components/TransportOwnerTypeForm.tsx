import { useState } from "react";
import {
  useAddTransportOwnerTypeMutation,
  useGetTransportOwnerTypeQuery,
} from "../api/api";
import { toast } from "react-toastify";
import { Users } from "lucide-react";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import { useLocalization } from "@hooks/useLocalization";

const TransportOwnerTypeForm = () => {
  const [name, setName] = useState("");
  const [addTransportOwnerType] = useAddTransportOwnerTypeMutation();
  const { data: transportOwnerTypeList = [] } = useGetTransportOwnerTypeQuery();
  const totalCount = transportOwnerTypeList.length;
  const {t} = useLocalization()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await addTransportOwnerType({ id: "", name: name }).unwrap();
      setName("");
      toast.success("Тип владельца успешно добавлен!");
    } catch (err: any) {
      if (err.error?.status === 409) {
        toast.error("Этот тип владельца уже существует!");
      } else {
        toast.error("Ошибка при добавлении тип владельца.");
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
          <Users className="text-gray-800 size-5 dark:text-white/90" />
        </div>
        <div className="text-start flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t("references.transport_owner_type.all")}
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

export default TransportOwnerTypeForm;
