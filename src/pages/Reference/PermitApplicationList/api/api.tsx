import { createApi } from "@reduxjs/toolkit/query/react";
import { TPermitApplicationList } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const permitApplicationListApi = createApi({
  reducerPath: "permitApplicationListApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["PermitApplicationList"],
  endpoints: (builder) => ({
    getPermitApplicationList: builder.query<TPermitApplicationList[], void>({
      query: () => ({
        url: "permitapplicationlist/",
        params: {
          page: 0,
          size: 1000,
          sort: "id",
        }, 
      }),
      providesTags: ["PermitApplicationList"],
      transformResponse: (response: { content: TPermitApplicationList[] }) =>
        response.content,
    }),

    addPermitApplicationList: builder.mutation<void, TPermitApplicationList>({
      query: (newPermitApplicationList) => ({
        url: "permitapplicationlist/",
        method: "POST",
        body: newPermitApplicationList,
      }),
      invalidatesTags: ["PermitApplicationList"],
    }),

    deletePermitApplicationList: builder.mutation<void, number>({
      query: (id) => ({
        url: `permitapplicationlist/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PermitApplicationList"],
    }),

    editPermitApplicationList: builder.mutation<void, TPermitApplicationList>({
      query: (permitApplicationList) => ({
        url: `permitapplicationlist/`,
        method: "PUT",
        body: permitApplicationList,
      }),
      invalidatesTags: ["PermitApplicationList"],
    }),
  }),
});

export const {
  useGetPermitApplicationListQuery,
  useAddPermitApplicationListMutation,
  useDeletePermitApplicationListMutation,
  useEditPermitApplicationListMutation,
} = permitApplicationListApi;
