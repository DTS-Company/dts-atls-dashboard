import { Link } from "react-router";
import ComponentCard from "../../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import { useGetPropertyQuery } from "../api/api";
import PropertyForm from "../components/PropertyForm";
import PropertyTable from "../components/PropertyTable";
import { ChevronRight } from "lucide-react";

const Property = () => {
  const { error, isLoading } = useGetPropertyQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <>
      <PageBreadcrumb
        pageTitle={
          <>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/references"
            >
              Справочники
              <ChevronRight size={18} />
            </Link>
            Имущество
          </>
        }
      />
      <ComponentCard title="Имущество">
        <PropertyForm />
        <PropertyTable />
      </ComponentCard>
    </>
  );
};

export default Property;
