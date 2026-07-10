import { Link } from "react-router";
import { useGetTransportOwnerTypeQuery } from "../api/api";
import TransportOwnerTypeForm from "../components/TransportOwnerTypeForm";
import TransportOwnerTypeTable from "../components/TransportOwnerTypeTable";
import { ChevronRight } from "lucide-react";
import ComponentCard from "@components/common/ComponentCard";
import PageBreadcrumb from "@pages/Individual/components/PageBreadCrumb";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const TransportOwnerType = () => {
  const { error, isLoading } = useGetTransportOwnerTypeQuery();
  const { t } = useLocalization();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <>
      <PageMeta title={t("references.transport_owner_type.title")} description="" />
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
            {t("references.transport_owner_type.title")}
          </>
        }
      />
      <ComponentCard title={t("references.transport_owner_type.title")}>
        <TransportOwnerTypeForm />
        <TransportOwnerTypeTable />
      </ComponentCard>
    </>
  );
};

export default TransportOwnerType;
