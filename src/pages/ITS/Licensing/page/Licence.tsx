import { useState } from "react";
import { MenuItem, Select } from "@mui/material";
import { Calendar, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetFormDetailsQuery,
  useGetLicencesQuery,
  useGetLicenceStatusesQuery,
  useLazyGetLicenceDocumentQuery,
} from "../api/api";
import LicenceModal from "../components/LicenceModal";
import LicenceTable from "../components/LicenceTable";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import PageMeta from "@components/common/PageMeta";
import ComponentCard from "@components/common/ComponentCard";
import Button from "@components/ui/button/Button";
import { useModal } from "@hooks/useModal";
import { Link, useLocation } from "react-router";
import { useLocalization } from "@hooks/useLocalization";

interface LicenceListProps {
  forcedDocumentType?: 0 | 1;
}

const LicenceList = ({
  forcedDocumentType: propDocumentType,
}: LicenceListProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { pathname } = useLocation();
  const { t } = useLocalization();

  const buttonData = [
    {
      title: t("licencing_entity.first_title"),
      path: "licences-available",
    },
    {
      title: t("licencing_entity.second_title"),
      path: "licences-requests",
    },
  ];

  let finalDocumentType: 0 | 1 | undefined = propDocumentType;
  let finalLegalEntity: 1 | 2 | undefined = undefined;

  if (!finalDocumentType) {
    if (pathname.includes("licences-available")) {
      finalDocumentType = 0;
    }

    if (pathname.includes("licences-requests")) {
      finalDocumentType = 1;
    }
  }

  if (pathname.includes("/company/")) {
    finalLegalEntity = 1;
  } else if (pathname.includes("/individual/")) {
    finalLegalEntity = 2;
  }

  const [selectedLicence, setSelectedLicence] = useState<any>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const [selectedLocation, setSelectedLocation] = useState<
    number | undefined
  >();
  const [selectedOrganizationType, setSelectedOrganizationType] = useState<
    number | undefined
  >();
  const [selectedLegalEntity, setSelectedLegalEntity] = useState<
    number | undefined
  >();
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>();
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [searchParams, setSearchParams] = useState<{
    location?: number;
    organization_type?: number;
    legal_entity?: number;
    status?: number;
    search?: string;
    fromDate?: string;
    toDate?: string;
  }>({});

  const {
    data: licencesData,
    isLoading,
    isError,
  } = useGetLicencesQuery({
    page: currentPage + 1,
    per_page: itemsPerPage,
    document_type: finalDocumentType,
    legal_entity: finalLegalEntity,
    ...searchParams,
  });

  const { data: statuses } = useGetLicenceStatusesQuery();
  const { data: formDetails } = useGetFormDetailsQuery();
  const [downloadDocument] = useLazyGetLicenceDocumentQuery();
  const entityType = pathname.includes("/company/") ? "company" : "individual";

  const totalCount = licencesData?.total || 0;
  const licencesList = licencesData?.data || [];
  const filteredLicences = licencesList.filter((licence) => {
    if (entityType === "company" && licence.legal_entity !== "1") return false;
    if (entityType === "individual" && licence.legal_entity !== "2")
      return false;
    return true;
  });

  const handleSearch = () => {
    setCurrentPage(0);
    setSearchParams({
      location: selectedLocation,
      organization_type: selectedOrganizationType,
      legal_entity: selectedLegalEntity,
      status: selectedStatus,
      search: searchText || undefined,
      fromDate: startDate || undefined,
      toDate: endDate || undefined,
    });
  };

  const handleClearFilters = () => {
    setSelectedLocation(undefined);
    setSelectedOrganizationType(undefined);
    setSelectedLegalEntity(undefined);
    setSelectedStatus(undefined);
    setSearchText("");
    setStartDate("");
    setEndDate("");
    setSearchParams({});
    setCurrentPage(0);
  };

  const handleView = (licence: any) => {
    setSelectedLicence(licence);
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
    setSelectedLicence(null);
  };

  const handleDownloadDocument = async (licence: any) => {
    try {
      const { data: pdfBlob } = await downloadDocument({
        clientId: licence.id,
        clientToken: licence.token,
      });

      if (pdfBlob) {
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `licence_${licence.unique_number}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Документ успешно скачан");
      }
    } catch (error) {
      console.error("Ошибка при скачивании документа:", error);
      toast.error("Не удалось скачать документ");
    }
  };

  const getLocation = (licence: any) => {
    return (
      formDetails?.locations?.find((l) => l.id === licence.location)
        ?.location || licence.location
    );
  };

  if (isError) {
    return <div className="p-6 text-red-500">Ошибка при загрузке</div>;
  }

  const breadcrumbTitle =
    buttonData.find((b) => pathname.includes(b.path))?.title ||
    t("licencing.title");

  return (
    <>
      <PageBreadcrumb
        pageTitle={
          <>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/licensing"
            >
              {t("licencing.title")}
              <ChevronRight size={18} />
            </Link>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to={
                pathname.includes("/company/")
                  ? "/licensing/company"
                  : "/licensing/individual"
              }
            >
              {pathname.includes("/company/")
                ? t("licencing_entity.company_title")
                : t("licencing_entity.individual_title")}
              <ChevronRight size={18} />
            </Link>
            <span className="text-sm text-gray-800 dark:text-white/90">
              {breadcrumbTitle}
            </span>
          </>
        }
      />

      <PageMeta title="Лицензии" description="Управление лицензиями" />
      <ComponentCard title={`${breadcrumbTitle}`}>
        <div className="flex flex-col gap-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("licence_awailable.search")}
              </label>
              <input
                type="text"
                placeholder={`${t("licence_awailable.search_placeholder")}`}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full px-3 h-12 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-none text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("licence_awailable.location")}
              </label>
              <Select
                value={selectedLocation || ""}
                onChange={(e) =>
                  setSelectedLocation((e.target.value as number) || undefined)
                }
                displayEmpty
                className="w-full h-12 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                MenuProps={{
                  PaperProps: {
                    className:
                      "bg-white dark:bg-gray-600 text-gray-800 dark:text-white",
                  },
                }}
              >
                <MenuItem value="">
                  {t("licence_awailable.all_location")}
                </MenuItem>
                {formDetails?.locations?.map((location) => (
                  <MenuItem
                    key={location.id}
                    value={location.id}
                    className="bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                  >
                    {location.location}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("licence_awailable.org_type")}
              </label>
              <Select
                value={selectedOrganizationType || ""}
                onChange={(e) =>
                  setSelectedOrganizationType(
                    (e.target.value as number) || undefined,
                  )
                }
                displayEmpty
                className="w-full h-12 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                MenuProps={{
                  PaperProps: {
                    className:
                      "bg-white dark:bg-gray-600 text-gray-800 dark:text-white",
                  },
                }}
              >
                <MenuItem value="">{t("licence_awailable.all_type")}</MenuItem>
                {formDetails?.organizationType?.map((type) => (
                  <MenuItem
                    key={type.id}
                    value={type.id}
                    className="bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                  >
                    {type.value}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("licence_awailable.sub_type")}
              </label>
              <Select
                value={selectedLegalEntity || ""}
                onChange={(e) =>
                  setSelectedLegalEntity(
                    (e.target.value as number) || undefined,
                  )
                }
                displayEmpty
                className="w-full h-12 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                MenuProps={{
                  PaperProps: {
                    className:
                      "bg-white dark:bg-gray-600 text-gray-800 dark:text-white",
                  },
                }}
              >
                <MenuItem value="">{t("licence_awailable.all")}</MenuItem>
                {formDetails?.legal_entity?.map((entity) => (
                  <MenuItem
                    key={entity.id}
                    value={entity.id}
                    className="bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                  >
                    {entity.value}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("licence_awailable.status")}
              </label>
              <Select
                value={selectedStatus || ""}
                onChange={(e) =>
                  setSelectedStatus((e.target.value as number) || undefined)
                }
                displayEmpty
                className="w-full h-12 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                MenuProps={{
                  PaperProps: {
                    className:
                      "bg-white dark:bg-gray-600 text-gray-800 dark:text-white",
                  },
                }}
              >
                <MenuItem value="">
                  {t("licence_awailable.all_status")}
                </MenuItem>
                {statuses?.map((status) => (
                  <MenuItem
                    key={status.id}
                    value={parseInt(status.id)}
                    className="bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                  >
                    {status.title}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("licence_awailable.start_date")}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-3 h-12 border dark:border-none border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Calendar className="absolute left-3 top-[48px] transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("licence_awailable.end_date")}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-3 h-12 border dark:border-none border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Calendar className="absolute left-3 top-[48px] transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex gap-3">
              <Button className="h-12" onClick={handleSearch}>
                {t("licence_awailable.search")}
              </Button>
              <Button className="h-12" onClick={handleClearFilters}>
                {t("licence_awailable.remove")}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="gap-2 flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm">
            <div className="text-gray-500 text-sm">
              {t("licence_awailable.count")}
            </div>
            <div className="font-semibold text-lg dark:text-white">
              {totalCount}
            </div>
          </div>
        </div>
        <LicenceTable
          licencesList={filteredLicences}
          formDetails={formDetails}
          statuses={statuses || []}
          totalCount={totalCount}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          handleView={handleView}
          handleDownloadDocument={handleDownloadDocument}
          entityType={entityType}
          isLoading={isLoading}
        />
        {selectedLicence && (
          <LicenceModal
            isOpen={isOpen}
            onClose={handleCloseModal}
            selectedLicence={selectedLicence}
            getLocation={getLocation}
            formatDate={(date) =>
              date ? new Date(date).toLocaleDateString("ru-RU") : "Не указано"
            }
          />
        )}
      </ComponentCard>
    </>
  );
};
export default LicenceList;
