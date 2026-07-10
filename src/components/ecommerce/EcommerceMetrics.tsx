import { UsersRound } from "lucide-react";
import { useGetAllCompaniesQuery } from "../../pages/Company/api/api";
import { useGetAllEntrepeneursQuery } from "../../pages/Entrepreneur/api/api";
import { useGetIndividualsQuery } from "../../pages/Individual/api/api";
import { Link } from "react-router";
import { useLocalization } from "@hooks/useLocalization";

export default function EcommerceMetrics() {
  const { t } = useLocalization();

  const { data: companyData, isLoading: companyLoading } =
    useGetAllCompaniesQuery({
      page: 1,
      size: 30,
    });

  const { data: individualData, isLoading: individualLoading } =
    useGetIndividualsQuery({
      page: 1,
      limit: 30,
    });

  const { data: entrepreneurData, isLoading: entrepreneurLoading } =
    useGetAllEntrepeneursQuery({
      page: 1,
      size: 30,
    });

  const metrics = [
    {
      label: t("userType.individual"),
      count: individualData?.meta?.totalCount || 0,
      icon: <UsersRound className="text-gray-800 size-6 dark:text-white/90" />,
      link: "/registeredIndividuals/INDIVIDUAL",
      loading: individualLoading,
    },
    {
      label: t("userType.entrepreneur"),
      count: entrepreneurData?.meta?.totalCount || 0,
      icon: <UsersRound className="text-gray-800 size-6 dark:text-white/90" />,
      link: "/registeredentrepreneurs/ENTREPRENEUR",
      loading: entrepreneurLoading,
    },
    {
      label: t("userType.company"),
      count: companyData?.meta?.totalCount || 0,
      icon: <UsersRound className="text-gray-800 dark:text-white/90" />,
      link: "/registeredCompanies/COMPANY",
      loading: companyLoading,
    },
  ];

  return (
    <div className="grid sm:grid-cols-3 grid-cols-1 gap-3">
      {metrics.map((metric, idx) => (
        <Link
          to={`${metric.link}`}
          key={idx}
          className="rounded-2xl border border-gray-200 bg-white p-4 flex gap-4 items-center dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-xl dark:bg-gray-800">
            {metric.icon}
          </div>

          <div className="text-start">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {metric.label}
            </span>

            <h4 className="font-bold text-gray-800 text-2xl dark:text-white/90">
              {metric.loading ? (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full" />
              ) : (
                metric.count
              )}
            </h4>
          </div>
        </Link>
      ))}
    </div>
  );
}
