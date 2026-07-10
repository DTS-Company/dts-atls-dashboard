import { CircleCheck, CircleX, ShieldQuestion } from "lucide-react";

const STATUS_UI = {
  ACCEPTED: {
    label: "Принят",
    icon: CircleCheck,
    className:
      "bg-green-50 text-green-700 ring-green-200 " +
      "dark:bg-green-900/30 dark:text-green-300 dark:ring-green-800",
  },
  REJECTED: {
    label: "Отклонен",
    icon: CircleX,
    className:
      "bg-red-50 text-red-700 ring-red-200 " +
      "dark:bg-red-900/30 dark:text-red-300 dark:ring-red-800",
  },
  DEFAULT: {
    label: "На одобрении",
    icon: ShieldQuestion,
    className:
      "bg-gray-50 text-gray-700 ring-gray-200 " +
      "dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700",
  },
};

export const StatusBadge = ({ status }: { status?: string }) => {
  const ui =
    status === "ACCEPTED"
      ? STATUS_UI.ACCEPTED
      : status === "REJECTED"
        ? STATUS_UI.REJECTED
        : STATUS_UI.DEFAULT;

  const Icon = ui.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1
                  text-xs font-medium ring-1 transition
                  ${ui.className}`}
    >
      <Icon className="w-4 h-4" />
      {ui.label}
    </span>
  );
};
