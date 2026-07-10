import React from "react";
import { Car, Landmark, Factory, Fuel, CarFront } from "lucide-react";
import { useGetAllTransportsQuery } from "@pages/Transport/api/api";
import { Link } from "react-router-dom";
import { useLocalization } from "@hooks/useLocalization";

interface StatisticItem {
  id: number;
  title: string;
  value: string;
  IconComponent: React.ElementType;
  loading: boolean;
}

const CommonStatistics = () => {
  const { t } = useLocalization();
  const { data: transportData, isLoading: transportLoading } =
    useGetAllTransportsQuery({
      page: 1,
      size: 30,
    });
  const count = transportData?.meta?.totalCount || 0;

  const statisticsData: StatisticItem[] = [
    {
      id: 1,
      title: t("mainpage.commonStatistics.roads"),
      value: "14314.3",
      IconComponent: Car,
      loading: transportLoading,
    },
    {
      id: 2,
      title: t("mainpage.commonStatistics.structures"),
      value: "0",
      IconComponent: Landmark,
      loading: transportLoading,
    },
    {
      id: 3,
      title: t("mainpage.commonStatistics.transports"),
      value: `${count}`,
      IconComponent: CarFront,
      loading: transportLoading,
    },
    {
      id: 4,
      title: t("mainpage.commonStatistics.ptk"),
      value: "0",
      IconComponent: Factory,
      loading: transportLoading,
    },
    {
      id: 5,
      title: t("mainpage.commonStatistics.roadService"),
      value: "0",
      IconComponent: Fuel,
      loading: transportLoading,
    },
  ];

  return (
    <div className="grid sm:grid-cols-5 grid-cols-2 justify-between gap-4 pt-10">
      {statisticsData.map((item) => {
        const content = (
          <div
            key={item.id}
            className="flex flex-col justify-between sm:w-[280px] w-auto h-[160px] p-5 text-center rounded-xl border border-gray-200 bg-white items-center dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex justify-center items-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-md">
              <item.IconComponent
                size={28}
                className="text-gray-700 dark:text-gray-300"
              />
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-400 leading-tight">
              {item.title}
            </p>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-300">
              {item.loading ? (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full" />
              ) : (
                item.value
              )}
            </h3>
          </div>
        );

        if (item.id === 3) {
          return (
            <Link to="/transport/TRANSPORT" key={item.id}>
              {content}
            </Link>
          );
        }

        return content;
      })}
    </div>
  );
};

export default CommonStatistics;
