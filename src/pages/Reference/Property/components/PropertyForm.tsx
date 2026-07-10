import { useState } from "react";
import Alert from "../../../../components/ui/alert/Alert";
import { useAddPropertyMutation } from "../api/api";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";

const PropertyForm = () => {
  const [name, setName] = useState("");
  const [addProperty] = useAddPropertyMutation();

  const [alertData, setAlertData] = useState<{
    type: "error" | "success" | "warning" | "info";
    message: string;
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await addProperty({ id: "", name: name }).unwrap();
      setName("");
      setAlertData({
        type: "success",
        message: "✅ Имущество успешно добавлен!",
      });
    } catch (err: any) {
      if (err.error?.status === 409) {
        setAlertData({
          type: "error",
          message: "⚠️ Этот имущество уже существует!",
        });
      } else {
        setAlertData({
          type: "error",
          message: "❌ Ошибка при добавлении имущества.",
        });
      }
    }
  };

  return (
    <>
      {alertData && (
        <Alert
          variant={alertData.type}
          title="Уведомление"
          message={alertData.message}
        />
      )}
      <form onSubmit={handleSubmit} className="flex gap-4 mt-[1%]">
        <div className="w-[50%]">
          <Input
            placeholder="Название"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button>Сохранить</Button>
      </form>
    </>
  );
};

export default PropertyForm;
