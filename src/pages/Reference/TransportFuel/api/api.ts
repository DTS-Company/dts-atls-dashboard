import { createApi } from "@reduxjs/toolkit/query/react";
import { TTransportFuel } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const transportFuelApi = createApi({
  reducerPath: "transportFuelApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["TransportFuel"],
  endpoints: (builder) => ({
    getTransportFuel: builder.query<TTransportFuel[], void>({
      query: () => ({
        url: "transportfuel/",
        params: { size: 1000, sort: "id" },
      }),
      providesTags: ["TransportFuel"],
      transformResponse: (response: { content: TTransportFuel[] }) =>
        response.content,
    }),

    addTransportFuel: builder.mutation<void, TTransportFuel>({
      query: (newTransportFuel) => ({
        url: "transportfuel/",
        method: "POST",
        body: newTransportFuel,
      }),
      invalidatesTags: ["TransportFuel"],
    }),

    deleteTransportFuel: builder.mutation<void, string>({
      query: (id) => ({
        url: `transportfuel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TransportFuel"],
    }),

    editTransportFuel: builder.mutation<void, TTransportFuel>({
      query: (transportFuel) => ({
        url: `transportfuel/${transportFuel.id}`,
        method: "PUT",
        body: transportFuel,
      }),
      invalidatesTags: ["TransportFuel"],
    }),
  }),
});

export const {
  useGetTransportFuelQuery,
  useAddTransportFuelMutation,
  useDeleteTransportFuelMutation,
  useEditTransportFuelMutation,
} = transportFuelApi;
