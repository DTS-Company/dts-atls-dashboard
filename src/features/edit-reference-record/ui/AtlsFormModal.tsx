import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "@shared/ui/modal/Modal";
import Button from "@shared/ui/button/Button";
import { useLocalization } from "@shared/lib/useLocalization";
import { getApiErrorMessage } from "@shared/lib/getApiErrorMessage";
import {
  useAddAtlsRecordMutation,
  useEditAtlsRecordMutation,
  TAtlsFormValue,
  TAtlsRecord,
  TAtlsReferenceConfig,
  getInitialValues,
  getInvalidNumbers,
  getMissingRequired,
  isFieldVisible,
  toRequestBody,
} from "@entities/reference";
import AtlsFieldInput from "./AtlsFieldInput";

type Props = {
  config: TAtlsReferenceConfig;
  /** Запись для изменения; без неё — создание новой */
  record?: TAtlsRecord;
  onClose: () => void;
};

const AtlsFormModal = ({ config, record, onClose }: Props) => {
  const { t } = useLocalization();
  const [values, setValues] = useState(() =>
    getInitialValues(config.fields, record),
  );
  const [addRecord, { isLoading: isAdding }] = useAddAtlsRecordMutation();
  const [editRecord, { isLoading: isEditing }] = useEditAtlsRecordMutation();
  const isSaving = isAdding || isEditing;

  // Поля с resetOn очищаются, когда меняется поле, от которого они зависят
  const setValue = (name: string, value: TAtlsFormValue) =>
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      config.fields.forEach((field) => {
        if (field.type === "reference" && field.resetOn === name) {
          next[field.name] = "";
        }
      });
      return next;
    });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const missing = getMissingRequired(config.fields, values, t);
    if (missing.length) {
      toast.warning(t("atls.common.fill_required", { fields: missing.join(", ") }));
      return;
    }
    const invalid = getInvalidNumbers(config.fields, values, t);
    if (invalid.length) {
      toast.warning(t("atls.common.invalid_number", { fields: invalid.join(", ") }));
      return;
    }

    const body = toRequestBody(config.fields, values);
    try {
      if (record) {
        await editRecord({ slug: config.slug, id: record.id, body }).unwrap();
        toast.success(t("atls.common.edited"));
      } else {
        await addRecord({ slug: config.slug, body }).unwrap();
        toast.success(t("atls.common.added"));
      }
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error), {
        style: { whiteSpace: "pre-line" },
      });
    }
  };

  return (
    <Modal isOpen onClose={onClose} className="max-w-[720px] m-4">
      <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
        <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {t(`atls.refs.${config.slug}`)}:{" "}
          {record ? t("atls.common.edit") : t("atls.common.create")}
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-h-[65vh] overflow-y-auto p-1">
            {config.fields
              .filter((field) => isFieldVisible(field, values))
              .map((field) => (
                <AtlsFieldInput
                  key={field.name}
                  field={field}
                  value={values[field.name]}
                  values={values}
                  onChange={(value) => setValue(field.name, value)}
                />
              ))}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              size="sm"
              variant="outline"
              onClick={(event) => {
                event.preventDefault();
                onClose();
              }}
            >
              {t("references.common.cancel")}
            </Button>
            <Button size="sm" disabled={isSaving}>
              {isSaving
                ? t("atls.common.saving")
                : t("references.common.save")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AtlsFormModal;
