import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileText, Phone, Truck } from "lucide-react";
import Contact from "./ContactIndividual/page/Contact";
import TransportIndividual from "./TransportIndividual/TransportIndividual";
import DocumentEditIndividual from "./DocumentIndividual/page/DocumentEditIndividual";
import { usePermissions } from "@permissions/usePermissions";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@components/ui/tab";
import { useLocalization } from "@hooks/useLocalization";

const tabMap: Record<string, number> = {
  contacts: 0,
  documents: 1,
  transport: 2,
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
  const canSeeContacts = hasPermission({
    name: "contact",
    path: "/api/v1/{entityId}/contact/",
    method: "GET",
  });

  const canSeeDocuments = hasPermission({
    name: "document",
    path: "/api/v1/{entityId}/document/doc-type/{docType}",
    method: "GET",
  });

  const canSeeTransport = hasPermission({
    name: "individual",
    path: "/api/v1/individual/{id}/transports",
    method: "GET",
  });
  const hasAnyAccess = canSeeContacts || canSeeDocuments || canSeeTransport;

  if (!hasAnyAccess) {
    return null;
  }

  return (
    <Tabs>
      <TabList>
        {canSeeContacts && (
          <Tab
            isActive={activeTab === 0}
            onClick={() => handleTabChange(0)}
            icon={<Phone size={18} />}
          >
            {t("subject.individual.tabspage.contacts")}
          </Tab>
        )}
        {canSeeDocuments && (
          <Tab
            isActive={activeTab === 1}
            onClick={() => handleTabChange(1)}
            icon={<FileText size={18} />}
          >
            {t("subject.individual.tabspage.documents")}
          </Tab>
        )}
        {canSeeTransport && (
          <Tab
            isActive={activeTab === 2}
            onClick={() => handleTabChange(2)}
            icon={<Truck size={18} />}
          >
            {t("subject.individual.tabspage.transport")}
          </Tab>
        )}
      </TabList>

      <TabPanels>
        {activeTab === 0 && (
          <TabPanel>
            <Contact />
          </TabPanel>
        )}
        {activeTab === 1 && (
          <TabPanel>
            <DocumentEditIndividual />
          </TabPanel>
        )}
        {activeTab === 2 && (
          <TabPanel>
            <TransportIndividual />
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default TabsPage;
