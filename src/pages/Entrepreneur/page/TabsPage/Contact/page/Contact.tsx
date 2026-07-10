import ComponentCard from "@components/common/ComponentCard";
import ContactForm from "../components/ContactForm";
import ContactTable from "../components/ContactTable";
import { useLocalization } from "@hooks/useLocalization";

const Contact = () => {
    const {t} = useLocalization();
  
  return (
    <>
      <ComponentCard title={t("subject.individual.tabspage.contacts")}>
           <ContactForm />
           <ContactTable />
         </ComponentCard>
    </>
  );
};

export default Contact;
