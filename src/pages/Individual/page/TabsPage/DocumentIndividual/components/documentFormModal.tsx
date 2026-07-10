import { ChangeEvent, useEffect, useState } from "react";
import {
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
} from "../api/api";
import Button from "@components/ui/button/Button";
import { Modal } from "@components/ui/modal";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import { useUploadFileMutation } from "@pages/Reference/Storage/reducers/files";
import { useGetDocumentTypeQuery } from "@pages/Reference/DocumentType/api/api";
import { validateFileSize } from "@utils/AddDocumentValidation";
import { toast } from "react-toastify";
import { skipToken } from "@reduxjs/toolkit/query";
import { useLocalization } from "@hooks/useLocalization";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "@apiConfig";
import { getAccessToken } from "@auth";
interface DocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  entityType: string;
  documentType: string;
  editingDocument?: any;
}

interface DocumentType {
  id: string;
  name: string;
  userType: string[];
  docType: string;
  docView: string | null;
  descriptionLabel: string | null;
  descriptionValues: string | null;
}

interface FormData {
  identificationNumber: string;
  typeId: string;
  documentDate: string;
  documentDateEnd: string;
  documentLink: string;
  issuingAuthority: string;
  documentStatus: string;
  descriptionValues?: string;
}

// http://localhost:8089/registeredIndividuals/INDIVIDUAL/edit/4d8b7233-0359-4d1d-9853-1b982cf6ebd9/documents/storage/read/4d8b7233-0359-4d1d-9853-1b982cf6ebd9/2026-05-09_09-33-39.pdf
// http://10.10.25.239:8088/api/v1/storage/read/4d8b7233-0359-4d1d-9853-1b982cf6ebd9/2026-05-09_09-33-39.pdf?token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5Mzk4ODEwODAiLCJpYXQiOjE3NzgzMTc2NDIsImV4cCI6MTc3ODQwNDA0Mn0.P94kt-HVfGFL7St5rTojkWS7f6t9cUh7_3MOjvISOvw

