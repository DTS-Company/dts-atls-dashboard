import { createApi } from "@reduxjs/toolkit/query/react";
import { TTransportBrand } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const transportBrandApi = createApi({
  reducerPath: "transportBrandApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["TransportBrand"],
  endpoints: (builder) => ({
    getTransportBrand: builder.query<TTransportBrand[], void>({
      query: () => ({
        url: "transportbrand/",
        params: { size: 1000, sort: "id" },
      }),
      providesTags: ["TransportBrand"],
      transformResponse: (response: { content: TTransportBrand[] }) =>
        response.content,
    }),

    addTransportBrand: builder.mutation<void, TTransportBrand>({
      query: (newTransportBrand) => ({
        url: "transportbrand/",
        method: "POST",
        body: newTransportBrand,
      }),
      invalidatesTags: ["TransportBrand"],
    }),

    deleteTransportBrand: builder.mutation<void, string>({
      query: (id) => ({
        url: `transportbrand/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TransportBrand"],
    }),

    editTransportBrand: builder.mutation<void, TTransportBrand>({
      query: (transportBrand) => ({
        url: `transportbrand/${transportBrand.id}`,
        method: "PUT",
        body: transportBrand,
      }),
      invalidatesTags: ["TransportBrand"],
    }),
  }),
});

export const {
  useGetTransportBrandQuery,
  useAddTransportBrandMutation,
  useDeleteTransportBrandMutation,
  useEditTransportBrandMutation,
} = transportBrandApi;
