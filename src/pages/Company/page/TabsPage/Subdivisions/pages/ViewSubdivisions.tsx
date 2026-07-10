import ComponentCard from "@components/common/ComponentCard";
import ViewSubdivisionsTable from "../components/ViewSubdivisionsTable";
import { useLocalization } from "@hooks/useLocalization";

const ViewSubdivisions = () => {
  const {t} = useLocalization()
  return (
    <div> 
      <ComponentCard title={t("subject.company.subdivisions_table.title")}> 
        <ViewSubdivisionsTable />  
      </ComponentCard> 
    </div>
  );
};

export default ViewSubdivisions;
