import { useState } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";
import DocUploadPolicyTable from "../components/DocUploadPolicyTable";
import DocUploadPolicyForm from "../components/DocUploadPolicyForm";

const DocUploadPolicy = () => {
  const { t } = useLocalization();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <PageMeta
        title={t("references.doc_upload_policy.title")}
        description=""
      />
      <PageBreadcrumb
        pageTitle={
          <>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/references"
            >
              {t("references.title")}
              <ChevronRight size={18} />
            </Link>
            {t("references.doc_upload_policy.title")}
          </>
        }
      />

      <ComponentCard title={t("references.doc_upload_policy.title")}>
        <DocUploadPolicyForm onSuccess={handleFormSuccess} />
        <DocUploadPolicyTable key={refreshKey} />
      </ComponentCard>
    </>
  );
};

export default DocUploadPolicy;
