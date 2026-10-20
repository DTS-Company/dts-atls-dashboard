import { useGetAtlsOptionsQuery, useGetAtlsRecordByIdQuery } from "../api/referenceApi";
import { TAtlsSource } from "../model/types";
import { DEFAULT_OPTIONS_SIZE } from "../lib/formValues";

type Props = {
  source?: TAtlsSource;
  id: unknown;
};

/** Небольшой справочник: один общий запрос списка на всю таблицу (кэш RTK Query) */
const ListCell = ({ source, id }: { source: TAtlsSource; id: string }) => {
  const { data: options = [] } = useGetAtlsOptionsQuery({
    url: source.url,
    size: source.pageSize ?? DEFAULT_OPTIONS_SIZE,
    params: source.params,
  });
  const item = options.find((option) => option.id === id);
  return <>{item ? source.getLabel(item) : "…"}</>;
};

/** Большой справочник: запись по id (кэшируется, повторные id не запрашиваются) */
const RecordCell = ({ source, id }: { source: TAtlsSource; id: string }) => {
  const { data: item, isError } = useGetAtlsRecordByIdQuery({ url: source.url, id });
  if (isError) return <>{id}</>;
  return <>{item ? source.getLabel(item) : "…"}</>;
};

/** Название записи из другого справочника вместо её id */
const AtlsReferenceCell = ({ source, id }: Props) => {
  if (!source || typeof id !== "string" || !id) return <>—</>;
  return source.searchable ? (
    <RecordCell source={source} id={id} />
  ) : (
    <ListCell source={source} id={id} />
  );
};

export default AtlsReferenceCell;
