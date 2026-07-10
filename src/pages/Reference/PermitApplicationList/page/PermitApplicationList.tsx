import { Link } from "react-router";
import { useGetPermitApplicationListQuery } from "../api/api";
import { ChevronRight } from "lucide-react";
import PermitApplicationListTable from "../components/PermitApplicationListTable";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const PermitApplicationList = () => {
  const { error, isLoading } = useGetPermitApplicationListQuery();
  const { t } = useLocalization();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <>
    <PageMeta title={t("references.licences.title")} description="" />
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
            {t("references.licences.title")} 
          </>
        }
      />
      <ComponentCard title={t("references.licences.title")}>
        <PermitApplicationListTable />
      </ComponentCard>
    </>
  );
};

export default PermitApplicationList;
