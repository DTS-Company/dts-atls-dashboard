import { useNavigate } from "react-router";
import {
  Building2,
  Landmark,
  Globe,
  Map,
  FileText,
  UserCheck,
  Truck,
  Car,
  Eye,
  Building,
  Users,
  Fuel,
  ClipboardList,
  BookOpenText,
} from "lucide-react";
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";

const ReferencePage = () => {
  const navigate = useNavigate();
  const { t } = useLocalization();

  const referenceItems = [
    {
      id: "city",
      path: "/references/cities",
      title: t("references.cities.title"),
      colorClass: "success-500",
      icon: Building2,
    },
    {
      id: "companyType",
      path: "/references/company-types",
      title: t("references.company_types.title"),
      colorClass: "pink-500",
      icon: Landmark,
    },
    {
      id: "country",
      path: "/references/countries",
      title: t("references.countries.title"),
      colorClass: "blue-light-500",
      icon: Globe,
    },
    {
      id: "district",
      path: "/references/districts",
      title: t("references.districts.title"),
      colorClass: "orange-500",
      icon: Map,
    },
    {
      id: "documentType",
      path: "/references/document-types",
      title: t("references.document_types.title"),
      colorClass: "purple-500",
      icon: FileText,
    },
    {
      id: "status",
      path: "/references/user-statuses",
      title: t("references.statuses.title"),
      colorClass: "yellow-500",
      icon: UserCheck,
    },
    {
      id: "transportType",
      path: "/references/transport-types",
      title: t("references.transport_types.title"),
      colorClass: "success-500",
      icon: Truck,
    },
    {
      id: "transportBrand",
      path: "/references/transport-brands",
      title: t("references.transport_brands.title"),
      colorClass: "pink-500",
      icon: Car,
    },
    {
      id: "transportView",
      path: "/references/transport-views",
      title: t("references.transport_view.title"),
      colorClass: "blue-light-500",
      icon: Eye,
    },
    {
      id: "transportOwnerShip",
      path: "/references/transport-ownerships",
      title: t("references.transport_ownership.title"),
      colorClass: "orange-500",
      icon: Building,
    },
    {
      id: "transportOwnerType",
      path: "/references/transport-owner-types",
      title: t("references.transport_owner_type.title"),
      colorClass: "purple-500",
      icon: Users,
    },
    {
      id: "transportFuel",
      path: "/references/transport-fuels",
      title: t("references.transport_fuel.title"),
      colorClass: "red-500",
      icon: Fuel,
    },
    {
      id: "licence",
      path: "/references/licences",
      title: t("references.licences.title"),
      colorClass: "blue-500",
      icon: ClipboardList,
    },
    {
      id: "licence",
      path: "/references/doc-upload-policy",
      title: t("references.doc_upload_policy.title"),
      colorClass: "orange-500",
      icon: BookOpenText,
    },
  ];

  type ReferenceItem = {
    id: string;
    path: string;
    title: string;
    colorClass: string;
    icon: React.ElementType;
  };

  const ReferenceButton = ({ item }: { item: ReferenceItem }) => {
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        onClick={() => navigate(item.path)}
        className="rounded-xl border border-gray-200 hover:border-gray-300 dark:hover:border-gray-900 hover:bg-[#f9f9f9] dark:hover:bg-[#1b2635] bg-white dark:border-gray-700 dark:bg-gray-800 w-[100%] h-[10vh] flex items-center"
      >
        <div className="flex items-center gap-4 ml-[4%]">
          <div
            className={`flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-${item.colorClass}/[0.08] text-${item.colorClass}`}
          >
            <Icon size={20} />
          </div>
          <div>
            <h4 className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">
              {item.title}
            </h4>
          </div>
        </div>
      </button>
    );
  };

  return (
    <>
      <PageMeta title={t("references.title")} description="" />
      <PageBreadcrumb pageTitle={t("references.title")} />
      <ComponentCard title={t("references.title")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 p-4">
          {referenceItems.map((item) => (
            <ReferenceButton key={item.id} item={item} />
          ))}
        </div>
      </ComponentCard>
    </>
  );
};

export default ReferencePage;
