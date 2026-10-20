import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@shared/api/baseApi";
import { TAtlsPage, TAtlsPageResponse } from "@shared/api/types";
import { cleanParams } from "@shared/lib/cleanParams";
import { TWaybill, TWaybillCard, TWaybillFilters } from "../model/types";

// Путевые листы ATLS: просмотр ведомством (Swagger atls-waybill-monitoring)
export const atlsWaybillApi = createApi({
  reducerPath: "atlsWaybillApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAtlsWaybills: builder.query<TAtlsPage<TWaybill>, TWaybillFilters>({
      query: (filters) => ({
        url: "atls/waybill/",
        params: cleanParams(filters),
      }),
      transformResponse: (response: TAtlsPageResponse<TWaybill>) => ({
        items: response.content,
        meta: response.meta,
      }),
    }),

    getAtlsWaybillCard: builder.query<TWaybillCard, string>({
      query: (id) => `atls/waybill/${id}`,
      transformResponse: (response: { content: TWaybillCard }) =>
        response.content,
    }),
  }),
});

export const { useGetAtlsWaybillsQuery, useGetAtlsWaybillCardQuery } =
  atlsWaybillApi;
