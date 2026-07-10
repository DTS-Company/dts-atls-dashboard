import { createApi } from "@reduxjs/toolkit/query/react";
import { TTransportType } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const transportTypeApi = createApi({
  reducerPath: "transportTypeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["TransportType"],
  endpoints: (builder) => ({
    getTransportType: builder.query<TTransportType[], void>({
      query: () => ({
        url: "transporttype/",
        params: { size: 1000, sort: "id" },
      }),
      providesTags: ["TransportType"],
      transformResponse: (response: { content: TTransportType[] }) =>
        response.content,
    }),

    getTransportTypes: builder.query<string[], void>({
      query: () => "transporttype/types/",
      transformResponse: (response: { content: string[] }) => response.content,
    }),

    getTransportTypeByName: builder.query<
      { id: string; type: string; name: string }[],
      string
    >({
      query: (name) => `transporttype/types-value/${name}`,
      transformResponse: (response: {
        content: { id: string; type: string; name: string }[];
      }) => response.content,
    }),

    addTransportType: builder.mutation<void, TTransportType>({
      query: (newTransportType) => ({
        url: "transporttype/",
        method: "POST",
        body: newTransportType,
      }),
      invalidatesTags: ["TransportType"],
    }),

    deleteTransportType: builder.mutation<void, string>({
      query: (id) => ({
        url: `transporttype/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TransportType"],
    }),

    editTransportType: builder.mutation<void, TTransportType>({
      query: (transportType) => ({
        url: `transporttype/${transportType.id}`,
        method: "PUT",
        body: transportType,
      }),
      invalidatesTags: ["TransportType"],
    }),
  }),
});

export const {
  useGetTransportTypeQuery,
  useGetTransportTypesQuery,
  useGetTransportTypeByNameQuery,
  useAddTransportTypeMutation,
  useDeleteTransportTypeMutation,
  useEditTransportTypeMutation,
} = transportTypeApi;
