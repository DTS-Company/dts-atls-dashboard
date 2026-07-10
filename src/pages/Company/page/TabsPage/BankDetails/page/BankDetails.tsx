import ComponentCard from "@components/common/ComponentCard";
import BankDetailsForm from "../components/BankDetailsForm";
import BankDetailsTable from "../components/BankDetailsTable";
import { useLocalization } from "@hooks/useLocalization";

const BankDetails = () => {
  const {t} = useLocalization()
  return (
    <>
      <ComponentCard title={t("subject.company.bank_details_table.title")}>
        <BankDetailsForm />
        <BankDetailsTable />
      </ComponentCard>
    </>
  );
};

export default BankDetails;