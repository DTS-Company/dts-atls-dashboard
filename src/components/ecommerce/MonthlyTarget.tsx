import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useGetAllCompaniesQuery } from "../../pages/Company/api/api";
import { ArrowDown, ArrowUp, EllipsisVertical } from "lucide-react";
import { useLocalization } from "@hooks/useLocalization";

export default function MonthlyTarget() {
  const { data: companyData } = useGetAllCompaniesQuery({ page: 1, size: 30 });
  const totalCountCompany = companyData?.meta?.totalCount || 0;
  const totalLegalEntities = 645;
  const connectedEntities = totalCountCompany;
  const connectionPercentage = Math.round(
    (connectedEntities / totalLegalEntities) * 100,
  );
  const { t } = useLocalization();

  const series = [connectionPercentage];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: [t("mainpage.connectionLabel")],
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const metrics = [
    // {
    //   title: t("mainpage.totalLegalEntities"),
    //   value: totalLegalEntities.toString(),
    //   description: t("mainpage.totalCountDescription"),
    // },
    {
      title: t("mainpage.connected"),
      value: connectedEntities.toString(),
      trend: "up",
      description: t("mainpage.connectedDescription"),
    },
    // {
    //   title: t("mainpage.disconnected"),
    //   value: disconnectedEntities.toString(),
    //   trend: "down",
    //   description: t("mainpage.disconnectedDescription"),
    // }
    // {
    //   title: t("mainpage.percentage"),
    //   value: `${connectionPercentage}%`,
    //   description: t("mainpage.percentageDescription"),
    // },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {t("mainpage.connectionStats")}
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {t("mainpage.legalEntitiesDescription")}
            </p>
          </div>

          <div className="relative inline-block">
            <button onClick={toggleDropdown}>
              <EllipsisVertical className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                {t("mainpage.refreshData")}
              </DropdownItem>
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                {t("mainpage.exportPDF")}
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="relative">
          <div className="max-h-[330px]">
            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            {connectedEntities} {t("mainpage.connectedOfTotal")}{" "}
            {totalLegalEntities}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-12">
        {metrics.map((metric, index) => (
          <div key={metric.title} className="flex items-center">
            {index > 0 && (
              <div className="w-[3px] h-10 bg-gray-200 dark:bg-gray-800"></div>
            )}
            <div className="flex flex-col items-center px-4">
              <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                {metric.title}
              </p>
              <p className="text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                {metric.value}
              </p>
              {metric.description && (
                <p className="mt-1 text-xs text-center text-gray-400 dark:text-gray-500">
                  {metric.description}
                </p>
              )}
              {metric.trend && (
                <div className="flex justify-center mt-1">
                  {metric.trend === "up" ? (
                    <ArrowUp className="text-green-600" />
                  ) : (
                    <ArrowDown className="text-red-600" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
