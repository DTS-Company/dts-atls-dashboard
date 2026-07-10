import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Folder } from "lucide-react";
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";

const LicensingEntity = () => {
  const navigate = useNavigate();
  const { entityType } = useParams();
    const { t } = useLocalization();

  const buttonDataTemplate = {
  company: [
    {
      title: t("licencing_entity.first_title"),
      path: "/licensing/company/licences-available",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/[0.08]",
    },
    {
      title: t("licencing_entity.second_title"),
      path: "/licensing/company/licences-requests",
      iconColor: "text-success-500",
      bgColor: "bg-success-500/[0.08]",
    },
  ],
  individual: [
    {
      title: t("licencing_entity.first_title"),
      path: "/licensing/individual/licences-available",
      iconColor: "text-pink-500",
      bgColor: "bg-pink-500/[0.08]",
    },
    {
      title: t("licencing_entity.second_title"),
      path: "/licensing/individual/licences-requests",
      iconColor: "text-orange-500",
      bgColor: "bg-orange-500/[0.08]",
    },
  ],
};

const titles = {
  company: t("licencing_entity.company_title"),
  individual: t("licencing_entity.individual_title"),
};


  const buttonData =
    buttonDataTemplate[entityType as keyof typeof buttonDataTemplate];
  const pageTitle = titles[entityType as keyof typeof titles];

  if (!buttonData) return <div>Неверный тип лицензии</div>;

  return (
    <div>
      <PageMeta title={pageTitle} description="" />
      <PageBreadcrumb
        pageTitle={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Link
                to="/licensing"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              >
                <span>{t("licencing.title")}</span>
                <ChevronRight size={16} /> 
              </Link>
            </div>
            <span className="text-sm text-gray-800 dark:text-white/90">
              {pageTitle}
            </span>
          </div>
        }
      />
      <ComponentCard title={pageTitle}>
        <div className="max-w-full overflow-x-auto min-h-[65vh]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 p-4">
            {buttonData.map(({ title, path, iconColor, bgColor }) => (
              <button
                key={title}
                onClick={() => navigate(path)}
                className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 w-full h-[10vh] flex items-center"
              >
                <div className="flex items-center gap-4 ml-[4%]">
                  <div
                    className={`flex h-[52px] w-[52px] items-center justify-center rounded-xl ${bgColor} ${iconColor}`}
                  >
                    <Folder size={20} />
                  </div>
                  <div>
                    <h4 className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">
                      {title}
                    </h4>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};

export default LicensingEntity;
