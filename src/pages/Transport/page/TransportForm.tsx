import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import {
  useAddTransportMutation,
  useLazyCheckTransportByLicensePlateQuery,
  useLazyCheckTransportFromBridgeQuery,
} from "../api/api";
import { TTransport } from "../types/types";
import { useLocalization } from "@hooks/useLocalization";

const TransportForm = () => {
  const [licensePlate, setLicensePlate] = useState("");
  const [registrationCertificateSeries, setRegistrationCertificateSeries] =
    useState("");
  const [
    registrationCertificateIssueDate,
    setRegistrationCertificateIssueDate,
  ] = useState("");
  const [
    registrationCertificateIssuePlace,
    setRegistrationCertificateIssuePlace,
  ] = useState("");
  const [transportData, setTransportData] = useState<TTransport | null>(null);
  const [isLoadingTransport, setIsLoadingTransport] = useState(false);
  const [addTransport] = useAddTransportMutation();
  const [isSaving, setIsSaving] = useState(false);

  const [fetchTransportFromBridge] = useLazyCheckTransportFromBridgeQuery();
  const [checkTransportByLicensePlate] =
    useLazyCheckTransportByLicensePlateQuery();

  const { t } = useLocalization();

  const [licensePlateError, setLicensePlateError] = useState("");
  const [certificateSeriesError, setCertificateSeriesError] = useState("");

  const containsRussianLetters = (text: string): boolean => {
    const russianRegex = /[\u0400-\u04FF]/;
    return russianRegex.test(text);
  };

  const validateLatinOnly = (input: string, field: string): boolean => {
    if (containsRussianLetters(input)) {
      if (field === "licensePlate") {
        setLicensePlateError("Пожалуйста, введите номер на латинском языке");
      } else {
        setCertificateSeriesError(
          "Пожалуйста, введите серию на латинском языке",
        );
      }
      return false;
    }
    if (field === "licensePlate") {
      setLicensePlateError("");
    } else {
      setCertificateSeriesError("");
    }
    return true;
  };

  const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLicensePlate(value);
    if (value.trim() !== "") {
      validateLatinOnly(value, "licensePlate");
    } else {
      setLicensePlateError("");
    }
  };

  const handleCertificateSeriesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setRegistrationCertificateSeries(value);
    if (value.trim() !== "") {
      validateLatinOnly(value, "certificateSeries");
    } else {
      setCertificateSeriesError("");
    }
  };

  const formatDate = (dateObj: any): string => {
    if (!dateObj) return "";

    // If it's already a string, return it
    if (typeof dateObj === "string") return dateObj;

    // If it's an object with Day, Month, Year properties
    if (dateObj.Day && dateObj.Month && dateObj.Year) {
      return `${dateObj.Year}-${dateObj.Month.padStart(2, "0")}-${dateObj.Day.padStart(2, "0")}`;
    }

    return "";
  };

  const checkCarNumber = async (number: string) => {
    if (!number) return false;
    try {
      const result = await checkTransportByLicensePlate(number).unwrap();

      if (result) {
        toast.warning("Этот транспорт уже зарегистрирован в системе!");
        return false;
      }
      return true;
    } catch (error: any) {
      if (error.status === 404) {
        return true;
      } else if (error.status === 409) {
        toast.warning("Этот транспорт уже зарегистрирован в системе!");
        return false;
      }
      toast.error("Ошибка при проверке номера транспорта!");
      return false;
    }
  };

  const handleLoadTransport = async () => {
    const isLicensePlateValid =
      licensePlate.trim() === ""
        ? true
        : validateLatinOnly(licensePlate, "licensePlate");
    const isCertificateValid =
      registrationCertificateSeries.trim() === ""
        ? true
        : validateLatinOnly(registrationCertificateSeries, "certificateSeries");

    if (!licensePlate) {
      toast.warning("Пожалуйста, заполните номер транспортного средства");
      return;
    }

    if (!isLicensePlateValid || !isCertificateValid) {
      return;
    }

    const isNumberAvailable = await checkCarNumber(licensePlate);
    if (!isNumberAvailable) {
      return;
    }

    setIsLoadingTransport(true);
    try {
      const response = await fetchTransportFromBridge(licensePlate).unwrap();

      const transportDataFromApi = response.content;

      setTransportData(transportDataFromApi);
      setRegistrationCertificateSeries(
        transportDataFromApi.RegistrationCertificateSeries || "",
      );

      if (transportDataFromApi.RegistrationCertificateIssueDate) {
        setRegistrationCertificateIssueDate(
          formatDate(transportDataFromApi.RegistrationCertificateIssueDate),
        );
      }

      setRegistrationCertificateIssuePlace(
        transportDataFromApi.RegistrationCertificateIssuePlace || "",
      );

      toast.success("Данные транспорта успешно загружены!");
    } catch (err: any) {
      let errorMessage = "Не удалось загрузить данные транспорта";
      if (err.status === 401) {
        errorMessage = "Ошибка авторизации. Пожалуйста, войдите снова.";
      } else if (err.status === 404) {
        errorMessage = "Транспорт с таким номером не найден в базе ГИБДД";
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoadingTransport(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!transportData) {
      toast.warning("Пожалуйста, сначала загрузите данные транспорта!");
      return;
    }

    if (!registrationCertificateSeries) {
      toast.warning("Пожалуйста, укажите серию свидетельства о регистрации");
      return;
    }

    setIsSaving(true);

    const payload: TTransport = {
      id: "",
      LicensePlate: licensePlate,
      RegistrationCertificateSeries: registrationCertificateSeries,
      RegistrationCertificateIssueDate: registrationCertificateIssueDate,
      RegistrationCertificateIssuePlace: registrationCertificateIssuePlace,
      BodyNo: transportData.BodyNo || "",
      BodyType: transportData.BodyType || "",
      Vin: transportData.Vin || "",
      Color: transportData.Color || "",
      Type: transportData.Type || "",
      Owner: transportData.Owner || "",
      EngineCapacity: transportData.EngineCapacity || "",
      EnginePowerHp: transportData.EnginePowerHp || "",
      EnginePowerKw: transportData.EnginePowerKw || "",
      EngineType: transportData.EngineType || "",
      MaxWeightLaden: transportData.MaxWeightLaden || "",
      MaxWeightUnladen: transportData.MaxWeightUnladen || "",
      NumberOfSeats: transportData.NumberOfSeats || "",
      VehiclePassport: transportData.VehiclePassport || "",
      YearOfManufacture: transportData.YearOfManufacture || "",
      CarBrand: transportData.CarBrand || "",
      CarModel: transportData.CarModel || "",
      ChassisNo: transportData.ChassisNo || "",
      Phone: transportData.Phone || "",
    };

    try {
      await addTransport(payload).unwrap();
      toast.success("Транспорт успешно добавлен!");
      setTimeout(() => {
        handleReset();
      }, 2000);
    } catch (err: any) {
      let errorMessage = "❌ Ошибка при добавлении транспорта.";
      if (err.status === 409) {
        errorMessage = "❌ Транспорт с такими данными уже существует.";
      } else if (err.status === 401) {
        errorMessage = "❌ Ошибка авторизации. Пожалуйста, войдите снова.";
      } else if (err.data?.message) {
        errorMessage = `❌ ${err.data.message}`;
      }
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setLicensePlate("");
    setRegistrationCertificateSeries("");
    setRegistrationCertificateIssueDate("");
    setRegistrationCertificateIssuePlace("");
    setTransportData(null);
    setLicensePlateError("");
    setCertificateSeriesError("");
  };

  return (
    <>
      <PageBreadcrumb
        pageTitle={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Link
                to="/transport/TRANSPORT"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              >
                <span>{t("transport_table.title")}</span>
                <ChevronRight size={18} />
              </Link>
            </div>
            <span className="text-sm text-gray-800 dark:text-white/90">
              {t("transport_add.title")}
            </span>
          </div>
        }
      />
      <ComponentCard title={t("transport_add.title")}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Label>
                {t("transport_add.licence_plate")}{" "}
                <span className="text-red-500">*</span>{" "}
              </Label>
              <Input
                value={licensePlate}
                onChange={handleLicensePlateChange}
                type="text"
                placeholder={`${t("transport_add.licence_plate")}`}
                disabled={!!transportData}
                className={`${
                  licensePlateError ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {licensePlateError && (
                <p className="absolute mt-1 text-xs text-red-500 dark:text-red-400">
                  {licensePlateError}
                </p>
              )}
            </div>

            <div className="relative">
              <Label>
                {t("transport_add.registration_certificate_series")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                value={registrationCertificateSeries}
                onChange={handleCertificateSeriesChange}
                type="text"
                placeholder={`${t(
                  "transport_add.registration_certificate_series",
                )}`}
                disabled
                className={`${
                  certificateSeriesError
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
              />
              {certificateSeriesError && (
                <p className="absolute mt-1 text-xs text-red-500 dark:text-red-400">
                  {certificateSeriesError}
                </p>
              )}
            </div>

            {/* <div>
              <Label>
                {t("transport_add.registration_certificate_issue_date") ||
                  "Дата выдачи свидетельства"}
              </Label>
              <Input
                value={registrationCertificateIssueDate}
                type="text"
                placeholder="ГГГГ-ММ-ДД"
                disabled
              />
            </div> */}

            <div className="flex col-span-2 gap-2 mt-2">
              <div onClick={(e) => e.preventDefault()}>
                <Button
                  onClick={handleLoadTransport}
                  disabled={
                    !licensePlate ||
                    isLoadingTransport ||
                    !!transportData ||
                    !!licensePlateError ||
                    !!certificateSeriesError
                  }
                >
                  {isLoadingTransport
                    ? t("transport_add.loading")
                    : t("transport_add.load_transport_data")}
                </Button>
              </div>

              {transportData && (
                <div onClick={(e) => e.preventDefault()}>
                  <Button onClick={handleReset} variant="outline">
                    {t("transport_add.reset") || "Сбросить"}
                  </Button>
                </div>
              )}
            </div>

            <div>
              <Label>{t("transport_add.vin_code")}</Label>
              <Input
                value={transportData?.Vin || ""}
                type="text"
                placeholder={`${t("transport_add.vin_code")}`}
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.brand")}</Label>
              <Input
                value={transportData?.CarBrand || ""}
                type="text"
                placeholder={`${t("transport_add.brand")}`}
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.model")}</Label>
              <Input
                value={transportData?.CarModel || ""}
                type="text"
                placeholder={`${t("transport_add.model")}`}
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.type")}</Label>
              <Input
                value={transportData?.Type || ""}
                type="text"
                placeholder={`${t("transport_add.type")}`}
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.color")}</Label>
              <Input
                value={transportData?.Color || ""}
                type="text"
                placeholder={`${t("transport_add.color")}`}
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.year_of_manufacture")}</Label>
              <Input
                value={transportData?.YearOfManufacture || ""}
                type="text"
                placeholder={`${t("transport_add.year_of_manufacture")}`}
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.engine_capacity")}</Label>
              <Input
                value={transportData?.EngineCapacity || ""}
                type="text"
                placeholder={`${t("transport_add.engine_capacity")}`}
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.engine_type")}</Label>
              <Input
                value={transportData?.EngineType || ""}
                type="text"
                placeholder={`${t("transport_add.engine_type")}`}
                disabled
              />
            </div>

            <div>
              <Label>
                {t("transport_add.registration_certificate_issue_place")}
              </Label>
              <Input
                value={transportData?.RegistrationCertificateIssuePlace || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.engine_power_hp")}</Label>
              <Input
                value={transportData?.EnginePowerHp || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.engine_power_kw")}</Label>
              <Input
                value={transportData?.EnginePowerKw || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.max_weight_laden")}</Label>
              <Input
                value={transportData?.MaxWeightLaden || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.max_weight_unladen")}</Label>
              <Input
                value={transportData?.MaxWeightUnladen || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.number_of_seats")}</Label>
              <Input
                value={transportData?.NumberOfSeats || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.vehicle_passport")}</Label>
              <Input
                value={transportData?.VehiclePassport || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.chassis_no")}</Label>
              <Input
                value={transportData?.ChassisNo || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.body_type")}</Label>
              <Input
                value={transportData?.BodyType || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.owner")}</Label>
              <Input value={transportData?.Owner || ""} type="text" disabled />
            </div>

            <div>
              <Label>{t("transport_add.phone")}</Label>
              <Input value={transportData?.Phone || ""} type="text" disabled />
            </div>
            <div>
              <Label>
                {t("transport_add.registration_certificate_issue_place") ||
                  "Место выдачи свидетельства"}
              </Label>
              <Input
                value={registrationCertificateIssuePlace}
                type="text"
                placeholder="Место выдачи"
                disabled
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              className="w-full mt-4 sm:w-auto"
              disabled={
                !transportData || !registrationCertificateSeries || isSaving
              }
            >
              {isSaving ? t("transport_add.saving") : t("transport_add.save")}
            </Button>

            {transportData && (
              <div onClick={(e) => e.preventDefault()}>
                <Button
                  className="w-full mt-4 sm:w-auto"
                  onClick={handleReset}
                  variant="outline"
                  disabled={isSaving}
                >
                  {t("transport_add.reset") || "Сбросить"}
                </Button>
              </div>
            )}
          </div>
        </form>
      </ComponentCard>
    </>
  );
};

export default TransportForm;
