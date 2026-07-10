import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { useLocalization } from "@hooks/useLocalization";

interface RoadData {
  id: string;
  road_number: string;
  road_type: string;
  road_length: number;
  quality_rating: string;
  processing_date: string;
  status_name: string;
}

interface QualityStats {
  [key: string]: number;
}

export default function SudaMainChart() {
    const { t } = useLocalization();
  const roads: RoadData[] = [
    {
      id: "1",
      road_number: "M41",
      road_type: t("suda.home.international"),
      road_length: 3383.6,
      quality_rating: "хорошее",
      processing_date: "2024-01-15",
      status_name: t("suda.home.international"),
    },
    {
      id: "2",
      road_number: "R25",
      road_type: t("suda.home.republican"),
      road_length: 2184.3,
      quality_rating: "удовлетворительное",
      processing_date: "2024-01-20",
      status_name: t("suda.home.republican"),
    },
    {
      id: "3",
      road_number: "L12",
      road_type: t("suda.home.local"),
      road_length: 8746.5,
      quality_rating: "отличное",
      processing_date: "2024-02-10",
      status_name: t("suda.home.local"),
    },
    {
      id: "4",
      road_number: "T01",
      road_type: t("suda.home.tunnels"),
      road_length: 11,
      quality_rating: "хорошее",
      processing_date: "2024-02-15",
      status_name: t("suda.home.tunnels"),
    },
    {
      id: "5",
      road_number: "B05",
      road_type: t("suda.home.bridges"),
      road_length: 2252,
      quality_rating: "отличное",
      processing_date: "2024-03-05",
      status_name: t("suda.home.bridges"),
    },
    {
      id: "6",
      road_number: "M42",
      road_type: t("suda.home.international"),
      road_length: 120,
      quality_rating: "хорошее",
      processing_date: "2024-03-12",
      status_name: t("suda.home.international"),
    },
    {
      id: "7",
      road_number: "R30",
      road_type: t("suda.home.republican"),
      road_length: 67,
      quality_rating: "удовлетворительное",
      processing_date: "2024-04-08",
      status_name: t("suda.home.republican"),
    },
    {
      id: "8",
      road_number: "L15",
      road_type: t("suda.home.local"),
      road_length: 25,
      quality_rating: "хорошее",
      processing_date: "2024-04-20",
      status_name: t("suda.home.local"),
    },
    {
      id: "9",
      road_number: "T02",
      road_type: t("suda.home.tunnels"),
      road_length: 2,
      quality_rating: "отличное",
      processing_date: "2024-05-10",
      status_name: t("suda.home.tunnels"),
    },
    {
      id: "10",
      road_number: "B08",
      road_type: t("suda.home.bridges"),
      road_length: 1,
      quality_rating: "хорошее",
      processing_date: "2024-05-25",
      status_name: t("suda.home.bridges"),
    },
    {
      id: "11",
      road_number: "M50",
      road_type: t("suda.home.international"),
      road_length: 95,
      quality_rating: "отличное",
      processing_date: "2024-06-15",
      status_name: t("suda.home.international"),
    },
    {
      id: "12",
      road_number: "R35",
      road_type: t("suda.home.republican"),
      road_length: 55,
      quality_rating: "хорошее",
      processing_date: "2024-07-05",
      status_name: t("suda.home.republican"),
    },
    {
      id: "13",
      road_number: "L20",
      road_type: t("suda.home.local"),
      road_length: 30,
      quality_rating: "удовлетворительное",
      processing_date: "2024-07-18",
      status_name: t("suda.home.local"),
    },
    {
      id: "14",
      road_number: "T03",
      road_type: t("suda.home.tunnels"),
      road_length: 4,
      quality_rating: "отличное",
      processing_date: "2024-08-10",
      status_name: t("suda.home.tunnels"),
    },
    {
      id: "15",
      road_number: "B12",
      road_type: t("suda.home.bridges"),
      road_length: 2,
      quality_rating: "хорошее",
      processing_date: "2024-08-25",
      status_name: t("suda.home.bridges"),
    },
    {
      id: "16",
      road_number: "M60",
      road_type: t("suda.home.international"),
      road_length: 110,
      quality_rating: "хорошее",
      processing_date: "2024-09-12",
      status_name: t("suda.home.international"),
    },
    {
      id: "17",
      road_number: "R40",
      road_type: t("suda.home.republican"),
      road_length: 78,
      quality_rating: "удовлетворительное",
      processing_date: "2024-10-08",
      status_name: t("suda.home.republican"),
    },
    {
      id: "18",
      road_number: "L25",
      road_type: t("suda.home.local"),
      road_length: 35,
      quality_rating: "хорошее",
      processing_date: "2024-10-20",
      status_name: t("suda.home.local"),
    },
    {
      id: "19",
      road_number: "T04",
      road_type: t("suda.home.tunnels"),
      road_length: 5,
      quality_rating: "отличное",
      processing_date: "2024-11-15",
      status_name: t("suda.home.tunnels"),
    },
    {
      id: "20",
      road_number: "B15",
      road_type: t("suda.home.bridges"),
      road_length: 3,
      quality_rating: "хорошее",
      processing_date: "2024-12-05",
      status_name: t("suda.home.bridges"),
    },
  ];

  const monthlyRoads: number[] = Array(12).fill(0);
  roads.forEach((road: RoadData) => {
    const date = new Date(road.processing_date);
    if (!isNaN(date.getTime())) {
      const month = date.getMonth();
      monthlyRoads[month] += road.road_length;
    }
  });

  const roadTypeStats: QualityStats = roads.reduce(
    (acc: QualityStats, road: RoadData) => {
      acc[road.status_name] = (acc[road.status_name] || 0) + road.road_length;
      return acc;
    },
    {} as QualityStats
  );

  const options: ApexOptions = {
    colors: ["#8B5CF6", "#06B6D4", "#10B981"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 220,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    fill: {
      opacity: 1,
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
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: t("suda.home.yaxis_title"),
        offsetX: 10,
        style: {
          color: "#6B7280",
          fontSize: "12px",
          fontWeight: 500,
        },
      },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val: number) => `${val} ${t("suda.home.tooltip")}`,
      },
      style: {
        fontSize: "12px",
      },
    },
    legend: {
      show: false,
    },
  };

  const series: ApexAxisChartSeries = [
    {
      name: t("suda.home.series_name"),
      data: monthlyRoads,
    },
  ];

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("suda.home.title")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
           {t("suda.home.header")} 
          </p>
        </div>
        <div className="relative inline-block">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Действия"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <EllipsisVertical className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={() => setIsOpen(false)}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 p-2"
            >
              {t("mainpage.see")}
            </DropdownItem>
            <DropdownItem
              onItemClick={() => setIsOpen(false)}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 p-2"
            >
             {t("mainpage.settings")}  
            </DropdownItem> 
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={220} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 pb-5">
        <div className="bg-gradient-to-br from-indigo-100 to-indigo-300 dark:from-indigo-800/40 dark:to-indigo-700/30 p-4 rounded-xl border border-indigo-300/50 dark:border-indigo-600/30">
          <div className="flex items-center justify-between mb-2">
            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <div className="text-indigo-500 text-xs font-medium">КМ</div>
          </div>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
            {t("suda.home.total")}
          </p>
          <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
            14 314.3 км
          </p>
        </div>

        {Object.entries(roadTypeStats).map(([status, count]) => {
          let bgGradient =
            "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-700/20";
          let borderColor = "border-gray-200/50 dark:border-gray-600/30";
          let dotColor = "bg-gray-500";
          let badgeText = "ШТ";
          let textColor = "text-gray-600 dark:text-gray-300";
          let countColor = "text-gray-700 dark:text-gray-200";

          if (status === t("suda.home.local")) {
            bgGradient =
              "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20";
            borderColor = "border-blue-200/50 dark:border-blue-700/30";
            dotColor = "bg-blue-500";
            badgeText = "МСТ";
            textColor = "text-blue-600 dark:text-blue-300";
            countColor = "text-blue-700 dark:text-blue-200";
          } else if (status === t("suda.home.international")) {
            bgGradient =
              "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20";
            borderColor = "border-yellow-200/50 dark:border-yellow-700/30";
            dotColor = "bg-yellow-500";
            badgeText = "МЖД";
            textColor = "text-yellow-600 dark:text-yellow-300";
            countColor = "text-yellow-700 dark:text-yellow-200";
          } else if (status === t("suda.home.tunnels")) {
            bgGradient =
              "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20";
            borderColor = "border-green-200/50 dark:border-green-700/30";
            dotColor = "bg-green-500";
            badgeText = "ТНЛ";
            textColor = "text-green-600 dark:text-green-300";
            countColor = "text-green-700 dark:text-green-200";
          } else if (status === t("suda.home.republican")) {
            bgGradient =
              "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20";
            borderColor = "border-red-200/50 dark:border-red-700/30";
            dotColor = "bg-red-500";
            badgeText = "РСП";
            textColor = "text-red-600 dark:text-red-300";
            countColor = "text-red-700 dark:text-red-200";
          } else if (status === t("suda.home.bridges")) {
            bgGradient =
              "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20";
            borderColor = "border-purple-200/50 dark:border-purple-700/30";
            dotColor = "bg-purple-500";
            badgeText = "МСТ";
            textColor = "text-purple-600 dark:text-purple-300";
            countColor = "text-purple-700 dark:text-purple-200";
          }

          return (
            <div
              key={status}
              className={`${bgGradient} p-4 rounded-xl border ${borderColor} transition-all hover:scale-105 hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-2 h-2 ${dotColor} rounded-full`}></div>
                <div className={`text-xs font-medium ${textColor}`}>
                  {badgeText}
                </div>
              </div>
              <p className={`text-sm font-medium capitalize ${textColor}`}>
                {status}
              </p>
              <p className={`text-2xl font-bold ${countColor}`}>
                {count.toLocaleString()}{" "}
                {status === t("suda.home.tunnels") || status === t("suda.home.bridges") ? "шт" : "км"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
