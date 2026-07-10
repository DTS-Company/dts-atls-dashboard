import { Link } from "react-router";
import { useGetTransportBrandQuery } from "../api/api";
import TransportBrandForm from "../components/TransportBrandForm";
import TransportBrandTable from "../components/TransportBrandTable";
import { ChevronRight } from "lucide-react";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const TransportBrand = () => {
  const { error, isLoading } = useGetTransportBrandQuery();
  const {t} = useLocalization()

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <>
    <PageMeta title={t("references.transport_brands.title")} description="" />
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
            {t("references.transport_brands.title")}
          </>
        }
      />
      <ComponentCard title={t("references.transport_brands.title")} >
        <TransportBrandForm />
        <TransportBrandTable />
      </ComponentCard>
    </>
  );
};

export default TransportBrand;
