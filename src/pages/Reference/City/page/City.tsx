import { Link } from "react-router";
import { useGetCityQuery } from "../api/api";
import CityForm from "../components/CityForm";
import CityTable from "../components/CityTable";
import { ChevronRight } from "lucide-react";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const City = () => {
  const { error, isLoading } = useGetCityQuery();
  const { t } = useLocalization();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <>
      <PageMeta title={t("references.cities.title")} description="" />
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
            {t("references.cities.title")}
          </>
        }
      />
      <ComponentCard title={t("references.cities.title")}>
        <CityForm />
        <CityTable />
      </ComponentCard>
    </>
  );
};

export default City;
