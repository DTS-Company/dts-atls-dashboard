import { createApi } from "@reduxjs/toolkit/query/react";
import { TTransportOwnerShip } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const transportOwnerShipApi = createApi({
  reducerPath: "transportOwnerShipApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["TransportOwnerShip"],
  endpoints: (builder) => ({
    getTransportOwnerShip: builder.query<TTransportOwnerShip[], void>({
      query: () => ({
        url: "transportownership/",
        params: { size: 1000, sort: "id" },
      }),
      providesTags: ["TransportOwnerShip"],
      transformResponse: (response: { content: TTransportOwnerShip[] }) =>
        response.content,
    }),

    addTransportOwnerShip: builder.mutation<void, TTransportOwnerShip>({
      query: (newTransportOwnerShip) => ({
        url: "transportownership/",
        method: "POST",
        body: newTransportOwnerShip,
      }),
      invalidatesTags: ["TransportOwnerShip"],
    }),

    deleteTransportOwnerShip: builder.mutation<void, string>({
      query: (id) => ({
        url: `transportownership/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TransportOwnerShip"],
    }),

    editTransportOwnerShip: builder.mutation<void, TTransportOwnerShip>({
      query: (transportOwnerShip) => ({
        url: `transportownership/${transportOwnerShip.id}`,
        method: "PUT",
        body: transportOwnerShip,
      }),
      invalidatesTags: ["TransportOwnerShip"],
    }),
  }),
});

export const {
  useGetTransportOwnerShipQuery,
  useAddTransportOwnerShipMutation,
  useDeleteTransportOwnerShipMutation,
  useEditTransportOwnerShipMutation,
} = transportOwnerShipApi;
