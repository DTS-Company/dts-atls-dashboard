import { API_BASE_URL_REG } from "@apiConfig";
import { clearTokens, hasTokens, setTokens } from "@auth";
import UnderDevelopment from "@components/common/UnderDevelopment";
import AppLayout from "@layout/AppLayout";
import CompanyForm from "@pages/Company/page/CompanyForm";
import EditCompany from "@pages/Company/page/EditCompany";
import RegisteredComapanies from "@pages/Company/page/RegisteredComapanies";
import DocumentTableEditCompany from "@pages/Company/page/TabsPage/DocumentCompany/page/DocumentTableEditCompany";
import DocumentTableViewCompany from "@pages/Company/page/TabsPage/DocumentCompany/page/DocumentTableViewCompany";
import Employess from "@pages/Company/page/TabsPage/Employee/Employees";
import EmployessTableView from "@pages/Company/page/TabsPage/Employee/EmployeesTableView";
import EmployessForm from "@pages/Company/page/TabsPage/Employee/EmployessForm";
import ViewCompany from "@pages/Company/page/ViewCompany";
import Ecommerce from "@pages/Dashboard/ECommerce";
import CompanyDocs from "@pages/Documents/Company/page/CompanyDocs";
import EntrepreneurDocs from "@pages/Documents/Entrepreneur/page/EntrepreneurDocs";
import IndividualDocs from "@pages/Documents/Individual/page/IndividualDocs";
import TransportDocs from "@pages/Documents/Transport/page/TransportDocs";
import EditEntrepreneur from "@pages/Entrepreneur/page/EditEntrepreneur";
import EntrepreneurForm from "@pages/Entrepreneur/page/EntrepreneurForm";
import RegisteredEntrepreneur from "@pages/Entrepreneur/page/RegisteredEntrepreneur";
import DocumentTableEditEntrepreneur from "@pages/Entrepreneur/page/TabsPage/DocumentEntrepreneur/page/DocumentTableEditEntrepreneur";
import DocumentTableViewEntrepreneur from "@pages/Entrepreneur/page/TabsPage/DocumentEntrepreneur/page/DocumentTableViewEntrepreneur";
import ViewEntrepreneur from "@pages/Entrepreneur/page/ViewEntrepreneur";
import EditIndividual from "@pages/Individual/page/EditIndividual";
import IndividualForm from "@pages/Individual/page/IndividualForm";
import RegisteredIndividuals from "@pages/Individual/page/RegisteredIndividuals";
import DocumentTableEditIndividual from "@pages/Individual/page/TabsPage/DocumentIndividual/page/DocumentTableEditIndividual";
import DocumentTableViewIndividual from "@pages/Individual/page/TabsPage/DocumentIndividual/page/DocumentTableViewIndividual";
import ViewIndividual from "@pages/Individual/page/ViewIndividual";
import Integrations from "@pages/Integrations/pages/Integrations";
import Certification from "@pages/ITS/Certification/page/Certification";
import ECMR from "@pages/ITS/ECMR/page/ECMR";
import ETIR from "@pages/ITS/ETIR/page/ETIR";
import ETTN from "@pages/ITS/ETTN/page/ETTN";
import GpsGlonass from "@pages/ITS/GpsGlonass/page/GpsGlonass";
import LicenceList from "@pages/ITS/Licensing/page/Licence";
import LicensingEntity from "@pages/ITS/Licensing/page/LicensingEntity";
import LicensingMain from "@pages/ITS/Licensing/page/LicensingMain";
import Licensing from "@pages/ITS/Licensing/page/LicensingMain";
import AddPermits from "@pages/ITS/Permits/page/AddPermits";
import Permits from "@pages/ITS/Permits/page/Permits";
import SpecialPermits from "@pages/ITS/SpecialPermits/page/SpecialPermits";
import Tachograph from "@pages/ITS/Tachograph/page/Tachograph";
import Waybill from "@pages/ITS/Waybill/page/Waybill";
import NotFound from "@pages/OtherPage/NotFound";
import CompanyPermitApplicationView from "@pages/PermitApplication/page/CompanyPermitApplication/CompanyPermitApplicationView";
import Dozvol from "@pages/PermitApplication/page/Dozvol/page/Dozvol";
import DozvolBlankStats from "@pages/PermitApplication/page/Dozvol/page/DozvolBlankStats";
import DozvolTable from "@pages/PermitApplication/page/Dozvol/page/DozvolTable";
import DozvolViewPage from "@pages/PermitApplication/page/Dozvol/page/DozvolViewPage";
import EntrepreneurPermitApplication from "@pages/PermitApplication/page/EntrepreneurPermitApplication/EntrepreneurPermitApplication";
import PermitApplicationCompany from "@pages/PermitApplication/page/PermitApplicationCompany";
import PermitApplicationEntrepreneur from "@pages/PermitApplication/page/PermitApplicationEntrepreneur";
import City from "@pages/Reference/City/page/City";
import CompanyType from "@pages/Reference/CompanyType/page/CompanyType";
import Country from "@pages/Reference/Country/page/Country";
import District from "@pages/Reference/District/page/District";
import DocumentType from "@pages/Reference/DocumentType/page/DocumentType";
import DocUploadPolicy from "@pages/Reference/DocUploadPolicy/page/DocUploadPolicy";
import PermitApplicationList from "@pages/Reference/PermitApplicationList/page/PermitApplicationList";
import ReferencePage from "@pages/Reference/ReferencePage";
import Status from "@pages/Reference/Status/page/Status";
import TransportType from "@pages/Reference/TranportType/page/TransportType";
import TransportBrand from "@pages/Reference/TransportBrand/page/TransportBrand";
import TransportFuel from "@pages/Reference/TransportFuel/page/TransportFuel";
import TransportOwnerShip from "@pages/Reference/TransportOwnerShip/page/TransportOwnerShip";
import TransportOwnerType from "@pages/Reference/TransportOwnerType/page/TransportOwnerType";
import TransportView from "@pages/Reference/TransportView/page/TransportView";
import CompanyReports from "@pages/Reports/Company/page/CompanyReports";
import EntrepreneurReports from "@pages/Reports/Entrepreneur/page/EntrepreneurReports";
import { IndividualReports } from "@pages/Reports/Individual/page/IndividualReports";
import TrafficIntensity from "@pages/Reports/TrafficIntensity/page/TrafficIntensity";
import IndividualTemporary from "@pages/SubCheck/Individual/page/IndividualTemporary";
import TransportTemporary from "@pages/SubCheck/Transport/page/TransportTemporary";
import BridgeManagement from "@pages/SUDA/BridgeManagement/page/BridgeManagement";
import ConstructionManagement from "@pages/SUDA/ConstructionManagement/page/ConstructionManagement";
import CostMonitoring from "@pages/SUDA/CostMonitoring/page/CostMonitoring";
import DocumentFlow from "@pages/SUDA/DocumentFlow/page/DocumentFlow";
import Hdm4Interface from "@pages/SUDA/Hdm4Interface/page/Hdm4Interface";
import SudaHome from "@pages/SUDA/Main/page/SudaHome";
import RoadLocation from "@pages/SUDA/RoadLocation/page/RoadLocation";
import RoadMaintenance from "@pages/SUDA/RoadMaintenance/page/RoadMaintenance";
import RoadSafety from "@pages/SUDA/RoadSafety/page/RoadSafety";
import Tolling from "@pages/SUDA/Tolling/page/Tolling";
import TrafficManagement from "@pages/SUDA/TrafficManagement/page/TrafficManagement";
import TunnelManagement from "@pages/SUDA/TunnelManagement/page/TunnelManagement";
import TransportEdit from "@pages/Transport/page/TransportEdit";
import TransportForm from "@pages/Transport/page/TransportForm";
import TransportTable from "@pages/Transport/page/TransportTable";
import TransportVieww from "@pages/Transport/page/TransportVieww";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import { ToastContainer } from "react-toastify";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");
      const refreshTokenFromUrl = urlParams.get("refresh_token");

      if (tokenFromUrl && refreshTokenFromUrl) {
        setTokens(tokenFromUrl, refreshTokenFromUrl);
        setIsLoggedIn(true);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      } else {
        setIsLoggedIn(hasTokens());
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    clearTokens();
    window.location.href = API_BASE_URL_REG;
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      {isLoggedIn ? (
        <>
          <Router>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              style={{ zIndex: 9999 }}
              toastStyle={{ minWidth: "350px" }}
            />
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/sudamain" element={<SudaHome />} />
                <Route path="/road-location" element={<RoadLocation />} />
                <Route
                  path="/bridge-management"
                  element={<BridgeManagement />}
                />
                <Route
                  path="/tunnel-management"
                  element={<TunnelManagement />}
                />
                <Route
                  path="/traffic-management"
                  element={<TrafficManagement />}
                />
                <Route path="/road-maintenance" element={<RoadMaintenance />} />
                <Route
                  path="/construction-management"
                  element={<ConstructionManagement />}
                />
                <Route path="/hdm4-interface" element={<Hdm4Interface />} />
                <Route path="/road-safety" element={<RoadSafety />} />
                <Route path="/cost-monitoring" element={<CostMonitoring />} />
                <Route path="/tolling" element={<Tolling />} />
                <Route path="/document-flow" element={<DocumentFlow />} />
                <Route path="/licensing" element={<Licensing />} />
                <Route path="/certification" element={<Certification />} />
                <Route path="/permits" element={<Permits />} />
                <Route path="/special-permits" element={<SpecialPermits />} />
                <Route path="/waybill" element={<Waybill />} />
                <Route path="/e-ttn" element={<ETTN />} />
                <Route path="/e-cmr" element={<ECMR />} />
                <Route path="/e-tir" element={<ETIR />} />
                <Route path="/gps-glonass" element={<GpsGlonass />} />
                <Route path="/tachograph" element={<Tachograph />} />
                <Route index path="/" element={<Ecommerce />} />
                <Route
                  path="/documents/INDIVIDUAL"
                  element={<IndividualDocs />}
                />

                <Route path="/documents/COMPANY" element={<CompanyDocs />} />
                <Route
                  path="/documents/ENTREPRENEUR"
                  element={<EntrepreneurDocs />}
                />
                <Route
                  path="/documents/TRANSPORT"
                  element={<TransportDocs />}
                />
                <Route
                  path="/reports/INDIVIDUAL"
                  element={<IndividualReports />}
                />
                <Route path="/reports/COMPANY" element={<CompanyReports />} />
                <Route
                  path="/reports/ENTREPRENEUR"
                  element={<EntrepreneurReports />}
                />
                <Route
                  path="/reports/traffic-intensity"
                  element={<TrafficIntensity />}
                />
                <Route path="/references" element={<ReferencePage />} />
                <Route path="/references/cities" element={<City />} />
                <Route
                  path="/references/company-types"
                  element={<CompanyType />}
                />
                <Route path="/references/countries" element={<Country />} />
                <Route path="/references/districts" element={<District />} />
                <Route
                  path="/references/document-types"
                  element={<DocumentType />}
                />
                <Route path="/references/user-statuses" element={<Status />} />
                <Route
                  path="/references/transport-types"
                  element={<TransportType />}
                />
                <Route
                  path="/references/transport-brands"
                  element={<TransportBrand />}
                />
                <Route
                  path="/references/transport-views"
                  element={<TransportView />}
                />
                <Route
                  path="/references/transport-ownerships"
                  element={<TransportOwnerShip />}
                />
                <Route
                  path="/references/transport-owner-types"
                  element={<TransportOwnerType />}
                />
                <Route
                  path="/references/transport-fuels"
                  element={<TransportFuel />}
                />
                <Route
                  path="/references/licences"
                  element={<PermitApplicationList />}
                />
                <Route
                  path="/references/doc-upload-policy"
                  element={<DocUploadPolicy />}
                />
                <Route
                  path="/registeredIndividuals/:id"
                  element={<RegisteredIndividuals />}
                />
                <Route
                  path="/registeredIndividuals/:id/add-new"
                  element={<IndividualForm />}
                />
                <Route
                  path="/registeredIndividuals/INDIVIDUAL/edit/:id"
                  element={<EditIndividual />}
                />
                <Route
                  path="/registeredIndividuals/INDIVIDUAL/view/:id"
                  element={<ViewIndividual />}
                />
                <Route
                  path="/registeredCompanies/:id/add-new"
                  element={<CompanyForm />}
                />
                <Route
                  path="/registeredCompanies/:id"
                  element={<RegisteredComapanies />}
                />
                <Route
                  path="/registeredCompanies/COMPANY/edit/:id"
                  element={<EditCompany />}
                />
                <Route
                  path="/registeredCompanies/COMPANY/view/:id"
                  element={<ViewCompany />}
                />
                <Route path="/employess/:id" element={<Employess />} />
                <Route
                  path="/employessView/:id/:type"
                  element={<EmployessTableView />}
                />
                <Route
                  path="/employessForm/:id/:type"
                  element={<EmployessForm />}
                />
                <Route
                  path="/registeredentrepreneurs/:id/add-new"
                  element={<EntrepreneurForm />}
                />
                <Route
                  path="/registeredentrepreneurs/:id"
                  element={<RegisteredEntrepreneur />}
                />
                <Route
                  path="/registeredentrepreneurs/ENTREPRENEUR/edit/:id"
                  element={<EditEntrepreneur />}
                />
                <Route
                  path="/registeredentrepreneurs/ENTREPRENEUR/view/:id"
                  element={<ViewEntrepreneur />}
                />
                <Route path="/transport/:id" element={<TransportTable />} />
                <Route
                  path="/transport/add-new-transport"
                  element={<TransportForm />}
                />
                <Route
                  path="/transport/TRANSPORT/edit/:id"
                  element={<TransportEdit />}
                />
                <Route
                  path="/transport/TRANSPORT/view/:id"
                  element={<TransportVieww />}
                />

                <Route path="/licensing" element={<LicensingMain />} />
                <Route
                  path="/licensing/:entityType"
                  element={<LicensingEntity />}
                />
                <Route
                  path="/licensing/company/licences-requests"
                  element={<LicenceList />}
                />
                <Route
                  path="/licensing/company/licences-available"
                  element={<LicenceList />}
                />
                <Route
                  path="/licensing/individual/licences-requests"
                  element={<LicenceList />}
                />
                <Route
                  path="/licensing/individual/licences-available"
                  element={<LicenceList />}
                />

                <Route
                  path="/licensing/entrepreneurPermitApplicationTable"
                  element={<EntrepreneurPermitApplication />}
                />
                <Route
                  path="/companypermitapplication/:entityId"
                  element={<CompanyPermitApplicationView />}
                />
                <Route
                  path="/permitApplicationcompany"
                  element={<PermitApplicationCompany />}
                />

                <Route
                  path="/permitApplicationentrepreneur"
                  element={<PermitApplicationEntrepreneur />}
                />

                {/* checkstatusTemporary */}
                <Route
                  path="/individual-temporary"
                  element={<IndividualTemporary />}
                />
                <Route
                  path="/transport-temporary"
                  element={<TransportTemporary />}
                />

                {/* INDIVIDUAL */}
                <Route
                  path="/registeredIndividuals/:entityType/edit/:entityId/documents/:docType"
                  element={<DocumentTableEditIndividual />}
                />
                <Route
                  path="/registeredIndividuals/:entityType/view/:entityId/documents/:docType"
                  element={<DocumentTableViewIndividual />}
                />

                {/* COMPANY */}
                <Route
                  path="/registeredCompanies/:entityType/edit/:entityId/documents/:docType"
                  element={<DocumentTableEditCompany />}
                />
                <Route
                  path="/registeredCompanies/:entityType/view/:entityId/documents/:docType"
                  element={<DocumentTableViewCompany />}
                />

                {/* Entrepreneur */}
                <Route
                  path="/registeredentrepreneurs/:entityType/edit/:entityId/documents/:docType"
                  element={<DocumentTableEditEntrepreneur />}
                />
                <Route
                  path="/registeredentrepreneurs/:entityType/view/:entityId/documents/:docType"
                  element={<DocumentTableViewEntrepreneur />}
                />

                <Route path="/dozvol" element={<Dozvol />} />
                <Route path="/permits/dozvolTable" element={<DozvolTable />} />
                <Route path="/permits/add-new" element={<AddPermits />} />
                <Route
                  path="/permits/dozvolTable/view/:id"
                  element={<DozvolViewPage />}
                />
                <Route
                  path="/permits/blanksstats"
                  element={<DozvolBlankStats />}
                />
                <Route path="/integrations" element={<Integrations />} />
                <Route
                  path="/under-development"
                  element={<UnderDevelopment />}
                />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </>
      ) : (
        <div className="flex justify-center mt-[3%]">
          <button
            className="w-[200px] h-[70px] bg-black text-[white]"
            onClick={handleLogin}
          >
            Войти
          </button>
        </div>
      )}
    </>
  );
}
