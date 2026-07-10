import { Link } from "react-router";
import { useGetCountryQuery } from "../api/api";
import CountryForm from "../components/CountryForm";
import CountryTable from "../components/CountryTable";
import { ChevronRight } from "lucide-react";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const Country = () => {
  const { error, isLoading } = useGetCountryQuery();
  const { t } = useLocalization();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <>
      <PageMeta title={t("references.countries.title")} description="" />
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
            {t("references.countries.title")}
          </>
        }
      />
      <ComponentCard title={t("references.countries.title")}>
        <CountryForm />
        <CountryTable />
      </ComponentCard>
    </>
  );
};

export default Country;
