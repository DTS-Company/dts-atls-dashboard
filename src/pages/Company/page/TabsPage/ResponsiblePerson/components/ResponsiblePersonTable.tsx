import { useState } from "react";
import { useParams } from "react-router";
import { skipToken } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import { TablePagination } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";

import {
  useDeleteResponsiblePersonMutation,
  useGetAllResponsiblePersonQuery,
  useUpdateResponsiblePersonMutation,
  useUpdateSigningAuthorityMutation,
} from "../api/api";
import { usePermissions } from "@permissions/usePermissions";
import { useModal } from "@hooks/useModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Modal } from "@components/ui/modal";
import Label from "@components/form/Label";
import Select from "@components/form/Select";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import { useLocalization } from "@hooks/useLocalization";

const ResponsiblePersonTable = () => {
  const { id } = useParams();
  const entityId = String(id);
  const { data: responsiblePerson = [] } = useGetAllResponsiblePersonQuery(
    entityId ? { entityId } : skipToken
  );
  const { t } = useLocalization();

  const [updateResponsiblePerson] = useUpdateResponsiblePersonMutation();
  const [deleteResponsiblePerson] = useDeleteResponsiblePersonMutation();
  const [updateSigningAuthority] = useUpdateSigningAuthorityMutation();

  const { hasPermission } = usePermissions();
  const canDeleteResponsiblePerson = hasPermission({
    name: "responsibleperson",
    path: "/api/v1/{entityId}/responsibleperson/{id}",
    method: "DELETE",
  });

  const {
    isOpen: isEditModalOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();
  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const [editId, setEditId] = useState("");
  const [editType, setEditType] = useState("");
  const [editFullName, setEditFullName] = useState("");
  const [personToDelete, setPersonToDelete] = useState<{
    id: string;
    fullName: string;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalCount = responsiblePerson.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPersons = responsiblePerson.slice(startIndex, endIndex);

  const getGlobalIndex = (localIndex: number) => {
    return startIndex + localIndex + 1;
  };

  const personTypeOptions = [
    {
      label: t("subject.company.responsible_person_page.gen_director"),
      value: t("subject.company.responsible_person_page.gen_director"),
    },
    {
      label: t("subject.company.responsible_person_page.director"),
      value: t("subject.company.responsible_person_page.director"),
    },
    {
      label: t("subject.company.responsible_person_page.accountant"),
      value: t("subject.company.responsible_person_page.accountant"),
    },
  ];

  const openModalEdit = (id: string, type: string, fullName: string) => {
    setEditId(id);
    setEditType(type);
    setEditFullName(fullName);
    openEditModal();
  };

  const handleConfirmDelete = async () => {
    if (!personToDelete) return;
    try {
      await deleteResponsiblePerson({
        entityId,
        id: personToDelete.id,
      }).unwrap();
      toast.success("Ответственное лицо успешно удалено!");
      closeDeleteModal();

      const newTotalCount = totalCount - 1;
      const maxPage = Math.ceil(newTotalCount / itemsPerPage);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage);
      }
    } catch {
      toast.error("⚠️ Не удалось удалить ответственное лицо.");
    }
  };

  const handleSave = async () => {
    try {
      await updateResponsiblePerson({
        entityId,
        id: editId,
        data: { type: editType, fullName: editFullName },
      }).unwrap();
      toast.success("Данные ответственного лица успешно обновлены!");
      closeEditModal();
    } catch {
      toast.error("⚠️ Не удалось изменить данные ответственного лица.");
    }
  };

  const handleSetSigningAuthority = async (id: string) => {
    try {
      await updateSigningAuthority({ entityId, id }).unwrap();
      toast.success("Основное ответственное лицо обновлено!");
    } catch {
      toast.error("⚠️ Не удалось обновить статус банка по умолчанию.");
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-6">
        <Table className="w-full">
          <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
            <TableRow className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
              <TableCell
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                isHeader
              >
                №
              </TableCell>
              <TableCell
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
                isHeader
              >
                {t("subject.company.responsible_person_table.type")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
              >
                {t(
                  "subject.company.responsible_person_table.responsible_person"
                )}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
              >
                {t("subject.company.responsible_person_table.inn")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-end text-theme-xs dark:text-gray-300"
              >
                {t("subject.company.responsible_person_table.choose")}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-600 text-end text-theme-xs dark:text-gray-300"
              >
                {t("subject.company.responsible_person_table.actions")}
              </TableCell>
            </TableRow>
          </TableHeader>

          {paginatedPersons.length > 0 ? (
            <TableBody>
              {paginatedPersons.map((person, index) => (
                <TableRow
                  className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
                  key={person.id}
                >
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {getGlobalIndex(index)}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {person.type}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {person.fullName}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {person.tin}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-end">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      <Button
                        onClick={() => handleSetSigningAuthority(person.id)}
                        className={`${person.signingAuthority
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                          } py-1 px-4 rounded-lg`}
                      >
                        {person.signingAuthority
                          ? t("subject.company.responsible_person_table.main")
                          : t(
                            "subject.company.responsible_person_table.choose"
                          )}
                      </Button>
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2 justify-end">
                      <Pencil
                        onClick={() =>
                          openModalEdit(person.id, person.type, person.fullName)
                        }
                        className="w-5 h-5 cursor-pointer hover:text-blue-500"
                      />
                      {canDeleteResponsiblePerson && (
                        <Trash2
                          onClick={() => {
                            setPersonToDelete({
                              id: person.id,
                              fullName: person.fullName,
                            });
                            openDeleteModal();
                          }}
                          className="w-6 h-6 cursor-pointer hover:text-red-500"
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <p className="p-5 sm:px-6 text-gray-500">
              {t("subject.company.responsible_person_table.nodata")}
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
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        className="max-w-[550px]"
      >
        <div className="p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-2xl font-semibold dark:text-gray-400">
            {t("subject.company.responsible_person_table.modal_edit_title")}
          </h4>
          <form className="flex flex-col space-y-4">
            <div>
              <Label>
                {t("subject.company.responsible_person_table.type")}
              </Label>
              <Select
                value={editType}
                onChange={setEditType}
                options={[
                  {
                    label: t(
                      "subject.company.responsible_person_table.choose_type"
                    ),
                    value: "",
                  },
                  ...personTypeOptions,
                ]}
              />
            </div>
            <div>
              <Label>
                {t(
                  "subject.company.responsible_person_table.responsible_person"
                )}
              </Label>
              <Input
                type="text"
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeEditModal}>
                {t("subject.company.employees_form.cancel")}
              </Button>
              <Button onClick={handleSave}>
                {t("subject.company.bank_details_page.save")}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        className="max-w-[550px]"
      >
        <div className="p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-2xl font-semibold dark:text-gray-400">
            {t("subject.company.responsible_person_table.delete_header")}
          </h4>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {t("subject.company.responsible_person_table.delete_confirm")}
            {" "}
            <strong>{personToDelete?.fullName}</strong>?{t("subject.company.responsible_person_table.delete_text")}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeDeleteModal}>
              {t("subject.company.responsible_person_table.cancel")}
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-700"
              onClick={handleConfirmDelete}
            >
              {t("subject.company.responsible_person_table.delete")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ResponsiblePersonTable;
