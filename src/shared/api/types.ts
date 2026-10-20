// Общий формат списков API: данные в content, постраничная выдача в meta

export type TAtlsPageMeta = {
  totalCount: number;
  page: number;
  limit: number;
};

export type TAtlsPageResponse<T> = {
  content: T[];
  meta: TAtlsPageMeta;
};

export type TAtlsPage<T> = {
  items: T[];
  meta: TAtlsPageMeta;
};
