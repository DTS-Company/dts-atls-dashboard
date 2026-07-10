import { useState } from "react";
import {
  useAddDocumentTypeMutation,
  useGetAllDocumentTypesQuery,
} from "../api/api";
import { toast } from "react-toastify";
import { FileText } from "lucide-react";
import Input from "@components/form/input/InputField";
import Select from "@components/form/Select";
import Button from "@components/ui/button/Button";
import { useLocalization } from "@hooks/useLocalization";
import Label from "@components/form/Label";

const DocumentTypeForm = () => {
  const [name, setName] = useState("");
  const [descriptionLabel, setDescriptionLabel] = useState("");
  const [descriptionValues, setDescriptionValues] = useState("");
  const [userType, setUserType] = useState<
    ("INDIVIDUAL" | "COMPANY" | "ENTREPRENEUR" | "TRANSPORT")[]
  >([]);
  const { t } = useLocalization();

  const [docType, setDocType] = useState<
    | "DOC_USER"
    | "LICENSE"
    | "LICENSE_CARD"
    | "CERTIFICATE"
    | "SPECIAL_PERMITS"
    | "E_TIR"
    | "I_T_PERMITS"
  >("DOC_USER");
  const [addDocumentType] = useAddDocumentTypeMutation();
  const { data } = useGetAllDocumentTypesQuery({
    page: 0,
    size: 1000,
    sort: "id",
  });
  const totalCount = data ? data.content.length : 0;

  const userTypeOptions = [
    { value: "INDIVIDUAL", label: t("references.document_types.ind") },
    { value: "COMPANY", label: t("references.document_types.comp") },
    { value: "ENTREPRENEUR", label: t("references.document_types.inter") },
    { value: "TRANSPORT", label: t("references.document_types.transport") },
  ];

  const docTypeOptions = [
    { value: "DOC_USER", label: t("references.document_types.doc_user") },
    { value: "LICENSE", label: t("references.document_types.licence") },
    {
      value: "LICENSE_CARD",
      label: t("references.document_types.licence_card"),
    },
    { value: "CERTIFICATE", label: t("references.document_types.certificate") },
    {
      value: "SPECIAL_PERMITS",
      label: t("references.document_types.spec_per"),
    },
    { value: "E_TIR", label: "e-TIR" },
    { value: "I_T_PERMITS", label: t("references.document_types.it_per") },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Пожалуйста, введите название типа документа");
      return;
    }

    if (userType.length === 0) {
      toast.error("Пожалуйста, выберите хотя бы один тип пользователя");
      return;
    }

    try {
      await addDocumentType({
        name: name.trim(),
        userType,
        docType,
        docView: "NULL",
        refers: "",
        descriptionLabel: descriptionLabel.trim(),
        descriptionValues: descriptionValues.trim(),
      }).unwrap();

      setName("");
      setDescriptionLabel("");
      setDescriptionValues("");
      setUserType([]);
      setDocType("DOC_USER");
      toast.success("Тип документа успешно добавлен!");
    } catch (err: any) {
      if (err.error?.status === 409) {
        toast.error("Этот тип документа уже существует!");
      } else {
        toast.error("Ошибка при добавлении типа документа.");
      }
    }
  };

  const handleDocTypeChange = (value: string) => {
    setDocType(
      value as
        | "DOC_USER"
        | "LICENSE"
        | "LICENSE_CARD"
        | "CERTIFICATE"
        | "SPECIAL_PERMITS"
        | "E_TIR"
        | "I_T_PERMITS",
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="mb-2 block">
              {t("references.common.name")} *
            </Label>
            <Input
              id="name"
              placeholder="Введите название типа документа"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="docType" className="mb-2 block">
              {t("references.document_types.doc_type")} *
            </Label>
            <Select
              options={docTypeOptions}
              value={docType}
              onChange={handleDocTypeChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="descriptionLabel" className="mb-2 block">
              Описания
            </Label>
            <Input
              id="descriptionLabel"
              placeholder="Введите описания"
              type="text"
              value={descriptionLabel}
              onChange={(e) => setDescriptionLabel(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="descriptionValues" className="mb-2 block">
              Значения описания
            </Label>
            <Input
              id="descriptionValues"
              placeholder="Введите значения описания"
              type="text"
              value={descriptionValues}
              onChange={(e) => setDescriptionValues(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label className="mb-3 block">
            {t("references.document_types.user_type")} *
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {userTypeOptions.map((option) => (
              <div
                key={option.value}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                  userType.includes(option.value as any)
                    ? "bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-500"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                }`}
                onClick={() => {
                  const value = option.value as
                    | "INDIVIDUAL"
                    | "COMPANY"
                    | "ENTREPRENEUR"
                    | "TRANSPORT";
                  if (userType.includes(value)) {
                    setUserType((prev) =>
                      prev.filter((type) => type !== value),
                    );
                  } else {
                    setUserType((prev) => [...prev, value]);
                  }
                }}
              >
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={userType.includes(option.value as any)}
                  onChange={() => {}}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-4 h-12 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md dark:bg-gray-700">
              <FileText className="text-gray-800 size-5 dark:text-white/90" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("references.document_types.all")}
              </span>
              <h4 className="font-bold text-gray-800 text-lg dark:text-white/90">
                {totalCount}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none">
              <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
                Выбрано: {userType.length} тип(ов) пользователя
              </span>
            </div>
            <Button
              className="h-12 px-6 min-w-[120px]"
              disabled={!name.trim() || userType.length === 0}
            >
              {t("references.common.save")}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DocumentTypeForm;
