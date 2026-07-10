import { useState } from "react";
import { useParams } from "react-router";
import { skipToken } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import { TablePagination } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";

import {
  useDeleteContactMutation,
  useGetAllContactsQuery,
  useUpdateContactMutation,
  useUpdateDefaultContactMutation,
} from "../api/api";
import { useModal } from "@hooks/useModal";
import { useLocalization } from "@hooks/useLocalization";

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
import Select from "@components/form/Select";
import Input from "@components/form/input/InputField";

const validate = {
  E_MAIL: (v: string) => /\S+@\S+\.\S+/.test(v),
  PHONE_NUMBER: (v: string) => /^\+?[0-9\s\-()]{7,}$/.test(v),
  FAX: (v: string) => /^\+?[0-9\s\-()]{7,}$/.test(v),
  WEB_SITE: (v: string) => {
    try {
      new URL(v);
      return true;
    } catch {
      return false;
    }
  },
  POSTCODE: (v: string) => /^\d{5,10}$/.test(v),
};

const ContactTable = () => {
  const { id } = useParams();
  const entityId = String(id);

  const { data: contacts = [] } = useGetAllContactsQuery(
    entityId ? { entityId } : skipToken
  );
  const { t } = useLocalization();

  const [updateContact] = useUpdateContactMutation();
  const [deleteContact] = useDeleteContactMutation();
  const [updateDefaultContact] = useUpdateDefaultContactMutation();
  const { isOpen, openModal, closeModal } = useModal();

  const [editForm, setEditForm] = useState({ id: "", type: "", contact: "" });
  const [errors, setErrors] = useState<{ type?: string; contact?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalCount = contacts.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContacts = contacts.slice(startIndex, endIndex);

  const contactTypeLabels: Record<string, string> = {
    PHONE_NUMBER: t("subject.individual.contacts_page.type_phone_number"),
    E_MAIL: t("subject.individual.contacts_page.type_e_mail"),
    WEB_SITE: t("subject.individual.contacts_page.type_web_site"),
    POSTCODE: t("subject.individual.contacts_page.type_postcode"),
    FAX: t("subject.individual.contacts_page.type_fax"),
  };
  const contactTypeOptions = Object.entries(contactTypeLabels).map(
    ([value, label]) => ({ value, label })
  );

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteContact({ entityId, id: deleteId }).unwrap();
      toast.success("Контакт удалён!");
      const newTotalCount = totalCount - 1;
      const maxPage = Math.ceil(newTotalCount / itemsPerPage);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage);
      }
    } catch {
      toast.error("Ошибка при удалении контакта");
    } finally {
      setDeleteId(null);
      setDeleteModalOpen(false);
    }
  };

  const openModalEdit = (id: string, type: string, contact: string) => {
    setEditForm({ id, type, contact });
    setErrors({});
    openModal();
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!editForm.type.trim())
      newErrors.type = t(
        "subject.individual.contacts_page.validation_type_required"
      );
    if (!editForm.contact.trim())
      newErrors.contact = t(
        "subject.individual.contacts_page.validation_contact_required"
      );
    else if (
      editForm.type &&
      !validate[editForm.type as keyof typeof validate]?.(
        editForm.contact.trim()
      )
    ) {
      newErrors.contact = `${t(
        "subject.individual.contacts_page.validation_contact_invalid"
      )} ${contactTypeLabels[editForm.type as keyof typeof contactTypeLabels]}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await updateContact({
        entityId,
        id: editForm.id,
        data: { type: editForm.type, contact: editForm.contact },
      }).unwrap();
      toast.success("Контакт обновлён!");
      closeModal();
    } catch {
      toast.error("Ошибка при обновлении контакта");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefaultContact = async (id: string, type: string) => {
    try {
      await updateDefaultContact({ entityId, id, type }).unwrap();
      toast.success("Контакт установлен как основной!");
    } catch {
      toast.error("Ошибка при установке контакта по умолчанию");
    }
  };

  const getGlobalIndex = (localIndex: number) => {
    return startIndex + localIndex + 1;
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
        <Table className="w-full">
          <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
            <TableRow className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
              >
                №
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
              >
                {t("subject.individual.contacts_page.table_type")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
              >
                {t("subject.individual.contacts_page.table_phone")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
              >
                {t("subject.individual.contacts_page.table_select")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-end text-theme-xs dark:text-gray-300"
              >
                {t("subject.individual.contacts_page.table_actions")}
              </TableCell>
            </TableRow>
          </TableHeader>
          {paginatedContacts.length > 0 ? (
            <TableBody>
              {paginatedContacts.map((c, index) => (
                <TableRow
                  key={c.id}
                  className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {getGlobalIndex(index)}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {contactTypeLabels[c.type] || c.type}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {c.contact}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <Button
                      onClick={() => handleSetDefaultContact(c.id, c.type)}
                      className={`${
                        c.defaultContact
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-white/80"
                      } py-1 px-4 rounded-lg`}
                    >
                      {c.defaultContact ? "Основной" : "Выбрать"}
                    </Button>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2 justify-end">
                      <Pencil
                        onClick={() => openModalEdit(c.id, c.type, c.contact)}
                        className="w-6 h-6 cursor-pointer hover:text-blue-500"
                      />
                      <Trash2
                        onClick={() => openDeleteModal(c.id)}
                        className="w-6 h-6 cursor-pointer hover:text-red-500"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <p className="p-5 text-gray-500 dark:text-gray-400 py-4">
              {t("subject.individual.contacts_page.nodata")}
            </p>
          )}
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

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          className="max-w-[400px]"
        >
          <div className="p-6 bg-white rounded-3xl dark:bg-gray-900">
            <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
              {t("subject.individual.contacts_page.modal_delete_title")}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t("subject.individual.contacts_page.modal_delete_text")}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                className="bg-red-600 hover:bg-red-500"
                variant="primary"
                onClick={handleConfirmDelete}
              >
                {t("subject.individual.contacts_page.btn_delete")}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
              >
                {t("subject.individual.contacts_page.btn_cancel")}
              </Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
          <div className="p-6 bg-white rounded-3xl dark:bg-gray-900">
            <h4 className="mb-4 text-2xl font-semibold dark:text-gray-400">
              {t("subject.individual.contacts_page.modal_edit_title")}
            </h4>
            <form onSubmit={handleSave} className="flex flex-col space-y-4">
              <div>
                <Label>
                  {t("subject.individual.contacts_page.form_type_label")}
                </Label>
                <Select
                  value={editForm.type}
                  onChange={(value) =>
                    setEditForm((prev) => ({ ...prev, type: value }))
                  }
                  options={[
                    {
                      label: t(
                        "subject.individual.contacts_page.form_select_type"
                      ),
                      value: "",
                    },
                    ...contactTypeOptions,
                  ]}
                />
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>
              <div>
                <Label>
                  {t("subject.individual.contacts_page.form_contact_label")}
                </Label>
                <Input
                  type="text"
                  value={editForm.contact}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      contact: e.target.value,
                    }))
                  }
                  error={!!errors.contact}
                />
                {errors.contact && (
                  <p className="mt-1 text-sm text-red-600">{errors.contact}</p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={closeModal}>
                  {t("subject.individual.contacts_page.btn_cancel")}
                </Button>
                <Button disabled={isSubmitting}>
                  {isSubmitting
                    ? t("subject.individual.contacts_page.btn_saving")
                    : t("subject.individual.contacts_page.btn_save")}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ContactTable;
