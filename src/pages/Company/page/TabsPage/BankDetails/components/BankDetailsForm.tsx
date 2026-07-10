import { useModal } from "@hooks/useModal";
import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { useCreateBankDetailsMutation } from "../api/api";
import Button from "@components/ui/button/Button";
import { Modal } from "@components/ui/modal";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import { useLocalization } from "@hooks/useLocalization";

const BankDetailsForm = () => {
  const { id } = useParams();
  const entityId = String(id);
  const {t} = useLocalization()

  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState({
    accountName: "",
    bankName: "",
    bikBank: "",
    korShot: "",
    racShot: "",
  });

  const [addBankDetails] = useCreateBankDetailsMutation();

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await addBankDetails({
        entityId,
        data: formData,
      }).unwrap();

      setFormData({
        accountName: "",
        bankName: "",
        bikBank: "",
        korShot: "",
        racShot: "",
      });

      closeModal();
      toast.success("Банковские реквизиты успешно добавлены!");
    } catch (error) {
      toast.error("Ошибка при добавлении банковских реквизитов.");
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openModal}>
          + {t("subject.company.bank_details_page.add")} 
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
        <div className="p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-2xl dark:text-gray-200 font-semibold">
            {t("subject.company.bank_details_page.add")} 
          </h4>
          <form className="flex flex-col space-y-4">
            <div>
              <Label>{t("subject.company.bank_details_page.account_name")}</Label>
              <Input
                type="text"
                value={formData.accountName}
                onChange={(e) => handleChange("accountName", e.target.value)}
              />
            </div>
            <div>
              <Label>{t("subject.company.bank_details_page.bank_name")}</Label>
              <Input
                type="text"
                value={formData.bankName}
                onChange={(e) => handleChange("bankName", e.target.value)}
              />
            </div>
            <div>
              <Label>{t("subject.company.bank_details_page.bik_bank")}</Label>
              <Input
                type="text"
                value={formData.bikBank}
                onChange={(e) => handleChange("bikBank", e.target.value)}
              />
            </div>
            <div>
              <Label>{t("subject.company.bank_details_page.kor_shot")}</Label>
              <Input
                type="text"
                value={formData.korShot}
                onChange={(e) => handleChange("korShot", e.target.value)}
              />
            </div>
            <div>
              <Label>{t("subject.company.bank_details_page.rac_shot")}</Label>
              <Input
                type="text"
                value={formData.racShot}
                onChange={(e) => handleChange("racShot", e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeModal}>
                {t("subject.company.bank_details_page.cancel")}
              </Button>
              <Button onClick={handleSubmit}>{t("subject.company.bank_details_page.save")}</Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default BankDetailsForm;
