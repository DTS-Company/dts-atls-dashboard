import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Input from "@shared/ui/form/InputField";
import Select from "@shared/ui/form/Select";
import { useLocalization } from "@shared/lib/useLocalization";
import { useGetAtlsOptionsQuery, useGetAtlsRecordByIdQuery } from "../api/referenceApi";
import { TAtlsSource } from "../model/types";
import { DEFAULT_OPTIONS_SIZE } from "../lib/formValues";

type Props = {
  source: TAtlsSource;
  value: string;
  onChange: (value: string) => void;
};

const SEARCH_MIN_LENGTH = 2;
const SEARCH_DELAY_MS = 400;

/** Небольшой справочник: весь список в выпадающем меню */
const ListSelect = ({ source, value, onChange }: Props) => {
  const { t } = useLocalization();
  const { data: options = [], isFetching } = useGetAtlsOptionsQuery({
    url: source.url,
    size: source.pageSize ?? DEFAULT_OPTIONS_SIZE,
    params: source.params,
  });

  return (
    <Select
      value={value}
      onChange={onChange}
      options={[
        {
          value: "",
          label: isFetching
            ? t("atls.common.loading")
            : t("atls.common.not_selected"),
        },
        ...options.map((item) => ({
          value: item.id,
          label: source.getLabel(item),
        })),
      ]}
    />
  );
};

/** Большой справочник (компании, машины): поиск на сервере */
const SearchSelect = ({ source, value, onChange }: Props) => {
  const { t } = useLocalization();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const canSearch = debouncedSearch.length >= SEARCH_MIN_LENGTH;
  const { data: results = [], isFetching } = useGetAtlsOptionsQuery(
    {
      url: source.url,
      size: source.pageSize ?? DEFAULT_OPTIONS_SIZE,
      params: source.params,
      search: debouncedSearch,
    },
    { skip: !canSearch },
  );
  const { data: selected } = useGetAtlsRecordByIdQuery(
    { url: source.url, id: value },
    { skip: !value },
  );

  const renderResults = () => {
    if (!canSearch) {
      return (
        <p className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
          {t("atls.common.search_hint")}
        </p>
      );
    }
    if (isFetching) {
      return (
        <p className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
          {t("atls.common.loading")}
        </p>
      );
    }
    if (!results.length) {
      return (
        <p className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
          {t("atls.common.nothing_found")}
        </p>
      );
    }
    return results.map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() => {
          onChange(item.id);
          setSearch("");
        }}
        className="block w-full px-3 py-2 text-sm text-start text-gray-800 hover:bg-gray-100 dark:text-white/90 dark:hover:bg-white/[0.05]"
      >
        {source.getLabel(item)}
      </button>
    ));
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-brand-300 bg-brand-500/[0.05] px-3 py-2 text-sm text-gray-800 dark:text-white/90">
          <span>{selected ? source.getLabel(selected) : t("atls.common.loading")}</span>
          <X
            size={16}
            className="cursor-pointer text-gray-500 hover:text-red-500"
            onClick={() => onChange("")}
          />
        </div>
      )}
      <Input
        type="text"
        placeholder={t("atls.common.search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
          {renderResults()}
        </div>
      )}
    </div>
  );
};

const AtlsReferenceSelect = (props: Props) =>
  props.source.searchable ? <SearchSelect {...props} /> : <ListSelect {...props} />;

export default AtlsReferenceSelect;
