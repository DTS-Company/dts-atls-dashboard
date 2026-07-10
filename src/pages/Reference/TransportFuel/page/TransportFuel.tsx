import { Link } from "react-router";
import { useGetTransportFuelQuery } from "../api/api";
import TransportFuelForm from "../components/TransportFuelForm";
import TransportFuelTable from "../components/TransportFuelTable";
import { ChevronRight } from "lucide-react";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const TransportFuel = () => {
  const { error, isLoading } = useGetTransportFuelQuery();
  const {t} = useLocalization()

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <>
      <PageMeta title={t("references.transport_fuel.title")} description="" />
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
            {t("references.transport_fuel.title")} 
          </>
        }
      />
      <ComponentCard title={t("references.transport_fuel.title")} >
        <TransportFuelForm />
        <TransportFuelTable />
      </ComponentCard>
    </>
  );
};

export default TransportFuel;
