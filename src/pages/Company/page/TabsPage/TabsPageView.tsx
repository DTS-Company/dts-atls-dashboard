import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Users,
  Truck,
  FileText,
  Phone,
  CreditCard,
  UserCheck,
  Building2,
} from "lucide-react";
import ViewResponsiblePerson from "./ResponsiblePerson/page/ViewResponsiblePerson";
import ViewTransportCompany from "./TransportCompany/ViewTransportCompany";
import ViewContact from "./ContactCompany/page/ViewContact";
import ViewBankDetailsTable from "./BankDetails/components/ViewBankDetailsTable";
import DocumentViewCompany from "./DocumentCompany/page/DocumentViewCompany";
import EmployessView from "./Employee/EmployeesView";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@components/ui/tab";
import { usePermissions } from "@permissions/usePermissions";
import { useLocalization } from "@hooks/useLocalization";
import ViewSubdivisions from "./Subdivisions/pages/ViewSubdivisions";
import { useGetCompanyByIdQuery } from "@pages/Company/api/api";

const tabMap: Record<string, number> = {
  employees: 0,
  transport: 1,
  documents: 2,
  contacts: 3,
  bank: 4,
  responsible: 5,
  subdivisions: 6,
};

const tabNames = Object.keys(tabMap);

const TabsPageView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLocalization();
  const { id } = useParams<{ id: string }>();

  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get("tabs");
  const initialTab =
    tabParam && tabMap[tabParam] !== undefined ? tabMap[tabParam] : 0;

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const currentTab = new URLSearchParams(location.search).get("tabs");
    if (currentTab && tabMap[currentTab] !== undefined) {
      setActiveTab(tabMap[currentTab]);
    }
  }, [location.search]);

  const handleTabChange = (index: number) => {
    const tabKey = tabNames[index];
    navigate(`?tabs=${tabKey}`);
    setActiveTab(index);
  };

  const { hasPermission } = usePermissions();
  const canSeeEmployees = hasPermission({
    name: "company",
    path: "/api/v1/company/{id}/individuals",
    method: "GET",
  });

  const canSeeTransport = hasPermission({
    name: "company",
    path: "/api/v1/company/{id}/transports",
    method: "GET",
  });

  const canSeeDocuments = hasPermission({
    name: "document",
    path: "/api/v1/{entityId}/document/doc-type/{docType}",
    method: "GET",
  });

  const canSeeContacts = hasPermission({
    name: "contact",
    path: "/api/v1/{entityId}/contact/{id}",
    method: "GET",
  });

  const canSeeBankDetails = hasPermission({
    name: "bankdetails",
    path: "/api/v1/{entityId}/bank-details/{id}",
    method: "GET",
  });

  const canSeeResponsiblePerson = hasPermission({
    name: "responsibleperson",
    path: "/api/v1/{entityId}/responsibleperson/",
    method: "GET",
  });

  const { data: companyResponse } = useGetCompanyByIdQuery(id ?? "", {
    skip: !id,
  });

  const showSubdivisions =
    companyResponse?.content?.parentID === null ||
    companyResponse?.content?.parentID === undefined;

  return (
    <Tabs>
      <TabList>
        {canSeeEmployees && (
          <Tab
            isActive={activeTab === 0}
            onClick={() => handleTabChange(0)}
            icon={<Users size={18} />}
          >
            {t("subject.company.tabspage.employees")}
          </Tab>
        )}
        {canSeeTransport && (
          <Tab
            isActive={activeTab === 1}
            onClick={() => handleTabChange(1)}
            icon={<Truck size={18} />}
          >
            {t("subject.company.tabspage.transport")}
          </Tab>
        )}
        {canSeeDocuments && (
          <Tab
            isActive={activeTab === 2}
            onClick={() => handleTabChange(2)}
            icon={<FileText size={18} />}
          >
            {t("subject.company.tabspage.documents")}
          </Tab>
        )}
        {canSeeContacts && (
          <Tab
            isActive={activeTab === 3}
            onClick={() => handleTabChange(3)}
            icon={<Phone size={18} />}
          >
            {t("subject.company.tabspage.contacts")}
          </Tab>
        )}
        {canSeeBankDetails && (
          <Tab
            isActive={activeTab === 4}
            onClick={() => handleTabChange(4)}
            icon={<CreditCard size={18} />}
          >
            {t("subject.company.tabspage.bank_details")}
          </Tab>
        )}
        {canSeeResponsiblePerson && (
          <Tab
            isActive={activeTab === 5}
            onClick={() => handleTabChange(5)}
            icon={<UserCheck size={18} />}
          >
            {t("subject.company.tabspage.responsible_person")}
          </Tab>
        )}
        {showSubdivisions && (
          <Tab
            isActive={activeTab === 6}
            onClick={() => handleTabChange(6)}
            icon={<Building2 size={18} />}
          >
            {t("subject.company.tabspage.subdivisions")}
          </Tab>
        )}
      </TabList>
      <TabPanels>
        {activeTab === 0 && (
          <TabPanel>
            <EmployessView />
          </TabPanel>
        )}
        {activeTab === 1 && (
          <TabPanel>
            <ViewTransportCompany />
          </TabPanel>
        )}
        {activeTab === 2 && (
          <TabPanel>
            <DocumentViewCompany />
          </TabPanel>
        )}
        {activeTab === 3 && (
          <TabPanel>
            <ViewContact />
          </TabPanel>
        )}
        {activeTab === 4 && (
          <TabPanel>
            <ViewBankDetailsTable />
          </TabPanel>
        )}
        {activeTab === 5 && (
          <TabPanel>
            <ViewResponsiblePerson />
          </TabPanel>
        )}
        {showSubdivisions && activeTab === 6 && (
          <TabPanel>
            <ViewSubdivisions />
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default TabsPageView;
