import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import {
  FileBadge2,
  ClipboardList,
  Lightbulb,
  FolderKanban,
  Leaf,
  CreditCard,
  FolderGit2,
  Landmark,
  FolderGit,
  CarFront,
} from "lucide-react";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const Integrations = () => {
  const { t } = useLocalization();

  const metrics = [
    {
      label: t("integrations.tax_committee"),
      percent: 100,
      icon: <Landmark className="size-6 text-blue-600 dark:text-blue-400" />,
      description: t("integrations.tax_committee_desc"),
      bg: "bg-blue-100 dark:bg-blue-900",
    },
    {
      label: t("integrations.permit"),
      percent: 100,
      icon: (
        <ClipboardList className="size-6 text-teal-600 dark:text-teal-400" />
      ),
      description: t("integrations.permit_desc"),
      bg: "bg-teal-100 dark:bg-teal-900",
    },
    {
      label: t("integrations.license"),
      percent: 95,
      icon: (
        <FileBadge2 className="size-6 text-orange-600 dark:text-orange-400" />
      ),
      description: t("integrations.license_desc"),
      bg: "bg-orange-100 dark:bg-orange-900",
    },
    {
      label: t("integrations.certificate"),
      percent: 25,
      icon: (
        <FolderKanban className="size-6 text-purple-600 dark:text-purple-400" />
      ),
      description: t("integrations.certificate_desc"),
      bg: "bg-purple-100 dark:bg-purple-900",
    },
    {
      label: t("integrations.innovation"),
      percent: 100,
      icon: <Lightbulb className="size-6 text-pink-600 dark:text-pink-400" />,
      description: t("integrations.innovation_desc"),
      bg: "bg-pink-100 dark:bg-pink-900",
    },
    {
      label: t("integrations.cmr"),
      percent: 15,
      icon: (
        <FileBadge2 className="size-6 text-indigo-600 dark:text-indigo-400" />
      ),
      description: t("integrations.cmr_desc"),
      bg: "bg-indigo-100 dark:bg-indigo-900",
    },
    {
      label: t("integrations.waybill"),
      percent: 60,
      icon: (
        <FolderGit2 className="size-6 text-yellow-600 dark:text-yellow-400" />
      ),
      description: t("integrations.waybill_desc"),
      bg: "bg-yellow-100 dark:bg-yellow-900",
    },
    {
      label: t("integrations.chip_card"),
      percent: 0,
      icon: <CreditCard className="size-6 text-red-600 dark:text-red-400" />,
      description: t("integrations.chip_card_desc"),
      bg: "bg-red-100 dark:bg-red-900",
    },
    {
      label: t("integrations.etir"),
      percent: 0,
      icon: (
        <FolderKanban className="size-6 text-cyan-600 dark:text-cyan-400" />
      ),
      description: t("integrations.etir_desc"),
      bg: "bg-cyan-100 dark:bg-cyan-900",
    },
    {
      label: t("integrations.neru"),
      percent: 80,
      icon: <Leaf className="size-6 text-green-600 dark:text-green-400" />,
      description: t("integrations.neru_desc"),
      bg: "bg-green-100 dark:bg-green-900",
    },
    {
      label: "E-permit",
      percent: 80,
      icon: (
        <FolderGit className="size-6 text-violet-600 dark:text-violet-400" />
      ),
      description: t("integrations.e_permit_desc"),
      bg: "bg-violet-100 dark:bg-violet-900",
    },
    {
      label: t("integrations.gai"),
      percent: 80,
      icon: <CarFront className="size-6 text-amber-600 dark:text-amber-400" />,
      description: t("integrations.gai_desc"),
      bg: "bg-amber-100 dark:bg-amber-900",
    },
  ];

  return (
    <div>
      <PageMeta title={t("integrations.title")} description="" />
      <PageBreadcrumb pageTitle={t("integrations.title")} />

      <ComponentCard title={t("integrations.title")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-fr">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="h-full rounded-2xl border border-gray-200 bg-white p-4
                         flex gap-4 items-start
                         hover:bg-gray-100 hover:text-blue-800
                         dark:border-gray-700 dark:bg-white/[0.03]
                         dark:hover:bg-white/[0.05] dark:hover:text-white
                         transition-colors"
            >
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-xl shrink-0 ${metric.bg}`}
              >
                {metric.icon}
              </div>

              <div className="flex flex-col w-full min-w-0">
                <span className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {metric.label}
                </span>

                <h4 className="font-bold text-gray-800 text-2xl dark:text-white">
                  {metric.percent}%
                </h4>

                <p className="text-xs text-gray-400 dark:text-gray-400 line-clamp-3">
                  {metric.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>
    </div>
  );
};

export default Integrations;
