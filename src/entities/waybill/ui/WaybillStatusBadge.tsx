import { useLocalization } from "@shared/lib/useLocalization";

// Цвет текста и мягкий фон метки статуса
const STATUS_STYLES: Record<string, string> = {
  DRAFT: "text-gray-500 bg-gray-100 dark:text-gray-300 dark:bg-white/[0.06]",
  IN_INSPECTION: "text-warning-600 bg-warning-50 dark:text-warning-400 dark:bg-warning-500/15",
  ADMITTED: "text-success-600 bg-success-50 dark:text-success-400 dark:bg-success-500/15",
  REJECTED: "text-error-600 bg-error-50 dark:text-error-400 dark:bg-error-500/15",
  CLOSED: "text-blue-light-600 bg-blue-light-50 dark:text-blue-light-400 dark:bg-blue-light-500/15",
  CANCELLED: "text-gray-600 bg-gray-200 dark:text-gray-300 dark:bg-white/10",
  APPROVED: "text-success-600 bg-success-50 dark:text-success-400 dark:bg-success-500/15",
};

/** Статус листа или результат осмотра (APPROVED / REJECTED): мягкая метка с точкой */
const WaybillStatusBadge = ({
  value,
  enumKey = "waybillStatus",
}: {
  value?: string | null;
  enumKey?: "waybillStatus" | "inspectionResult";
}) => {
  const { t } = useLocalization();
  if (!value) return <>—</>;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full py-0.5 pl-2 pr-2.5 text-[12px] font-bold ${
        STATUS_STYLES[value] ?? STATUS_STYLES.DRAFT
      }`}
    >
      <i
        className="h-1.5 w-1.5 rounded-full bg-current"
        style={{ boxShadow: "0 0 0 3px color-mix(in srgb, currentColor 22%, transparent)" }}
      />
      {t(`atls.enums.${enumKey}.${value}`)}
    </span>
  );
};

export default WaybillStatusBadge;
