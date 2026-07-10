import { Link } from "react-router";
import { useGetDistrictQuery } from "../api/api";
import DistrictForm from "../components/DistrictForm";
import DistrictTable from "../components/DistrictTable";
import { ChevronRight } from "lucide-react";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const District = () => {
  const { error, isLoading } = useGetDistrictQuery();
  const { t } = useLocalization();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <>
      <PageMeta title={t("references.districts.title")} description="" />
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
            {t("references.districts.title")}
          </>
        }
      />
      <ComponentCard title={t("references.districts.title")}>
        <DistrictForm />
        <DistrictTable />
      </ComponentCard>
    </>
  );
};

export default District;
