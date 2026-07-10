import PageMeta from "@components/common/PageMeta";
import SudaMainChart from "@components/ecommerce/SudaMainChart";
import { useLocalization } from "@hooks/useLocalization";

const SudaHome = () => {
  const { t } = useLocalization();
  return (
    <div>
      <PageMeta title={t("sidebar.suda.main")} description="" />
      <SudaMainChart />
    </div>
  );
};

export default SudaHome;
