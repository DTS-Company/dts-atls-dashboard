import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Button from "@components/ui/button/Button";
import { Modal } from "@components/ui/modal";
import { useLocalization } from "@hooks/useLocalization";
import { useUpdateDocUploadPolicyMutation } from "../api/api";
import { toast } from "react-toastify";
import {
  USER_TYPE_OPTIONS,
  DOC_TYPE_OPTIONS,
  DOC_VIEW_OPTIONS,
  EXTERNAL_API_OPTIONS,
  REQUIREMENT_OPTIONS,
  type DocUploadPolicyFormData,
  type DocUploadPolicy,
} from "../types/docUploadPolicyConstants";

interface DocUploadPolicyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPolicy: DocUploadPolicy | null;
  onSuccess?: () => void;
}

const DocUploadPolicyEditModal = ({
  isOpen,
  onClose,
  editingPolicy,
  onSuccess,
}: DocUploadPolicyEditModalProps) => {
  const { t } = useLocalization();
  const [updateDocUploadPolicy, { isLoading }] =
    useUpdateDocUploadPolicyMutation();

  const [formData, setFormData] = useState<DocUploadPolicyFormData>({
    userType: "INDIVIDUAL",
    docType: "",
    docView: "NULL",
    externalApi: "ROHKHAT_API",
    requirement: "",
  });

  useEffect(() => {
    if (editingPolicy) {
      setFormData({
        userType: editingPolicy.userType || "INDIVIDUAL",
        docType: editingPolicy.docType || "",
        docView: editingPolicy.docView || "NULL",
        externalApi: editingPolicy.externalApi || "ROHKHAT_API",
        requirement: editingPolicy.requirement || "",
      });
    }
  }, [editingPolicy, isOpen]);

  const handleChange = (
    field: keyof DocUploadPolicyFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingPolicy?.id) return;

    try {
      const data: DocUploadPolicyFormData = {
        userType: formData.userType,
        docType: formData.docType,
        docView: formData.docView === "NULL" ? "NULL" : formData.docView,
        externalApi: formData.externalApi,
        requirement: formData.requirement,
      };

      await updateDocUploadPolicy({
        id: editingPolicy.id,
        data: data,
      }).unwrap();

      toast.success("Политика успешно обновлена");
      handleClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Ошибка обновления политики");
      console.error("Failed to update document policy:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      userType: "INDIVIDUAL",
      docType: "",
      docView: "NULL",
      externalApi: "ROHKHAT_API",
      requirement: "",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[500px]">
      <h4 className="mb-4 text-2xl dark:text-white font-semibold">
        Редактировать политику загрузки документов
      </h4>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <form className="flex flex-col-reverse gap-6" onSubmit={handleSubmit}>
          <div className="flex items-center justify-end mb-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="h-10 px-6"
              >
                {t("transport_table.modal.cancel")}
              </Button>
              <Button className="h-10 px-6" disabled={isLoading}>
                {isLoading
                  ? t("references.common.saving")
                  : t("subject.individual.document_modal.update")}
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-1 grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("references.doc_upload_policy.userType")}
              </label>
              <div className="relative">
                <select
                  value={formData.userType}
                  onChange={(e) => handleChange("userType", e.target.value)}
                  className="w-full h-10 px-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                >
                  {USER_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("references.doc_upload_policy.docType")}
              </label>
              <div className="relative">
                <select
                  value={formData.docType}
                  onChange={(e) => handleChange("docType", e.target.value)}
                  className="w-full h-10 px-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                >
                  {DOC_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("references.doc_upload_policy.docView")}
              </label>
              <div className="relative">
                <select
                  value={formData.docView}
                  onChange={(e) => handleChange("docView", e.target.value)}
                  className="w-full h-10 px-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                >
                  {DOC_VIEW_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("references.doc_upload_policy.externalApi")}
              </label>
              <div className="relative">
                <select
                  value={formData.externalApi}
                  onChange={(e) => handleChange("externalApi", e.target.value)}
                  className="w-full h-10 px-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                >
                  {EXTERNAL_API_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("references.doc_upload_policy.requirement")}
              </label>
              <div className="relative">
                <select
                  value={formData.requirement}
                  onChange={(e) => handleChange("requirement", e.target.value)}
                  className="w-full h-10 px-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                >
                  {REQUIREMENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DocUploadPolicyEditModal;
