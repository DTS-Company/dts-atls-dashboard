import { useState } from "react";
import { Building2, ChevronDown } from "lucide-react";
import Button from "@components/ui/button/Button";
import { Modal } from "@components/ui/modal";
import { useLocalization } from "@hooks/useLocalization";
import { useCreateDocUploadPolicyMutation } from "../api/api";
import { toast } from "react-toastify";
import {
  USER_TYPE_OPTIONS,
  DOC_TYPE_OPTIONS,
  DOC_VIEW_OPTIONS,
  EXTERNAL_API_OPTIONS,
  REQUIREMENT_OPTIONS,
  INITIAL_FORM_STATE,
  type DocUploadPolicyFormData,
} from "../types/docUploadPolicyConstants";

const DocUploadPolicyForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { t } = useLocalization();
  const [createDocUploadPolicy, { isLoading }] =
    useCreateDocUploadPolicyMutation();

  const [formData, setFormData] =
    useState<DocUploadPolicyFormData>(INITIAL_FORM_STATE);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (
    field: keyof DocUploadPolicyFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        userType: formData.userType,
        docType: formData.docType || undefined,
        docView: formData.docView === "NULL" ? "NULL" : formData.docView,
        externalApi: formData.externalApi,
        requirement: formData.requirement || undefined,
      };

      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined),
      );

      await createDocUploadPolicy(cleanData).unwrap();
      toast.success(t("references.common.created_success"));
      setFormData(INITIAL_FORM_STATE);
      setIsModalOpen(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(t("references.common.create_error"));
      console.error("Failed to create document policy:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setFormData(INITIAL_FORM_STATE);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-4 h-12 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md dark:bg-gray-700">
            <Building2 className="text-gray-800 size-5 dark:text-white/90" />
          </div>
          <div className="text-start flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("references.doc_upload_policy.all")}
            </span>
            <h4 className="font-bold text-gray-800 text-lg dark:text-white/90">
              23
            </h4>
          </div>
        </div>
        <Button
          onClick={handleOpenModal}
          className="h-10 px-6 flex items-center gap-2"
        >
          {t("transport_table.add_new")}
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        className="max-w-[550px]"
      >
        <h4 className="mb-4 text-2xl dark:text-white font-semibold">
          Добавить новую политику загрузки документов
        </h4>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <form className="flex flex-col-reverse gap-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-end mb-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  className="h-10 px-6"
                >
                  {t("transport_table.modal.cancel")}
                </Button>
                <Button className="h-10 px-6" disabled={isLoading}>
                  {isLoading ? t("common.saving") : t("references.common.save")}
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
                    onChange={(e) =>
                      handleChange("externalApi", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleChange("requirement", e.target.value)
                    }
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
    </>
  );
};

export default DocUploadPolicyForm;
