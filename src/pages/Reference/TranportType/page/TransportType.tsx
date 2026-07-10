import { Link } from "react-router";
import { useGetTransportTypeQuery } from "../api/api";
import TransportTypeForm from "../components/TransportTypeForm";
import TransportTypeTable from "../components/TransportTypeTable";
import { ChevronRight } from "lucide-react";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const TransportType = () => {
  const { error, isLoading } = useGetTransportTypeQuery();
  const {t} = useLocalization()

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <>
    <PageMeta title={t("references.transport_types.title")} description="" />
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
            {t("references.transport_types.title")}
          </>
        }
      />
      <ComponentCard title={t("references.transport_types.title")}>
        <TransportTypeForm />
        <TransportTypeTable />
      </ComponentCard>
    </>
  );
};

export default TransportType;