const DocumentFormModal = ({
  isOpen,
  onClose,
  entityId,
  entityType,
  documentType,
  editingDocument,
}: DocumentFormModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    identificationNumber: "",
    typeId: "",
    documentDate: "",
    documentDateEnd: "",
    documentLink: "",
    issuingAuthority: "",
    documentStatus: "ACCEPTED",
    descriptionValues: "",
  });

  const [selectedDocumentType, setSelectedDocumentType] =
    useState<DocumentType | null>(null);
  const [descriptionOptions, setDescriptionOptions] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useLocalization();
  const [isFileLoading, _setIsFileLoading] = useState(false);

  const [uploadFile] = useUploadFileMutation();
  const [addDocument] = useCreateDocumentMutation();
  const [updateDocument] = useUpdateDocumentMutation();

  const { data: documentTypes } = useGetDocumentTypeQuery(
    documentType && entityType
      ? { doctype: documentType, userType: entityType }
      : skipToken,
  );

  const isEditing = !!editingDocument;

  const isValidDateRange = (date: string) => {
    const year = new Date(date).getFullYear();
    return year >= 1900 && year <= 2100;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.identificationNumber)
      newErrors.identificationNumber = "Введите номер документа";

    if (!formData.documentDate) {
      newErrors.documentDate = "Выберите дату выдачи";
    } else if (!isValidDateRange(formData.documentDate)) {
      newErrors.documentDate = "Недопустимый год";
    }

    if (!formData.documentDateEnd) {
      newErrors.documentDateEnd = "Выберите дату окончания";
    } else if (!isValidDateRange(formData.documentDateEnd)) {
      newErrors.documentDateEnd = "Недопустимый год";
    }
    if (
      formData.documentDate &&
      formData.documentDateEnd &&
      formData.documentDateEnd < formData.documentDate
    )
      newErrors.documentDateEnd =
        "Дата окончания не может быть раньше даты выдачи";

    if (!formData.typeId) newErrors.typeId = "Выберите тип документа";

    if (!formData.issuingAuthority)
      newErrors.issuingAuthority = "Введите выдающий орган";

    if (!formData.documentLink)
      newErrors.documentLink = "Загрузите файл документа";

    if (
      selectedDocumentType?.descriptionValues &&
      !formData.descriptionValues
    ) {
      newErrors.descriptionValues = "Выберите значение";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (editingDocument) {
      setFormData({
        identificationNumber: editingDocument.identificationNumber || "",
        typeId: editingDocument.type?.id || "",
        documentDate: editingDocument.documentDate || "",
        documentDateEnd: editingDocument.documentDateEnd || "",
        documentLink: editingDocument.documentLink || "",
        issuingAuthority: editingDocument.issuingAuthority || "",
        documentStatus: editingDocument.checkStatus || "ACCEPTED",
        descriptionValues: editingDocument.descriptionValues || "",
      });

      if (editingDocument.type?.id && documentTypes) {
        const docType = documentTypes.find(
          (doc) => doc.id === editingDocument.type.id,
        );
        if (docType) {
          setSelectedDocumentType(docType);
          if (docType.descriptionValues) {
            setDescriptionOptions(
              docType.descriptionValues.split(",").map((item) => item.trim()),
            );
          }
        }
      }

      setErrors({});
    } else {
      resetForm();
    }
  }, [editingDocument, documentTypes]);

  useEffect(() => {
    if (selectedDocumentType) {
      if (selectedDocumentType.descriptionValues) {
        setDescriptionOptions(
          selectedDocumentType.descriptionValues
            .split(",")
            .map((item) => item.trim()),
        );
      } else {
        setDescriptionOptions([]);
      }

      if (!selectedDocumentType.descriptionValues) {
        setFormData((prev) => ({
          ...prev,
          descriptionValues: "",
        }));
      }
    }
  }, [selectedDocumentType]);

  const resetForm = () => {
    setFormData({
      identificationNumber: "",
      typeId: "",
      documentDate: "",
      documentDateEnd: "",
      documentLink: "",
      issuingAuthority: "",
      documentStatus: "ACCEPTED",
      descriptionValues: "",
    });
    setSelectedDocumentType(null);
    setDescriptionOptions([]);
    setErrors({});
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleDocumentTypeChange = (typeId: string) => {
    handleInputChange("typeId", typeId);

    const selectedType =
      documentTypes?.find((doc) => doc.id === typeId) || null;
    setSelectedDocumentType(selectedType);

    if (formData.descriptionValues) {
      handleInputChange("descriptionValues", "");
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.descriptionValues;
      return newErrors;
    });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const validation = validateFileSize(file);

    if (!validation.valid) {
      setErrors((prev) => ({ ...prev, documentLink: validation.message! }));
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadFile({ entityId, file }).unwrap();
      setFormData((prev) => ({ ...prev, documentLink: result.url }));
      setErrors((prev) => ({ ...prev, documentLink: "" }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        documentLink: "Ошибка при загрузке файла",
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload: any = {
        identificationNumber: formData.identificationNumber,
        typeId: formData.typeId,
        documentDate: formData.documentDate,
        documentDateEnd: formData.documentDateEnd,
        documentLink: formData.documentLink,
        issuingAuthority: formData.issuingAuthority,
        checkStatus:
          formData.documentStatus === "ACCEPTED"
            ? "ACCEPTED"
            : formData.documentStatus === "REJECTED"
              ? "REJECTED"
              : undefined,
      };

      if (formData.descriptionValues) {
        payload.descriptionValues = formData.descriptionValues;
      }

      if (isEditing) {
        await updateDocument({
          entityId,
          id: editingDocument.id,
          data: payload,
        }).unwrap();

        toast.success("Документ успешно обновлен!");
      } else {
        await addDocument({
          entityId,
          data: payload,
        }).unwrap();

        toast.success("Документ успешно добавлен!");
      }
      setTimeout(() => {
        resetForm();
        onClose();
      }, 300);
    } catch (error) {
      console.error("Ошибка сохранения документа:", error);
      toast.error("Ошибка при сохранении документа");
    } finally {
      setIsSubmitting(false);
    }
  };
  
const handleOpenFile = (link: string) => {
  const filename = link.split("/").pop();
  const token = getAccessToken();
  const fullUrl = `${API_BASE_URL}storage/read/${entityId}/${filename}?token=${token}`;
  window.open(fullUrl, "_blank");
};

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px]">
      <div className="p-6 bg-white rounded-3xl dark:bg-gray-900 dark:text-white">
        <h4 className="mb-4 text-2xl font-semibold">
          {isEditing
            ? t("subject.individual.document_modal.edit_title")
            : t("subject.individual.document_modal.add_title")}
        </h4>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div>
            {t("subject.individual.document_form.doc_num")}
            <Input
              type="text"
              value={formData.identificationNumber}
              onChange={(e) =>
                handleInputChange("identificationNumber", e.target.value)
              }
              className={errors.identificationNumber && "border-red-500"}
              disabled={isSubmitting}
            />
            {errors.identificationNumber && (
              <p className="mt-1 text-sm text-red-500">
                {errors.identificationNumber}
              </p>
            )}
          </div>

          <div>
            {t("subject.individual.document_form.given")}
            <Input
              type="date"
              value={formData.documentDate}
              onChange={(e) =>
                handleInputChange("documentDate", e.target.value)
              }
              className={errors.documentDate && "border-red-500"}
              disabled={isSubmitting}
            />
            {errors.documentDate && (
              <p className="mt-1 text-sm text-red-500">{errors.documentDate}</p>
            )}
          </div>

          <div>
            {t("subject.individual.document_form.doc_date_end")}
            <Input
              type="date"
              value={formData.documentDateEnd}
              onChange={(e) =>
                handleInputChange("documentDateEnd", e.target.value)
              }
              className={errors.documentDateEnd && "border-red-500"}
              disabled={isSubmitting}
            />
            {errors.documentDateEnd && (
              <p className="mt-1 text-sm text-red-500">
                {errors.documentDateEnd}
              </p>
            )}
          </div>

          <div>
            {t("subject.individual.document_form.doc_type")}
            <select
              value={formData.typeId}
              onChange={(e) => handleDocumentTypeChange(e.target.value)}
              className={`h-11 w-full rounded-lg border px-4 py-2 ${
                errors.typeId ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            >
              <option value="">
                {t("subject.individual.document_modal.choose_doc_type")}
              </option>
              {documentTypes?.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
            {errors.typeId && (
              <p className="mt-1 text-sm text-red-500">{errors.typeId}</p>
            )}
          </div>

          {selectedDocumentType?.descriptionValues &&
            descriptionOptions.length > 0 && (
              <div>
                <Label>
                  {selectedDocumentType.descriptionLabel ||
                    "Выберите категорию"}
                </Label>
                <select
                  value={formData.descriptionValues || ""}
                  onChange={(e) =>
                    handleInputChange("descriptionValues", e.target.value)
                  }
                  className={`h-11 w-full rounded-lg border px-4 py-2 ${
                    errors.descriptionValues
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Выберите значение</option>
                  {descriptionOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.descriptionValues && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.descriptionValues}
                  </p>
                )}
              </div>
            )}

          <div>
            <Label>
              {t("subject.individual.document_modal.issuing_authority")}
            </Label>
            <Input
              type="text"
              value={formData.issuingAuthority}
              onChange={(e) =>
                handleInputChange("issuingAuthority", e.target.value)
              }
              className={errors.issuingAuthority && "border-red-500"}
              disabled={isSubmitting}
            />
            {errors.issuingAuthority && (
              <p className="mt-1 text-sm text-red-500">
                {errors.issuingAuthority}
              </p>
            )}
          </div>

          <div>
            <Label>{t("subject.individual.document_modal.doc_status")}</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="ACCEPTED"
                  checked={formData.documentStatus === "ACCEPTED"}
                  onChange={(e) =>
                    handleInputChange("documentStatus", e.target.value)
                  }
                  disabled={!isEditing || isSubmitting}
                  className="w-4 h-4 border-gray-300 text-brand-600 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-white/90">
                  {t("subject.individual.document_modal.accept")}
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="REJECTED"
                  checked={formData.documentStatus === "REJECTED"}
                  onChange={(e) =>
                    handleInputChange("documentStatus", e.target.value)
                  }
                  disabled={!isEditing || isSubmitting}
                  className="w-4 h-4 border-gray-300 text-brand-600 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-white/90">
                  {t("subject.individual.document_modal.reject")}
                </span>
              </label>
            </div>
          </div>

          <div>
            <Label>{t("subject.individual.document_modal.attache_file")}</Label>

            <input
              type="file"
              className={`border p-2 rounded-md w-full ${
                errors.documentLink ? "border-red-500" : "border-gray-300"
              }`}
              onChange={handleFileChange}
              disabled={isUploading || isSubmitting}
            />

            {errors.documentLink && (
              <p className="mt-1 text-sm text-red-500">{errors.documentLink}</p>
            )}

            {formData.documentLink && !isUploading && (
              <p className="mt-2 text-blue-500 underline cursor-pointer">
                <span onClick={() => handleOpenFile(formData.documentLink)}>
                  {isFileLoading ? (
                    <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {formData.documentLink.split("/").pop()}
                </span>
              </p>
            )}

            {isUploading && (
              <p className="flex items-center gap-2 mt-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Загрузка файла...
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              {t("subject.individual.document_modal.cancel")}
            </Button>
            <Button disabled={isUploading || isSubmitting} className="relative">
              {isSubmitting && (
                <Loader2 className="absolute w-4 h-4 mr-2 animate-spin left-4" />
              )}
              <span className={isSubmitting ? "ml-6" : ""}>
                {isEditing
                  ? t("subject.individual.document_modal.update")
                  : t("subject.individual.document_modal.save")}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DocumentFormModal;
