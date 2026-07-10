import ComponentCard from "@components/common/ComponentCard";
import ViewBankDetailsTable from "../components/ViewBankDetailsTable";
import { useLocalization } from "@hooks/useLocalization";

const BankDetailsView = () => {
  const {t} = useLocalization()
  return (
    <>
      <ComponentCard title={t("subject.company.bank_details_table.title")}>
        <ViewBankDetailsTable />
      </ComponentCard>
    </>
  );
};

export default BankDetailsView;
