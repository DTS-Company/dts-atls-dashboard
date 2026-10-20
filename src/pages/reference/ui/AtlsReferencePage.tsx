import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { TablePagination } from "@mui/material";
import PageBreadcrumb from "@shared/ui/PageBreadCrumb";
import ComponentCard from "@shared/ui/ComponentCard";
import PageMeta from "@shared/ui/PageMeta";
import {
  Table, TableBody, TableCell, TableHeader, TableRow, } from "@shared/ui/table/Table";
import { Modal } from "@shared/ui/modal/Modal";
import Button from "@shared/ui/button/Button";
import { useLocalization } from "@shared/lib/useLocalization";
import { getApiErrorMessage } from "@shared/lib/getApiErrorMessage";
import {
  TABLE_NOTE_CLASS, TABLE_WRAP_CLASS, TD_CLASS, TH_CLASS, TR_CLASS, } from "@shared/ui/table/styles";
import {
  useDeleteAtlsRecordMutation,
  useGetAtlsListQuery,
  findAtlsReference,
  formatCellValue,
  getFieldLabel,
  resolveSource,
  TAtlsRecord,
  TAtlsReferenceConfig,
  AtlsReferenceCell,
  AtlsReferenceSelect,
  SOURCES,
} from "@entities/reference";
import { AtlsFormModal } from "@features/edit-reference-record";
import Label from "@shared/ui/form/Label";

const DEFAULT_PAGE_SIZE = 30;

type FormState = { record?: TAtlsRecord } | null;

const AtlsReferenceView = ({ config }: { config: TAtlsReferenceConfig }) => {
  const { t } = useLocalization();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [formState, setFormState] = useState<FormState>(null);
  const [deleteId, setDeleteId] = useState("");
  const [companyId, setCompanyId] = useState("");

  const { data, error, isLoading } = useGetAtlsListQuery({
    slug: config.slug,
    page,
    size,
    params: companyId ? { companyId } : undefined,
  });
  const [deleteRecord, { isLoading: isDeleting }] =
    useDeleteAtlsRecordMutation();

  const items = data?.items ?? [];
  const totalCount = data?.meta.totalCount ?? 0;
  const columns = config.fields.filter((field) => field.inTable);
  const title = t(`atls.refs.${config.slug}`);
  const Icon = config.icon;

  // После удаления последней записи на странице — вернуться на предыдущую.
  useEffect(() => {
    if (data && items.length === 0 && page > 0) {
      setPage(page - 1);
    }
  }, [data, items.length, page]);

  const handleDeleteConfirm = async () => {
    try {
      await deleteRecord({ slug: config.slug, id: deleteId }).unwrap();
      setDeleteId("");
      toast.success(t("atls.common.deleted"));
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError), {
        style: { whiteSpace: "pre-line" },
      });
    }
  };

  return (
    <>
      <PageMeta title={title} description="" />
      <PageBreadcrumb
        pageTitle={
          <>
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              {t(`atls.groups.${config.group}`)}
              <ChevronRight size={18} />
            </span>
            {title}
          </>
        }
      />
      <ComponentCard title={title}>
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3 rounded-xl bg-brand-50 px-3 h-12 dark:bg-brand-500/15">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg atls-gradient text-white">
              <Icon className="size-[18px]" />
            </div>
            <span className="text-sm font-medium text-brand-600 dark:text-brand-300">
              {t("atls.common.all")}
            </span>
            <h4 className="font-extrabold text-gray-700 text-lg tabular-nums dark:text-white">
              {totalCount}
            </h4>
          </div>
          {config.companyFilter && (
            <div className="w-full sm:w-96">
              <Label>{t("atls.fields.companyId")}</Label>
              <AtlsReferenceSelect
                source={SOURCES.company}
                value={companyId}
                onChange={(value) => {
                  setCompanyId(value);
                  setPage(0);
                }}
              />
            </div>
          )}
          {!config.readOnly && (
            <Button
              className="h-12"
              startIcon={<Plus size={18} />}
              onClick={() => setFormState({})}
            >
              {t("atls.common.add")}
            </Button>
          )}
        </div>

        {isLoading && <div>{t("atls.common.loading")}</div>}
        {error ? (
          <div className="text-error-500">{getApiErrorMessage(error)}</div>
        ) : null}

        {data && (
          <div className={TABLE_WRAP_CLASS}>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    {columns.map((field) => (
                      <TableCell key={field.name} isHeader className={TH_CLASS}>
                        {getFieldLabel(field, t)}
                      </TableCell>
                    ))}
                    {!config.readOnly && (
                      <TableCell
                        isHeader
                        className={`${TH_CLASS} !text-end`}
                      >
                        {t("references.common.actions")}
                      </TableCell>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.id}
                      className={TR_CLASS}
                    >
                      {columns.map((field) => (
                        <TableCell
                          key={field.name}
                          className={TD_CLASS}
                        >
                          {field.type === "reference" ? (
                            <AtlsReferenceCell
                              source={resolveSource(field.source, item)}
                              id={item[field.name]}
                            />
                          ) : (
                            formatCellValue(field, item[field.name], t)
                          )}
                        </TableCell>
                      ))}
                      {!config.readOnly && (
                        <TableCell className={`${TD_CLASS} !text-end text-gray-500`}>
                          <div className="flex gap-2 justify-end">
                            <Pencil
                              onClick={() => setFormState({ record: item })}
                              className="w-5 h-5 cursor-pointer hover:text-blue-500 transition"
                            />
                            <Trash2
                              onClick={() => setDeleteId(item.id)}
                              className="w-6 h-6 cursor-pointer hover:text-red-500 transition"
                            />
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {items.length === 0 && (
              <div className={TABLE_NOTE_CLASS}>
                {t("atls.common.empty")}
              </div>
            )}

            <TablePagination
              className="table-pagination"
              rowsPerPageOptions={[10, 30, 50, 100]}
              component="div"
              count={totalCount}
              rowsPerPage={size}
              page={page}
              onPageChange={(_event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setSize(parseInt(event.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage={t("common.rows_per_page")}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} ${t("common.from_to")} ${count}`
              }
            />
          </div>
        )}
      </ComponentCard>

      {formState && (
        <AtlsFormModal
          config={config}
          record={formState.record}
          onClose={() => setFormState(null)}
        />
      )}

      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId("")}
        className="max-w-[400px] m-4"
      >
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
            {t("references.common.confirm")}
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-5">
            {t("atls.common.confirm_text")}
          </p>
          <div className="flex justify-end gap-3">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-500"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting
                ? t("atls.common.deleting")
                : t("references.common.delete")}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setDeleteId("")}>
              {t("references.common.cancel")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const AtlsReferencePage = () => {
  const { slug } = useParams();
  const config = findAtlsReference(slug);

  if (!config) return <Navigate to="/" replace />;

  // key сбрасывает страницу и формы при переходе на другой справочник
  return <AtlsReferenceView key={config.slug} config={config} />;
};

export default AtlsReferencePage;
