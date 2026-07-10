import { useState } from "react";
import { useParams } from "react-router";
import { skipToken } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import { TablePagination } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";

import {
  useDeleteBankDetailsMutation,
  useGetAllBankDetailsQuery,
  useUpdateBankDetailsMutation,
  useUpdateDefaultBankMutation,
} from "../api/api";
import { useModal } from "@hooks/useModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import Button from "@components/ui/button/Button";
import { Modal } from "@components/ui/modal";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import { useLocalization } from "@hooks/useLocalization";

const BankDetailsTable = () => {
  const { id } = useParams();
  const entityId = String(id);
  const { t } = useLocalization();

  const { data: bankdetails = [] } = useGetAllBankDetailsQuery(
    entityId ? { entityId } : skipToken
  );

  const [updateBankDetails] = useUpdateBankDetailsMutation();
  const [deleteBankDetails] = useDeleteBankDetailsMutation();
  const [updateDefaultBank] = useUpdateDefaultBankMutation();

  const { isOpen, openModal, closeModal } = useModal();

  const [editFormData, setEditFormData] = useState({
    id: "",
    accountName: "",
    bankName: "",
    bikBank: "",
    korShot: "",
    racShot: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalCount = bankdetails.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBankDetails = bankdetails.slice(startIndex, endIndex);

  const openModalEdit = (bankdetail: typeof editFormData) => {
    setEditFormData(bankdetail);
    openModal();
  };

  const handleSave = async () => {
    try {
      await updateBankDetails({
        entityId,
        id: editFormData.id,
        data: {
          accountName: editFormData.accountName,
          bankName: editFormData.bankName,
          bikBank: editFormData.bikBank,
          korShot: editFormData.korShot,
          racShot: editFormData.racShot,
        },
      }).unwrap();
      toast.success("Данные успешно обновлены!");
      closeModal();
    } catch {
      toast.error("Ошибка при редактировании данных.");
    }
  };

  const handleSetDefaultBank = async (id: string) => {
    try {
      await updateDefaultBank({ entityId, id }).unwrap();
      toast.success("Банк установлен как основной!");
    } catch {
      toast.error("Ошибка при установке банка по умолчанию.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBankDetails({ entityId, id }).unwrap();
      toast.success("Банковские реквизиты удалены!");

      const newTotalCount = totalCount - 1;
      const maxPage = Math.ceil(newTotalCount / itemsPerPage);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage);
      }
    } catch {
      toast.error("Не удалось удалить банковские реквизиты.");
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
      <Table className="w-full">
        <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
          <TableRow className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            {[
              "№",
              t("subject.company.bank_details_page.account_name"),
              t("subject.company.bank_details_page.bank_name"),
              t("subject.company.bank_details_page.bik_bank"),
              t("subject.company.bank_details_page.kor_shot"),
              t("subject.company.bank_details_page.rac_shot"),
              t("subject.company.bank_details_table.main_shot"),
              t("subject.company.bank_details_table.actions"),
            ].map((title) => (
              <TableCell
                key={title}
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                isHeader
              >
                {title}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedBankDetails.length > 0 ? (
            paginatedBankDetails.map((bankdetail, index) => (
              <TableRow
                className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
                key={bankdetail.id}
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {bankdetail.accountName}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {bankdetail.bankName}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {bankdetail.bikBank}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {bankdetail.korShot}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {bankdetail.racShot}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <Button
                    onClick={() => handleSetDefaultBank(bankdetail.id)}
                    className={`${
                      bankdetail.defaultBank
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    } py-1 px-4 rounded-lg`}
                  >
                    {bankdetail.defaultBank
                      ? t("subject.company.bank_details_table.main")
                      : t("subject.company.bank_details_table.choose")}
                  </Button>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex gap-2 justify-start">
                    <Pencil
                      onClick={() => openModalEdit({ ...bankdetail })}
                      className="w-5 h-5 cursor-pointer hover:text-blue-500 transition"
                    />
                    <Trash2
                      onClick={() => handleDelete(bankdetail.id)}
                      className="w-6 h-6 cursor-pointer hover:text-red-500 transition"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <p className="p-5 sm:px-6 text-gray-500">
              {t("subject.company.bank_details_table.nodata")}
            </p>
          )}
        </TableBody>
      </Table>

      {totalCount > 0 && (
        <TablePagination
          className="table-pagination"
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={itemsPerPage}
          page={currentPage - 1}
          onPageChange={(_event, newPage) => setCurrentPage(newPage + 1)}
          onRowsPerPageChange={(event) => {
            const newSize = parseInt(event.target.value, 10);
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
          labelRowsPerPage={`${t("common.rows_per_page")}`}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} ${t("common.from_to")} ${count}`
          }
        />
      )}

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
        <div className="p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-2xl font-semibold dark:text-gray-400">
            {t("subject.company.bank_details_modal.title")}
          </h4>
          <form className="flex flex-col space-y-4">
            <div>
              <Label>
                {t("subject.company.bank_details_page.account_name")}
              </Label>
              <Input
                type="text"
                value={editFormData.accountName}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    accountName: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label>{t("subject.company.bank_details_page.bank_name")}</Label>
              <Input
                type="text"
                value={editFormData.bankName}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    bankName: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label>{t("subject.company.bank_details_page.bik_bank")}</Label>
              <Input
                type="text"
                value={editFormData.bikBank}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    bikBank: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label>{t("subject.company.bank_details_page.kor_shot")}</Label>
              <Input
                type="text"
                value={editFormData.korShot}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    korShot: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label>{t("subject.company.bank_details_page.rac_shot")}</Label>
              <Input
                type="text"
                value={editFormData.racShot}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    racShot: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeModal}>
                {t("subject.company.bank_details_page.cancel")}
              </Button>
              <Button onClick={handleSave}>
                {t("subject.company.bank_details_page.save")}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default BankDetailsTable;
