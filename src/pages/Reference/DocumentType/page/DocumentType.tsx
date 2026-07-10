import { skipToken } from "@reduxjs/toolkit/query";
import { useGetDocumentTypeQuery } from "../api/api";
import DocumentTypeForm from "../components/DocumentTypeForm";
import DocumentTypeTable from "../components/DocumentTypeTable";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const DocumentType = () => {
  const { error, isLoading } = useGetDocumentTypeQuery(skipToken);
  const { t } = useLocalization();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <>
      <PageMeta title={t("references.document_types.title")} description="" />
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
            {t("references.document_types.title")}
          </>
        }
      />
      <ComponentCard title={t("references.document_types.title")}>
        <DocumentTypeForm />
        <DocumentTypeTable />
      </ComponentCard>
    </>
  );
};

export default DocumentType;
