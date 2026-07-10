import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Users, Truck, FileText, Phone } from "lucide-react";
import Contact from "./Contact/page/Contact";
import TransportEntrepreneur from "./TransportEntrepreneur/TransportEntrepreneur";
import Employess from "./Employee/Employees";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@components/ui/tab";
import { usePermissions } from "@permissions/usePermissions";
import { useLocalization } from "@hooks/useLocalization";
import DocumentEditEntrepreneur from "./DocumentEntrepreneur/page/DocumentEditEntrepreneur";

const tabMap: Record<string, number> = {
  employees: 0,
  transport: 1,
  documents: 2,
  contacts: 3,
};

const tabNames = Object.keys(tabMap);

const TabsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLocalization();

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
    name: "entrepreneur",
    path: "/api/v1/entrepreneur/{id}/individuals",
    method: "GET",
  });

  const canSeeTransports = hasPermission({
    name: "entrepreneur",
    path: "/api/v1/entrepreneur/{id}/transports",
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

  const hasAnyAccess =
    canSeeEmployees || canSeeTransports || canSeeDocuments || canSeeContacts;

  if (!hasAnyAccess) {
    return null;
  }

  return (
    <Tabs>
      <TabList>
        {canSeeEmployees && (
          <Tab
            isActive={activeTab === 0}
            onClick={() => handleTabChange(0)}
            icon={<Users size={18} />}
          >
            {t("subject.enter.tabspage.employees")}
          </Tab>
        )}
        {canSeeTransports && (
          <Tab
            isActive={activeTab === 1}
            onClick={() => handleTabChange(1)}
            icon={<Truck size={18} />}
          >
            {t("subject.enter.tabspage.transport")}
          </Tab>
        )}
        {canSeeDocuments && (
          <Tab
            isActive={activeTab === 2}
            onClick={() => handleTabChange(2)}
            icon={<FileText size={18} />}
          >
            {t("subject.enter.tabspage.documents")}
          </Tab>
        )}
        {canSeeContacts && (
          <Tab
            isActive={activeTab === 3}
            onClick={() => handleTabChange(3)}
            icon={<Phone size={18} />}
          >
            {t("subject.enter.tabspage.contacts")}
          </Tab>
        )}
      </TabList>

      <TabPanels>
        {activeTab === 0 && (
          <TabPanel>
            <Employess />
          </TabPanel>
        )}
        {activeTab === 1 && (
          <TabPanel>
            <TransportEntrepreneur />
          </TabPanel>
        )}
        {activeTab === 2 && (
          <TabPanel>
            <DocumentEditEntrepreneur />
          </TabPanel>
        )}
        {activeTab === 3 && (
          <TabPanel>
            <Contact />
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default TabsPage;
