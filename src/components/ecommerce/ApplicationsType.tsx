import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useLocalization } from "@hooks/useLocalization";

interface ApplicationsTypeProps {
  isDarkMode?: boolean;
}

const ApplicationsType = ({ isDarkMode = false }: ApplicationsTypeProps) => {
  const { t } = useLocalization();

  const chartSeries: number[] = [24, 8, 39, 13, 16];
  const chartLabels: string[] = [
    t("mainpage.applicationsType.licenses"),
    t("mainpage.applicationsType.eTIR"),
    t("mainpage.applicationsType.waybills"),
    t("mainpage.applicationsType.permits"),
    t("mainpage.applicationsType.certificates"),
  ];
  const customColors: string[] = [
    "#4B81F7",
    "#FF77AA",
    "#9966FF",
    "#FFB74D",
    "#4CAF50",
  ];

  const foregroundColor = isDarkMode ? "#1f2937" : "#FFFFFF";
  const dataLabelColor = isDarkMode ? ["#FF0000"] : ["#000000"];

  const chartOptions: ApexOptions = {
    chart: {
      type: "pie",
      height: 370,
    },
    labels: chartLabels,
    colors: customColors,
    stroke: {
      colors: [foregroundColor],
      width: 1,
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        const numericVal = typeof val === "number" ? val : 0;
        return numericVal.toFixed(0) + "%";
      },
      dropShadow: {
        enabled: false,
      },
      style: {
        colors: [dataLabelColor],
        fontSize: "12px",
      },
      textAnchor: "middle",
    },
    plotOptions: {
      pie: {
        dataLabels: {
          minAngleToShowLabel: 1,
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      markers: {
        size: 10,
        fillColors: customColors,
      },
      formatter: function (seriesName, opts) {
        const percentage = chartSeries[opts.seriesIndex];
        return `${seriesName} ${percentage}%`;
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    tooltip: {
      theme: isDarkMode ? "dark" : "light",
      style: {
        fontSize: "14px",
      },
      y: {
        formatter: function (val) {
          return val.toFixed(0) + "%";
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  return (
    <div className="card rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <h2 className="text-lg font-semibold dark:text-white/90 text-gray-800 mb-[10px] p-6">
        {t("mainpage.applicationsType.title")}
      </h2>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="pie"
        height={chartOptions.chart?.height}
      />
    </div>
  );
};

export default ApplicationsType;
