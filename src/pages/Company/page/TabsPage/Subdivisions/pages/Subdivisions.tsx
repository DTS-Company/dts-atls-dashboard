import ComponentCard from "@components/common/ComponentCard";
import SubdivisionsForm from "../components/SubdivisionsForm";
import ViewSubdivisionsTable from "../components/ViewSubdivisionsTable";
import { useLocalization } from "@hooks/useLocalization";

const Subdivisions = () => {
  const { t } = useLocalization();
  return (
    <div>
      <ComponentCard title={t("subject.company.subdivisions_table.title")}>
        <SubdivisionsForm />
        <ViewSubdivisionsTable />
      </ComponentCard>
    </div>
  );
};

export default Subdivisions;
