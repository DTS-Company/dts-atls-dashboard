import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@components/ui/tab";
import { usePermissions } from "@permissions/usePermissions";
import { useLocalization } from "@hooks/useLocalization";

import DocumentTransport from "./DocumentTransport/page/DocumentTransport";

const tabMap: Record<string, number> = {
  documents: 0,
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

  const canSeeDocuments = hasPermission({
    name: "document",
    path: "/api/v1/{entityId}/document/doc-type/{docType}",
    method: "GET",
  });

  const hasAnyAccess = canSeeDocuments;

  if (!hasAnyAccess) {
    return null;
  }

  return (
    <Tabs>
      <TabList>
        {canSeeDocuments && (
          <Tab
            isActive={activeTab === 0}
            onClick={() => handleTabChange(0)}
            icon={<FileText size={18} />}
          >
            {t("subject.company.tabspage.documents")}
          </Tab>
        )}
      </TabList>

      <TabPanels>
        {activeTab === 0 && (
          <TabPanel>
            <DocumentTransport />
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default TabsPage;
