import { Link } from "react-router";
import { useGetCompanyTypeQuery } from "../api/api";
import CompanyTypeForm from "../components/CompanyTypeForm";
import CompanyTypeTable from "../components/CompanyTypeTable";
import { ChevronRight } from "lucide-react";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const CompanyType = () => {
  const { error, isLoading } = useGetCompanyTypeQuery();
  const { t } = useLocalization();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <>
      <PageMeta title={t("references.company_types.title")} description="" />
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
            {t("references.company_types.title")}
          </>
        }
      />
      <ComponentCard title={t("references.company_types.title")}>
        <CompanyTypeForm />
        <CompanyTypeTable />
      </ComponentCard>
    </>
  );
};

export default CompanyType;
