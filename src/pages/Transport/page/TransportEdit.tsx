import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { ChevronRight } from "lucide-react";
import {
  useGetTransportByIdQuery,
  useUpdateTransportMutation,
} from "../api/api";
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import ComponentCard from "@components/common/ComponentCard";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import { useLocalization } from "@hooks/useLocalization";
import TabsPage from "./TabsPage/TabsPage";

const TransportEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLocalization();

  const [licensePlate, setLicensePlate] = useState("");
  const [registrationCertificateSeries, setRegistrationCertificateSeries] =
    useState("");

  const { data: response, isLoading, isError } = useGetTransportByIdQuery(id!);
  const [updateTransport] = useUpdateTransportMutation();

  const transport = response?.content;

  useEffect(() => {
    if (transport) {
      setLicensePlate(transport.LicensePlate || "");
      setRegistrationCertificateSeries(
        transport.RegistrationCertificateSeries || "",
      );
    }
  }, [transport]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await updateTransport({
        id: id,
        LicensePlate: licensePlate,
        RegistrationCertificateSeries: registrationCertificateSeries,
      }).unwrap();
      toast.success("Транспорт успешно обновлен!");
      navigate("/transport");
    } catch (err) {
      toast.error("Ошибка при обновлении транспорта.");
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка загрузки данных</div>;
  if (!transport) return <div>Транспорт не найден</div>;

  return (
    <>
      <PageMeta title={t("transport_edit.title")} description="" />
      <PageBreadcrumb
        pageTitle={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Link
                to="/transport/TRANSPORT"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              >
                {t("transport_table.title")}
                <ChevronRight size={18} />
              </Link>
            </div>
            {`${t("transport_edit.title")}: ${
              transport.LicensePlate || t("transport_edit.error")
            }`}
          </div>
        }
      />
      <ComponentCard title={t("transport_edit.title")}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("transport_add.vin_code")}</Label>
              <Input
                value={transport.Vin || ""}
                type="text"
                placeholder={`${t("transport_add.vin_code")}`}
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.brand")}</Label>
              <Input
                value={transport.CarBrand || ""}
                type="text"
                placeholder={`${t("transport_add.brand")}`}
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.model")}</Label>
              <Input
                value={transport.CarModel || ""}
                type="text"
                placeholder={`${t("transport_add.model")}`}
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.type")}</Label>
              <Input
                value={transport.Type || ""}
                type="text"
                placeholder={`${t("transport_add.type")}`}
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.color")}</Label>
              <Input
                value={transport.Color || ""}
                type="text"
                placeholder={`${t("transport_add.color")}`}
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.year_of_manufacture")}</Label>
              <Input
                value={transport.YearOfManufacture || ""}
                type="text"
                placeholder={`${t("transport_add.year_of_manufacture")}`}
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.engine_capacity")}</Label>
              <Input
                value={transport.EngineCapacity || ""}
                type="text"
                placeholder={`${t("transport_add.engine_capacity")}`}
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.engine_type")}</Label>
              <Input
                value={transport.EngineType || ""}
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
                value={transport.RegistrationCertificateSeries || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.engine_power_hp")}</Label>
              <Input
                value={transport.EnginePowerHp || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.engine_power_kw")}</Label>
              <Input
                value={transport.engine_power_kw || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.max_weight_laden")}</Label>
              <Input
                value={transport.MaxWeightLaden || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.max_weight_unladen")}</Label>
              <Input
                value={transport.MaxWeightUnladen || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.number_of_seats")}</Label>
              <Input
                value={transport.NumberOfSeats || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.vehicle_passport")}</Label>
              <Input
                value={transport.VehiclePassport || ""}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>{t("transport_add.chassis_no")}</Label>
              <Input value={transport.ChassisNo || ""} type="text" disabled />
            </div>

            <div>
              <Label>{t("transport_add.body_type")}</Label>
              <Input value={transport.BodyType || ""} type="text" disabled />
            </div>

            <div>
              <Label>{t("transport_add.owner")}</Label>
              <Input value={transport.Owner || ""} type="text" disabled />
            </div>

            <div>
              <Label>{t("transport_add.phone")}</Label>
              <Input value={transport.Phone || ""} type="text" disabled />
            </div>

            <div>
              <Label>{t("transport_add.licence_plate")}</Label>
              <Input
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                type="text"
                disabled
              />
            </div>

            <div>
              <Label>
                {t("transport_add.registration_certificate_series")}
              </Label>
              <Input
                value={registrationCertificateSeries}
                onChange={(e) =>
                  setRegistrationCertificateSeries(e.target.value)
                }
                type="text"
                disabled
              />
            </div>
          </div>
          <Button className="w-full mt-4 sm:w-auto">
            {t("transport_add.save")}
          </Button>
        </form>
      </ComponentCard>
      <TabsPage />
    </>
  );
};

export default TransportEdit;
