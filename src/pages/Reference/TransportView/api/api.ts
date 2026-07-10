import { createApi } from "@reduxjs/toolkit/query/react";
import { TTransportView } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const transportViewApi = createApi({
  reducerPath: "transportViewApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["TransportView"],
  endpoints: (builder) => ({
    getTransportView: builder.query<TTransportView[], void>({
      query: () => ({ url: "transportview/", params: { size: 1000, sort: "id" } }),
      providesTags: ["TransportView"],
      transformResponse: (response: { content: TTransportView[] }) => response.content,
    }),

    addTransportView: builder.mutation<void, TTransportView>({
      query: (newTransportView) => ({
        url: "transportview/",
        method: "POST",
        body: newTransportView,
      }),
      invalidatesTags: ["TransportView"],
    }),

    deleteTransportView: builder.mutation<void, string>({
      query: (id) => ({
        url: `transportview/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TransportView"],
    }),

    editTransportView: builder.mutation<void, TTransportView>({
      query: (transportView) => ({
        url: `transportview/${transportView.id}`,
        method: "PUT",
        body: transportView,
      }),
      invalidatesTags: ["TransportView"],
    }),
  }),
});

export const {
  useGetTransportViewQuery,
  useAddTransportViewMutation,
  useDeleteTransportViewMutation,
  useEditTransportViewMutation,
} = transportViewApi;
