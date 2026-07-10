import { useState } from "react";
import {
  useDeleteTransportOwnerShipMutation,
  useEditTransportOwnerShipMutation,
  useGetTransportOwnerShipQuery,
} from "../api/api";
import { Pencil, Trash2 } from "lucide-react";
import { TablePagination } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Modal } from "@components/ui/modal";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import { useModal } from "@hooks/useModal";
import { toast } from "react-toastify";
import { useLocalization } from "@hooks/useLocalization";

const TransportOwnerShipTable = () => {
  const { data: transportOwnerShipList = [] } = useGetTransportOwnerShipQuery();
  const [editTransportOwnerShip] = useEditTransportOwnerShipMutation();
  const [deleteTransportOwnerShip] = useDeleteTransportOwnerShipMutation();
  const { isOpen, openModal, closeModal } = useModal();
  const {t} = useLocalization()

  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalCount = transportOwnerShipList.length;

  const paginatedTransportOwnerShipList = transportOwnerShipList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModalEdit = (id: string, name: string) => {
    setEditId(id);
    setEditName(name);
    openModal();
  };

  const handleSave = async () => {
    if (!editName) {
      toast.error("Название обязательно");
      return;
    }
    try {
      await editTransportOwnerShip({ id: editId, name: editName }).unwrap();
      toast.success("Собственность успешно изменена!");
      closeModal();
    } catch {
      toast.error(
        "⚠️ Не удалось изменить данные собственности. Попробуйте позже."
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransportOwnerShip(id).unwrap();
      toast.success("Собственность успешно удалена!");
    } catch {
      toast.error("⚠️ Не удалось удалить собственность. Попробуйте позже.");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 mt-[2%]">
      <Table className="w-full">
        <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
          <TableRow className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-300"
            >
              {t("references.transport_ownership.name_table")}
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-600 text-end text-theme-xs dark:text-gray-300"
            >
              {t("references.common.actions")}
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedTransportOwnerShipList.map((TransportOwnerShip) => (
            <TableRow
              key={TransportOwnerShip.id}
              className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <TableCell className="px-5 py-4 sm:px-6 text-start">
                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {TransportOwnerShip.name}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                <div className="flex gap-2 justify-end">
                  <Pencil
                    onClick={() =>
                      openModalEdit(
                        TransportOwnerShip.id,
                        TransportOwnerShip.name
                      )
                    }
                    className="w-5 h-5 cursor-pointer hover:text-blue-500 transition"
                  />
                  <Trash2
                    onClick={() => handleDelete(TransportOwnerShip.id)}
                    className="w-6 h-6 cursor-pointer hover:text-red-500 transition"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        className="table-pagination"
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={itemsPerPage}
        page={currentPage - 1}
        onPageChange={(_event, newPage) => setCurrentPage(newPage + 1)}
        onRowsPerPageChange={(event) => {
          setItemsPerPage(parseInt(event.target.value, 10));
          setCurrentPage(1);
        }}
        labelRowsPerPage={`${t("common.rows_per_page")}`}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} ${t("common.from_to")} ${count}`
        }
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {t("references.transport_ownership.edit")}
          </h4>
          <div className="flex flex-col space-y-4">
            <div>
              <Label>{t("references.transport_ownership.name_table")}</Label>
              <Input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button size="sm" variant="outline" onClick={closeModal}>
                {t("references.common.cancel")}
              </Button>
              <Button size="sm" onClick={handleSave}>
                {t("references.common.save")}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransportOwnerShipTable;
