import { User } from "lucide-react";
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useNavigate } from "react-router-dom";
import { useLocalization } from "@hooks/useLocalization";

const LicensingMain = () => {
  const navigate = useNavigate();
  const { t } = useLocalization();

  const buttonData = [
    {
      title: t("licencing.company"),
      path: "/licensing/company",
      icon: <User size={28} />,
      iconColor: "text-success-600",
      bgColor: "bg-green-500/[0.08]",
    },
    {
     title: t("licencing.individual"),
      path: "/licensing/individual",
      icon: <User size={28} />,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-500/[0.08]",
    },
  ];
  return (
    <div className="p-4">
      <PageMeta title={t("licencing.title")} description="" />
      <PageBreadcrumb pageTitle={t("licencing.title")} />
      <ComponentCard title={t("licencing.title")}>
        <div className="max-w-full overflow-x-auto min-h-[65vh]">
          <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {buttonData.map(({ title, path, icon, iconColor, bgColor }) => (
              <button
                key={title}
                onClick={() => navigate(path)}
                className="group relative flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-sm transition-shadow duration-300 w-full h-[14vh]"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-xl transition-transform duration-300 ${bgColor} ${iconColor}`}
                >
                  {icon}
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    {title} 
                  </h4>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {t("licencing.go_to_list")}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};

export default LicensingMain;
