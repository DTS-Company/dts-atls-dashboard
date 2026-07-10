import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import { useGetAppListNewQuery } from "../../pages/PermitApplication/page/Dozvol/api/api";
import { useNavigate } from "react-router";
import { EllipsisVertical } from "lucide-react";
import { useLocalization } from "@hooks/useLocalization";

interface DozvolApplication {
  id: string;
  app_number: string;
  carrier_inn: string;
  carrier_FullName: string;
  carrier_date_submit: string;
  status_name: string;
}

interface StatusStats {
  [key: string]: number;
}

export default function () {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t } = useLocalization();
  const { data: dozvolData } = useGetAppListNewQuery();
  const applications: DozvolApplication[] = dozvolData?.content || [];
  const navigate = useNavigate();
  const monthlyDozvol: number[] = Array(12).fill(0);
  applications.forEach((app: DozvolApplication) => {
    const date = new Date(app.carrier_date_submit);
    if (!isNaN(date.getTime())) {
      const month = date.getMonth();
      monthlyDozvol[month]++;
    }
  });

  const statusStats: StatusStats = applications.reduce(
    (acc: StatusStats, app: DozvolApplication) => {
      acc[app.status_name] = (acc[app.status_name] || 0) + 1;
      return acc;
    },
    {} as StatusStats,
  );

  const options: ApexOptions = {
    colors: ["#10B981"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Янв",
        "Фев",
        "Мар",
        "Апр",
        "Май",
        "Июн",
        "Июл",
        "Авг",
        "Сен",
        "Окт",
        "Ноя",
        "Дек",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: t("mainpage.count"),
        offsetX: 10,
        style: {
          cssClass: "yaxis-title",
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} ${t("mainpage.applications")}`,
      },
    },
  };

  const series: ApexAxisChartSeries = [
    {
      name: t("mainpage.permits"),
      data: monthlyDozvol,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {t("mainpage.stats")}
        </h3>
        <div className="relative inline-block">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Действия">
            <EllipsisVertical className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            className="w-40 p-2"
          >
            <DropdownItem
              onClick={() => navigate("/permits/dozvolTable")}
              onItemClick={() => setIsOpen(false)}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              {t("mainpage.see")}
            </DropdownItem>
            <DropdownItem
              onItemClick={() => setIsOpen(false)}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              {t("mainpage.settings")}
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 pb-5">
        <div className="bg-blue-50 flex items-center gap-4 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-300">
            {t("mainpage.totalApplications")}
          </p>
          <p className="text-xl dark:text-white font-bold">
            {applications.length}
          </p>
        </div>
        <div className="bg-yellow-50 flex items-center gap-4 dark:bg-yellow-900/20 p-3 rounded-lg">
          <p className="text-sm text-yellow-600 dark:text-yellow-300">
            {t("mainpage.awaitingPayment")}
          </p>
          <p className="text-xl dark:text-white font-bold">
            {statusStats["Ожидает оплату"] || 0}
          </p>
        </div>
        <div className="bg-green-50 flex items-center gap-4 dark:bg-green-900/20 p-3 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-300">
            {t("mainpage.documentsIssued")}
          </p>
          <p className="text-xl dark:text-white font-bold">
            {statusStats["Документы выданы"] || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
