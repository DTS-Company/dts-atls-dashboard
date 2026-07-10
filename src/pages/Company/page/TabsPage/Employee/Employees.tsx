import { useNavigate, useParams } from "react-router";
import {
  Truck,
  Settings,
  UserCheck,
  MonitorCog,
  RefreshCw,
} from "lucide-react";
import ComponentCard from "@components/common/ComponentCard";
import { useLocalization } from "@hooks/useLocalization";
import { useState } from "react";
import Button from "@components/ui/button/Button";
import { Modal } from "@components/ui/modal";
import {
  FailedTransport,
  SyncResult,
  useSynchronizeAllDoctorsMutation,
  useSynchronizeAllDriversMutation,
  useSynchronizeAllMechanicsMutation,
} from "@pages/Company/api/api";

interface ModalData {
  title: string;
  successCount: number;
  totalCount: number;
  failedList: Array<{ name: string; message: string }>;
}

const Employess = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const entityId = String(id);
  const { t } = useLocalization();

  const [syncingType, setSyncingType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const [synchronizeAllDrivers] = useSynchronizeAllDriversMutation();
  const [synchronizeAllMechanics] = useSynchronizeAllMechanicsMutation();
  const [synchronizeAllDoctors] = useSynchronizeAllDoctorsMutation();

  const employeeRoles = [
    {
      label: t("subject.company.employees_page.first_role"),
      type: "DRIVER",
      icon: Truck,
      iconColor: "text-success-500",
      bgColor: "bg-success-500/[0.08]",
      hasSync: true,
      syncEndpoint: "drivers",
    },
    {
      label: t("subject.company.employees_page.third_role"),
      type: "MECHANIC",
      icon: Settings,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/[0.08]",
      hasSync: true,
      syncEndpoint: "mechanics",
    },
    {
      label: t("subject.company.employees_page.fourth_role"),
      type: "DOCTOR",
      icon: UserCheck,
      iconColor: "text-pink-500",
      bgColor: "bg-pink-500/[0.08]",
      hasSync: true,
      syncEndpoint: "doctors",
    },
    {
      label: t("subject.company.employees_page.second_role"),
      type: "DISPATCHER",
      icon: MonitorCog,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-500/[0.08]",
      hasSync: false,
      syncEndpoint: null,
    },
  ];

  const allSyncItems = [...employeeRoles];

  const handleNavigation = (type: string) => {
    if (syncingType) return;
    if (type === "TRANSPORT") {
      navigate(`/transport/${entityId}`);
    } else {
      navigate(`/employessForm/${entityId}/${type}`);
    }
  };

  const handleSync = async (
    e: React.MouseEvent,
    employeeType: string,
    syncEndpoint: string,
  ) => {
    e.stopPropagation();
    if (syncingType) return;

    setSyncingType(employeeType);

    try {
      let result: SyncResult;
      let title = "";

      switch (syncEndpoint) {
        case "drivers":
          result = await synchronizeAllDrivers(entityId).unwrap();
          title = "Синхронизация водителей";
          break;
        case "mechanics":
          result = await synchronizeAllMechanics(entityId).unwrap();
          title = "Синхронизация механиков";
          break;
        case "doctors":
          result = await synchronizeAllDoctors(entityId).unwrap();
          title = "Синхронизация врачей";
          break;
        default:
          return;
      }

      const failedList: Array<{ name: string; message: string }> = [];

      if (result.failedTransports && result.failedTransports.length > 0) {
        result.failedTransports.forEach((transport: FailedTransport) => {
          failedList.push({
            name: transport.registrationNumber || transport.transportId,
            message: transport.message,
          });
        });
      }

      if (result.failedDrivers && result.failedDrivers.length > 0) {
        result.failedDrivers.forEach((driver: any) => {
          failedList.push({
            name:
              driver.driverName ||
              driver.employeeName ||
              driver.name ||
              driver.employeeId ||
              "Неизвестный водитель",
            message: driver.message,
          });
        });
      }

      if (result.failedEmployees && result.failedEmployees.length > 0) {
        result.failedEmployees.forEach((employee: any) => {
          failedList.push({
            name:
              employee.employeeName ||
              employee.name ||
              employee.mechanicName ||
              employee.doctorName ||
              employee.employeeId ||
              "Неизвестный сотрудник",
            message: employee.message,
          });
        });
      }

      setModalData({
        title,
        successCount: result.successSynchronize,
        totalCount: result.allSynchronize,
        failedList,
      });
      setIsModalOpen(true);
    } catch (error: any) {
      console.error("Sync error:", error);

      if (error?.status === 400 && error?.data) {
        console.log(
          "Full error response:",
          JSON.stringify(error.data, null, 2),
        );
      }

      if (error?.status === 400 && error?.data) {
        const errorData = error.data;
        const failedList: Array<{ name: string; message: string }> = [];

        if (
          errorData.failedTransports &&
          errorData.failedTransports.length > 0
        ) {
          errorData.failedTransports.forEach((transport: FailedTransport) => {
            failedList.push({
              name: transport.registrationNumber || transport.transportId,
              message: transport.message,
            });
          });
        }

        if (errorData.failedDrivers && errorData.failedDrivers.length > 0) {
          errorData.failedDrivers.forEach((driver: any) => {
            failedList.push({
              name:
                driver.driverName ||
                driver.employeeName ||
                driver.name ||
                driver.employeeId ||
                "Неизвестный водитель",
              message: driver.message,
            });
          });
        }

        if (errorData.failedEmployees && errorData.failedEmployees.length > 0) {
          errorData.failedEmployees.forEach((employee: any) => {
            failedList.push({
              name:
                employee.employeeName ||
                employee.name ||
                employee.mechanicName ||
                employee.doctorName ||
                employee.employeeId ||
                "Неизвестный сотрудник",
              message: employee.message,
            });
          });
        }

        setModalData({
          title: errorData.title || "Результат синхронизации",
          successCount: errorData.successSynchronize || 0,
          totalCount: errorData.allSynchronize || 0,
          failedList,
        });
        setIsModalOpen(true);
      } else if (error?.status === 404) {
        setModalData({
          title: "Ошибка",
          successCount: 0,
          totalCount: 0,
          failedList: [{ name: "Компания", message: "Компания не найдена" }],
        });
        setIsModalOpen(true);
      } else if (error?.status === 409) {
        setModalData({
          title: "Ошибка",
          successCount: 0,
          totalCount: 0,
          failedList: [
            { name: "Конфликт", message: "Конфликт данных при синхронизации" },
          ],
        });
        setIsModalOpen(true);
      } else {
        setModalData({
          title: "Ошибка",
          successCount: 0,
          totalCount: 0,
          failedList: [
            {
              name: "Ошибка",
              message: error?.data?.message || "Ошибка при синхронизации",
            },
          ],
        });
        setIsModalOpen(true);
      }
    } finally {
      setSyncingType(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  return (
    <>
      {syncingType && (
        <div className="fixed inset-0 flex items-center justify-center z-9999 bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 p-8 bg-white shadow-2xl dark:bg-gray-800 rounded-2xl">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full dark:border-gray-700"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 rounded-full border-brand-500 animate-spin border-t-transparent"></div>
            </div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Синхронизация...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {syncingType === "DRIVER" && "Синхронизация водителей"}
              {syncingType === "MECHANIC" && "Синхронизация механиков"}
              {syncingType === "DOCTOR" && "Синхронизация врачей"}
              {syncingType === "TRANSPORT" && "Синхронизация транспорта"}
            </p>
          </div>
        </div>
      )}

      <ComponentCard title={t("subject.company.employees_page.title")}>
        <h1 className="text-center p-4 sm:text-[38px] dark:text-gray-200">
          {t("subject.company.employees_page.title")}
        </h1>

        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allSyncItems.map(
            ({
              label,
              type,
              icon: Icon,
              iconColor,
              bgColor,
              hasSync,
              syncEndpoint,
            }) => (
              <div
                key={type}
                className={`group relative w-full min-h-[130px] rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 ${
                  syncingType ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <button
                  onClick={() => handleNavigation(type)}
                  className="w-full h-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-xl"
                  disabled={!!syncingType}
                >
                  <div className="flex flex-col items-start w-full gap-3 p-4">
                    <div
                      className={`flex p-4 items-center justify-center rounded-xl ${bgColor} ${iconColor} group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon size={22} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {label}
                      </h4>
                    </div>
                  </div>
                </button>

                {hasSync && syncEndpoint && (
                  <button
                    onClick={(e) => handleSync(e, type, syncEndpoint)}
                    disabled={syncingType === type}
                    className={`absolute top-2 flex items-center gap-2 bg-gray-100 dark:bg-gray-600 right-2 p-1.5 sm:p-2 h-auto min-w-0 rounded-lg text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      syncingType === type
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <span className="mr-1 text-xs">Синхронизация</span>
                    <RefreshCw
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        syncingType === type ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
            ),
          )}
        </div>
      </ComponentCard>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="max-w-[500px] max-h-[550px]"
      >
        <div className="p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-2xl font-semibold dark:text-gray-200">
            {modalData?.title || "Результат синхронизации"}
          </h4>

          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-300">
              Синхронизировано: <strong>{modalData?.successCount ?? 0}</strong>{" "}
              из <strong>{modalData?.totalCount ?? 0}</strong>
            </p>

            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
              {modalData?.failedList && modalData.failedList.length > 0 && (
                <>
                  <p className="font-medium text-red-500 dark:text-red-400">
                    Ошибки синхронизации ({modalData.failedList.length}):
                  </p>
                 
                  {modalData.failedList.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800"
                    >
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>

            {modalData?.totalCount === 0 && (
              <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                Нет данных для синхронизации
              </p>
            )}

            {modalData &&
              modalData.successCount === modalData.totalCount &&
              modalData.totalCount > 0 && (
                <div className="p-3 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                  <p className="text-sm text-center text-green-600 dark:text-green-400">
                    ✅ Все данные успешно синхронизированы!
                  </p>
                </div>
              )}
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={closeModal}>Понятно</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Employess;
