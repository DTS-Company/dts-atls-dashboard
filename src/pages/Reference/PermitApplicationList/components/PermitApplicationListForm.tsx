import { useState } from "react";
import {
  useAddPermitApplicationListMutation,
  useGetPermitApplicationListQuery,
} from "../api/api";
import { Modal } from "@components/ui/modal";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import { useGetAllDocumentTypesQuery } from "@pages/Reference/DocumentType/api/api";
import Label from "@components/form/Label";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocalization } from "@hooks/useLocalization";

interface PermitApplicationListFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const PermitApplicationListForm = ({
  isOpen,
  onClose,
}: PermitApplicationListFormProps) => {
  const [id, setId] = useState<number | undefined>();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [docTypeId, setDocTypeId] = useState<string>("");
  const {t} = useLocalization()

  const { data: cities = [] } = useGetPermitApplicationListQuery();
  const { data: allDocTypesData } = useGetAllDocumentTypesQuery({
    page: 0,
    size: 1000,
    sort: "id",
  });
  const allDocTypes = allDocTypesData?.content || [];
  const filteredDocTypes = allDocTypes.filter(
    (doc) => doc.docType === "LICENSE"
  );

  const [addPermitApplicationList] = useAddPermitApplicationListMutation();

  const handleSave = async () => {
    if (!id || !title || !text || !docTypeId) {
      toast.error("Все поля обязательны");
      return;
    }

    const exists = cities.some((city) => city.id === id);
    if (exists) {
      toast.error(`Лицензия с ID ${id} уже существует`);
      return;
    }

    const result = await addPermitApplicationList({
      id,
      title,
      text,
      idDocType: docTypeId,
    });

    if ("error" in result) {
      toast.error("Ошибка при добавлении лицензии");
    } else {
      onClose();
      toast.success("Лицензия успешно добавлена!");
      setId(undefined);
      setTitle("");
      setText("");
      setDocTypeId("");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {t("references.licences.add")}
          </h4>
          <div className="flex flex-col space-y-4">
            <div>
              <Label>{t("references.licences.id")}</Label>
              <Input
                type="number"
                value={id ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setId(val === "" ? undefined : Number(val));
                }}
              />
            </div>
            <div>
              <Label>{t("references.licences.name_table")}</Label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label>{t("references.licences.text")}</Label>
              <Input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div>
              <Label>{t("references.licences.doc_type")}</Label>
              <select
                value={docTypeId}
                onChange={(e) => setDocTypeId(e.target.value)}
                className="w-full border rounded-md p-2"
              >
                <option value="">{t("references.licences.choose_doc_type")}</option>
                {filteredDocTypes.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <Button size="sm" variant="outline" onClick={onClose}>
                {t("references.common.cancel")}
              </Button>
              <Button size="sm" onClick={handleSave}>
                {t("references.common.save")}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PermitApplicationListForm;
