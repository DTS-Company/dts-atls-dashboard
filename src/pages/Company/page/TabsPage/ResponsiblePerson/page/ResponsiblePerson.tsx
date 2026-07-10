import ComponentCard from "@components/common/ComponentCard";
import ResponsiblePersonForm from "../components/ResponsiblePersonForm";
import ResponsiblePersonTable from "../components/ResponsiblePersonTable";
import { useLocalization } from "@hooks/useLocalization";

const ResponsiblePerson = () => {
  const { t } = useLocalization();
  return (
    <>
      <ComponentCard title={t("subject.company.responsible_person_table.responsible_person")}>
        <ResponsiblePersonForm />
        <ResponsiblePersonTable />
      </ComponentCard>
    </>
  );
};

export default ResponsiblePerson;
