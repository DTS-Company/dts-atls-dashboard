import { createApi } from "@reduxjs/toolkit/query/react";
import { TStatus } from "../types/type";
import { baseQueryWithReauth } from "@baseApi";

export const statusApi = createApi({
  reducerPath: "statusApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Status"],
  endpoints: (builder) => ({
    getStatus: builder.query<TStatus[], void>({
      query: () => ({
        url: "activitystatus/",
        params: {
          page: 0,
          size: 1000,
          sort: "id",
        },
      }),
      providesTags: ["Status"],
      transformResponse: (response: { content: TStatus[] }) => response.content,
    }),

    addStatus: builder.mutation<void, TStatus>({
      query: (newStatus) => ({
        url: "activitystatus/",
        method: "POST",
        body: newStatus,
      }),
      invalidatesTags: ["Status"],
    }),

    deleteStatus: builder.mutation<void, string>({
      query: (id) => ({
        url: `activitystatus/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Status"],
    }),

    editStatus: builder.mutation<void, TStatus>({
      query: (status) => ({
        url: `activitystatus/${status.id}`,
        method: "PUT",
        body: status,
      }),
      invalidatesTags: ["Status"],
    }),
  }),
});

export const {
  useGetStatusQuery,
  useAddStatusMutation,
  useDeleteStatusMutation,
  useEditStatusMutation,
} = statusApi;
