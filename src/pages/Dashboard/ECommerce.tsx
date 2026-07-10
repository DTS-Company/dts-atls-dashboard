import PageMeta from "@components/common/PageMeta";
// import ApplicationsType from "@components/ecommerce/ApplicationsType";
// import CommonStatistics from "@components/ecommerce/CommonStatistics";
// import DozvolStatsChart from "@components/ecommerce/DozvolStatsChart";
// import EcommerceMetrics from "@components/ecommerce/EcommerceMetrics";
// import MonthlyTarget from "@components/ecommerce/MonthlyTarget";
import { useLocalization } from "@hooks/useLocalization";
// import StatisticsChart from "@components/ecommerce/StatisticsChart";

export default function Ecommerce() {
  const { t } = useLocalization();
  return (
    <>
      <PageMeta title={t("sidebar.main")} description="" />
      <div>{/* <EcommerceMetrics /> */}</div>
      {/* <div className="grid sm:grid-cols-3 mt-[3%] grid-cols-1 gap-6">
        <DozvolStatsChart />
        <MonthlyTarget />
        <ApplicationsType />
      </div> */}
      <div>
        HOME PAGE!
        {/* <CommonStatistics /> */}
      </div>
    </>
  );
}
