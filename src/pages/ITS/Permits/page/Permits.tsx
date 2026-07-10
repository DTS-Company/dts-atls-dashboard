import { useNavigate } from "react-router";
import { Folder, FilePlus, ClipboardList } from "lucide-react";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";
import PageMeta from "@components/common/PageMeta";

const Permits = () => {
  const navigate = useNavigate();
  const { t } = useLocalization();

  const buttons = [
    {
      title: t("permits.first_button"),
      path: "/permits/blanksstats",
      bgColor: "bg-success-500/[0.08]",
      textColor: "text-success-500",
      Icon: Folder,
    },
    {
      title: t("permits.second_button"),
      path: "/permits/add-new",
      bgColor: "bg-pink-500/[0.08]",
      textColor: "text-pink-500",
      Icon: FilePlus,
    },
    {
      title: t("permits.third_button"),
      path: "/permits/dozvolTable",
      bgColor: "bg-blue-500/[0.08]",
      textColor: "text-blue-500",
      Icon: ClipboardList,
    },
  ];

  return (
    <>
      <PageMeta title={t("permits.title")} description="" />
      <PageBreadcrumb pageTitle={t("permits.breadcrum")} />
      <ComponentCard title={t("permits.title")}>
        <div className="max-w-full overflow-x-auto min-h-[83vh]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 p-4">
            {buttons.map((btn, index) => (
              <button
                key={index}
                onClick={() => navigate(btn.path)}
                className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 w-full h-[10vh] flex items-center"
              >
                <div className="flex items-center gap-4 ml-[4%]">
                  <div
                    className={`flex h-[52px] w-[52px] items-center justify-center rounded-xl ${btn.bgColor} ${btn.textColor}`}
                  >
                    <btn.Icon size={20} />
                  </div>
                  <div>
                    <h4 className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">
                      {btn.title}
                    </h4>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </ComponentCard>
    </>
  );
};

export default Permits;
