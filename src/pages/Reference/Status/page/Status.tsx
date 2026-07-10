import { Link } from "react-router";
import { useGetStatusQuery } from "../api/api";
import StatusForm from "../components/StatusForm";
import StatusTable from "../components/StatusTable";
import { ChevronRight } from "lucide-react";
import ComponentCard from "@components/common/ComponentCard";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const Status = () => {
  const { error, isLoading } = useGetStatusQuery();
  const {t} = useLocalization()

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <>
    <PageMeta title={t("references.statuses.title")} description="" />
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
            {t("references.statuses.title")}
          </>
        }
      />
      <ComponentCard title={t("references.statuses.title")} >
        <StatusForm />
        <StatusTable />
      </ComponentCard>
    </>
  );
};

export default Status;
