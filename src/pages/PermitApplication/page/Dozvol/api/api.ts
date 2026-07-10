import { createApi } from "@reduxjs/toolkit/query/react";
import {
  TBlanksStats,
  TDozvol,
  TMetaCountry,
  TMetaPermit,
} from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const dozvolApi = createApi({
  reducerPath: "dozvolApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Dozvol"],
  endpoints: (builder) => ({
    getAppListNew: builder.query<any, { status?: number } | void>({
      query: (params: { status?: number }) => ({
        url: "/dozvol/applistnew",
        params: params || undefined,
      }),
      providesTags: ["Dozvol"],
    }),
    createBlank: builder.mutation<TDozvol, Omit<TDozvol, "id">>({
      query: (blankData) => ({
        url: "/dozvol/blanksreg",
        method: "POST",
        body: blankData,
      }),
      invalidatesTags: ["Dozvol"],
    }),

    getMetaPermit: builder.query<TMetaPermit[], void>({
      query: () => "/dozvol/metapermit",
      transformResponse: (response: { content: TMetaPermit[] }) =>
        response.content,
    }),
    getBlanksStats: builder.query({
      query: () => ({
        url: "/dozvol/blanksstats",
        method: "GET",
      }),
      transformResponse: (response: { content: TBlanksStats[] }) =>
        response.content,
    }),
    getMetaCountry: builder.query<TMetaCountry[], void>({
      query: () => "/dozvol/metacountry",
      transformResponse: (response: { content: TMetaCountry[] }) =>
        response.content,
    }),
    getAppViewMinistry: builder.query<any, { idApp: number }>({
      query: ({ idApp }) => ({
        url: "/dozvol/appviewministry",
        params: { idApp },
      }),
    }),
  }),
});

export const {
  useGetAppListNewQuery,
  useCreateBlankMutation,
  useGetMetaCountryQuery,
  useGetMetaPermitQuery,
  useGetAppViewMinistryQuery,
  useGetBlanksStatsQuery,
} = dozvolApi;
