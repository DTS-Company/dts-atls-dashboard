import { useNavigate, useParams } from "react-router";
import { Truck, Settings, UserCheck, MonitorCog } from "lucide-react";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";

const EmployessView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const entityId = String(id);
  const { t } = useLocalization();

  const roles = [
    {
      label: t("subject.company.employees_page.first_role"),
      type: "DRIVER",
      icon: Truck,
      iconColor: "text-success-500",
      bgColor: "bg-success-500/[0.08]",
    },
    {
      label: t("subject.company.employees_page.second_role"),
      type: "DISPATCHER",
      icon: MonitorCog,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-500/[0.08]",
    },
    {
      label: t("subject.company.employees_page.third_role"),
      type: "MECHANIC",
      icon: Settings,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/[0.08]",
    },
    {
      label: t("subject.company.employees_page.fourth_role"),
      type: "DOCTOR",
      icon: UserCheck,
      iconColor: "text-pink-500",
      bgColor: "bg-pink-500/[0.08]",
    },
  ];

  return (
    <ComponentCard title={t("subject.company.employees_page.title")}>
      <h1 className="text-center p-4 sm:text-[38px]">
        {t("subject.company.employees_page.title")}
      </h1>

      <div className="grid gap-4 grid-cols-4 p-4">
        {roles.map(({ label, type, icon: Icon, iconColor, bgColor }) => (
          <button
            key={type}
            onClick={() => navigate(`/employessView/${entityId}/${type}`)}
            className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 w-full h-[10vh] flex items-center"
          >
            <div className="flex items-center gap-4 ml-[4%]">
              <div
                className={`flex p-4 items-center justify-center rounded-xl ${bgColor} ${iconColor}`}
              >
                <Icon size={22} />
              </div>
              <div>
                <h4 className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">
                  {label}
                </h4>
              </div>
            </div>
          </button>
        ))}
      </div>
    </ComponentCard>
  );
};

export default EmployessView;
