import { createApi } from "@reduxjs/toolkit/query/react";
import { TTransportOwnerType } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const transportOwnerTypeApi = createApi({
  reducerPath: "transportOwnerTypeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["TransportOwnerType"],
  endpoints: (builder) => ({
    getTransportOwnerType: builder.query<TTransportOwnerType[], void>({
      query: () => ({
        url: "transportownertype/",
        params: { size: 1000, sort: "id" },
      }),
      providesTags: ["TransportOwnerType"],
      transformResponse: (response: { content: TTransportOwnerType[] }) =>
        response.content,
    }),

    addTransportOwnerType: builder.mutation<void, TTransportOwnerType>({
      query: (newTransportOwnerType) => ({
        url: "transportownertype/",
        method: "POST",
        body: newTransportOwnerType,
      }),
      invalidatesTags: ["TransportOwnerType"],
    }),

    deleteTransportOwnerType: builder.mutation<void, string>({
      query: (id) => ({
        url: `transportownertype/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TransportOwnerType"],
    }),

    editTransportOwnerType: builder.mutation<void, TTransportOwnerType>({
      query: (transportOwnerType) => ({
        url: `transportownertype/${transportOwnerType.id}`,
        method: "PUT",
        body: transportOwnerType,
      }),
      invalidatesTags: ["TransportOwnerType"],
    }),
  }),
});

export const {
  useGetTransportOwnerTypeQuery,
  useAddTransportOwnerTypeMutation,
  useDeleteTransportOwnerTypeMutation,
  useEditTransportOwnerTypeMutation,
} = transportOwnerTypeApi;
