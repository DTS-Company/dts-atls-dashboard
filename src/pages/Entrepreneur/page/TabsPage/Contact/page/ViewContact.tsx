import ComponentCard from "@components/common/ComponentCard";
import ViewContactTable from "../components/ViewContactTable";
import { useLocalization } from "@hooks/useLocalization";

const ViewContact = () => {
  const { t } = useLocalization();

  return (
    <>
      <ComponentCard title={t("subject.individual.tabspage.contacts")}>
        <ViewContactTable />
      </ComponentCard>
    </>
  );
};

export default ViewContact;
