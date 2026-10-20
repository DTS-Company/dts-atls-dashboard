import { AlertTriangle, CheckCircle2, Clock, FileText, LucideIcon } from "lucide-react";
import { useLocalization } from "@shared/lib/useLocalization";
import { formatNumber } from "@shared/lib/atlsFormat";
import { useGetAtlsWaybillsQuery } from "@entities/waybill";

/** Сколько дней без закрытия считается просрочкой в карточке статистики */
export const OVERDUE_DAYS = "3";

export type TWaybillStatKey = "all" | "IN_INSPECTION" | "ADMITTED" | "overdue";

type TStat = {
  key: TWaybillStatKey;
  icon: LucideIcon;
  /** Градиент карточки и цветная тень */
  iconClass: string;
  params: { status?: string; openLongerThanDays?: string };
};

const STATS: TStat[] = [
  {
    key: "all",
    icon: FileText,
    iconClass: "bg-gradient-to-br from-[#6d5dfc] to-[#a46bff] shadow-[0_14px_30px_-12px_rgba(109,93,252,0.7)]",
    params: {},
  },
  {
    key: "IN_INSPECTION",
    icon: Clock,
    iconClass: "bg-gradient-to-br from-[#f59e0b] to-[#f97316] shadow-[0_14px_30px_-12px_rgba(245,120,11,0.6)]",
    params: { status: "IN_INSPECTION" },
  },
  {
    key: "ADMITTED",
    icon: CheckCircle2,
    iconClass: "bg-gradient-to-br from-[#10b981] to-[#06b6d4] shadow-[0_14px_30px_-12px_rgba(16,185,129,0.6)]",
    params: { status: "ADMITTED" },
  },
  {
    key: "overdue",
    icon: AlertTriangle,
    iconClass: "bg-gradient-to-br from-[#f43f5e] to-[#ec4899] shadow-[0_14px_30px_-12px_rgba(244,63,94,0.6)]",
    params: { openLongerThanDays: OVERDUE_DAYS },
  },
];

/** Одна карточка: число берётся из meta.totalCount запроса с size=1 */
const StatCard = ({
  stat,
  form,
  active,
  onSelect,
}: {
  stat: TStat;
  form: string;
  active: boolean;
  onSelect: (key: TWaybillStatKey) => void;
}) => {
  const { t } = useLocalization();
  const { data, isFetching } = useGetAtlsWaybillsQuery({
    form,
    ...stat.params,
    page: 0,
    size: 1,
  });
  const Icon = stat.icon;

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(stat.key)}
      className={`relative flex flex-col gap-1.5 overflow-hidden rounded-[18px] p-[18px] text-start text-white transition hover:-translate-y-[3px] ${stat.iconClass} ${
        active ? "outline outline-[3px] outline-offset-[3px] outline-brand-500/45" : ""
      }`}
    >
      {/* Декоративные круги */}
      <span className="pointer-events-none absolute -right-10 -top-12 h-[150px] w-[150px] rounded-full bg-white/[0.14]" />
      <span className="pointer-events-none absolute -bottom-[70px] right-[30px] h-[110px] w-[110px] rounded-full bg-white/10" />
      <span className="relative mb-1.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.22]">
        <Icon size={20} />
      </span>
      <span className="relative text-[13px] font-semibold opacity-90">
        {t(`atls.waybills.stats.${stat.key}`)}
      </span>
      <span className="relative text-[32px] font-extrabold leading-[1.05] tracking-[-0.03em] tabular-nums">
        {isFetching && !data ? "…" : formatNumber(data?.meta.totalCount ?? 0)}
      </span>
      <span className="relative text-[12px] opacity-85">
        {t(`atls.waybills.stats.${stat.key}_hint`, { days: OVERDUE_DAYS })}
      </span>
    </button>
  );
};

/** Карточки статистики над реестром; клик фильтрует таблицу */
const WaybillStats = ({
  form,
  active,
  onSelect,
}: {
  form: string;
  active: TWaybillStatKey | null;
  onSelect: (key: TWaybillStatKey) => void;
}) => (
  <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
    {STATS.map((stat) => (
      <StatCard
        key={stat.key}
        stat={stat}
        form={form}
        active={active === stat.key}
        onSelect={onSelect}
      />
    ))}
  </div>
);

export default WaybillStats;
