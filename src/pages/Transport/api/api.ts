import { createApi } from "@reduxjs/toolkit/query/react";
import { TTransport, TTransportLower } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";
export interface BridgeTransportResponse {
  message: string;
  statusCode: number;
  meta: any;
  total: any;
  content: TTransport;
}
export const transportApi = createApi({
  reducerPath: "transportApi",
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    checkTransportByLicensePlate: builder.query<TTransportLower, string>({
      query: (licensePlate) => `transport/check/${licensePlate}`,
    }),

    checkTransportFromBridge: builder.query<BridgeTransportResponse, string>({
      query: (licensePlate) => ({
        url: "transport/check/bridge",
        method: "GET",
        params: { licensePlate },
      }),
    }),
    getTransportById: builder.query({
      query: (id) => `transport/${id}`,
    }),

    getAllTransports: builder.query<
      { content: TTransportLower[]; meta: { totalCount: number } },
      { page: number; size: number; search?: string; status?: string }
    >({
      query: ({ page, size, search, status }) => {
        let url = `transport/?page=${page}&size=${size}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (status) url += `&status=${encodeURIComponent(status)}`;
        return url;
      },
      transformResponse: (response: {
        content: TTransportLower[];
        meta: { totalCount: number };
      }) => response,
    }),

    addTransport: builder.mutation({
      query: (newTransport) => ({
        url: "transport/",
        method: "POST",
        body: newTransport,
      }),
    }),

    addTransportToCompany: builder.mutation({
      query: (transportId) => ({
        url: `company/transport?transportId=${transportId}`,
        method: "POST",
      }),
    }),

    updateTransport: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `transport/${id}`,
        method: "PUT",
        body: updatedData,
      }),
    }),

    deleteTransport: builder.mutation({
      query: (id) => ({
        url: `transport/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetTransportByIdQuery,
  useGetAllTransportsQuery,
  useAddTransportMutation,
  useAddTransportToCompanyMutation,
  useUpdateTransportMutation,
  useDeleteTransportMutation,
  useLazyCheckTransportFromBridgeQuery,
  useCheckTransportByLicensePlateQuery,
  useLazyCheckTransportByLicensePlateQuery,
} = transportApi;
