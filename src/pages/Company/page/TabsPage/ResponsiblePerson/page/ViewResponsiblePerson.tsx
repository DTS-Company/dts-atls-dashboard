import ComponentCard from "@components/common/ComponentCard";
import ViewResponsiblePersonTable from "../components/ViewResponsiblePersonTable";
import { useLocalization } from "@hooks/useLocalization";

const ViewResponsiblePerson = () => {
  const { t } = useLocalization();
  return (
    <>
      <ComponentCard title={t("subject.company.responsible_person_table.responsible_person")}> 
        <ViewResponsiblePersonTable /> 
      </ComponentCard>    
    </>
  ); 
}; 

export default ViewResponsiblePerson; 
