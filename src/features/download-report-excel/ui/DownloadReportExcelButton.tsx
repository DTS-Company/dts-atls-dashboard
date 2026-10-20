import { toast } from "react-toastify";
import { Download } from "lucide-react";
import Button from "@shared/ui/button/Button";
import { useLocalization } from "@shared/lib/useLocalization";
import { getApiErrorMessage } from "@shared/lib/getApiErrorMessage";
import { TQueryParams } from "@shared/lib/cleanParams";
import { useDownloadAtlsReportExcelMutation } from "@entities/report";

type Props = {
  slug: string;
  params: TQueryParams;
  fileName: string;
  disabled?: boolean;
};

/** Кнопка «Скачать Excel»: тот же адрес отчёта с /excel, запрос с токеном */
const DownloadReportExcelButton = ({ slug, params, fileName, disabled }: Props) => {
  const { t } = useLocalization();
  const [downloadExcel, { isLoading }] = useDownloadAtlsReportExcelMutation();

  const handleDownload = async () => {
    try {
      await downloadExcel({ slug, params, fileName }).unwrap();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Button
      startIcon={<Download size={16} />}
      onClick={handleDownload}
      disabled={isLoading || disabled}
    >
      {isLoading ? t("atls.common.loading") : t("atls.reports.download_excel")}
    </Button>
  );
};

export default DownloadReportExcelButton;
