import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@shared/api/baseApi";
import { TAtlsPage, TAtlsPageResponse } from "@shared/api/types";
import { TAtlsRecord } from "../model/types";

type TListArgs = {
  slug: string;
  page: number;
  size: number;
  params?: Record<string, string>;
};
type TBody = Record<string, unknown>;
type TOptionsArgs = {
  url: string;
  size: number;
  params?: Record<string, string>;
  search?: string;
};

// Списки справочников ATLS обновляются вместе с их страницами
const getSlugTag = (url: string) => {
  const slug = url.match(/^atls\/(.+)\/$/)?.[1];
  return slug ? [{ type: "AtlsReference" as const, id: slug }] : [];
};

// Один api на все справочники ATLS: у них одинаковые адреса и формат ответа.
export const atlsReferenceApi = createApi({
  reducerPath: "atlsReferenceApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["AtlsReference"],
  endpoints: (builder) => ({
    getAtlsList: builder.query<TAtlsPage<TAtlsRecord>, TListArgs>({
      query: ({ slug, page, size, params }) => ({
        url: `atls/${slug}/`,
        params: { page, size, ...params },
      }),
      transformResponse: (response: TAtlsPageResponse<TAtlsRecord>) => ({
        items: response.content,
        meta: response.meta,
      }),
      providesTags: (_result, _error, { slug }) => [
        { type: "AtlsReference", id: slug },
      ],
    }),

    // Записи другого справочника для выпадающего списка
    getAtlsOptions: builder.query<TAtlsRecord[], TOptionsArgs>({
      query: ({ url, size, params, search }) => ({
        url,
        params: { page: 0, size, ...params, ...(search ? { search } : {}) },
      }),
      transformResponse: (response: { content: TAtlsRecord[] }) =>
        response.content,
      providesTags: (_result, _error, { url }) => getSlugTag(url),
    }),

    getAtlsRecordById: builder.query<TAtlsRecord, { url: string; id: string }>({
      query: ({ url, id }) => `${url}${id}`,
      transformResponse: (response: { content: TAtlsRecord }) =>
        response.content,
      providesTags: (_result, _error, { url }) => getSlugTag(url),
    }),

    addAtlsRecord: builder.mutation<void, { slug: string; body: TBody }>({
      query: ({ slug, body }) => ({
        url: `atls/${slug}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { slug }) => [
        { type: "AtlsReference", id: slug },
      ],
    }),

    editAtlsRecord: builder.mutation<
      void,
      { slug: string; id: string; body: TBody }
    >({
      query: ({ slug, id, body }) => ({
        url: `atls/${slug}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { slug }) => [
        { type: "AtlsReference", id: slug },
      ],
    }),

    deleteAtlsRecord: builder.mutation<void, { slug: string; id: string }>({
      query: ({ slug, id }) => ({
        url: `atls/${slug}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { slug }) => [
        { type: "AtlsReference", id: slug },
      ],
    }),
  }),
});

export const {
  useGetAtlsListQuery,
  useGetAtlsOptionsQuery,
  useGetAtlsRecordByIdQuery,
  useAddAtlsRecordMutation,
  useEditAtlsRecordMutation,
  useDeleteAtlsRecordMutation,
} = atlsReferenceApi;
