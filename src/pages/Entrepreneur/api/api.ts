import { createApi } from "@reduxjs/toolkit/query/react";
import { TEntrepreneur } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";
import { TTransportResponse } from "@pages/Transport/types/types";

export const entrepreneurApi = createApi({
  reducerPath: "EntrepreneurApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Entrepreneur", "Individual", "Transport"],
  endpoints: (builder) => ({
    getAllEntrepeneurs: builder.query<
      { content: TEntrepreneur[]; meta: { totalCount: number } },
      { page: number; size: number; search?: string }
    >({
      query: ({ page, size, search }) => {
        const queryParams = new URLSearchParams({
          page: String(page),
          size: String(size),
          userType: "ENTREPRENEUR",
        });

        if (search) {
          queryParams.set("search", search);
        }

        return `entrepreneur/?${queryParams.toString()}`;
      },
      transformResponse: (response: {
        content: TEntrepreneur[];
        meta: { totalCount: number };
      }) => response,
    }),

    getEntrepreneurById: builder.query({
      query: (id) => `entrepreneur/${id}`,
      providesTags: ["Entrepreneur"],
    }),

    updateEntrepreneur: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `entrepreneur/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Entrepreneur"],
    }),

    deleteEntrepreneur: builder.mutation({
      query: (id) => ({
        url: `entrepreneur/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Entrepreneur"],
    }),

    addTransportEntrepreneur: builder.mutation<
      void,
      { transportId: string; entrepreneurId: string }
    >({
      query: ({ transportId, entrepreneurId }) => ({
        url: `entrepreneur/${entrepreneurId}/transport?transportId=${transportId}`,
        method: "POST",
      }),
      invalidatesTags: ["Transport"],
    }),

    deleteTransport: builder.mutation({
      query: ({ id, transportId }) => ({
        url: `entrepreneur/${id}/transport?transportId=${transportId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transport"],
    }),

    addIndividual: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `entrepreneur/${id}/individual`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Individual"],
    }),

    deleteIndividual: builder.mutation({
      query: ({ id, individualId }) => ({
        url: `entrepreneur/${id}/individual/${individualId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Individual"],
    }),

    addEntrepreneur: builder.mutation({
      query: (data) => ({
        url: `entrepreneur/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Entrepreneur"],
    }),
    getEntrepreneurTransports: builder.query<
      TTransportResponse,
      { id: string; page: number; limit: number; search?: string }
    >({
      query: ({ id, page, limit, search }) => ({
        url: `entrepreneur/${id}/transports`,
        params: { page, limit, sort: "id", search },
      }),
      transformResponse: (response: TTransportResponse) => response,
      providesTags: ["Transport"],
    }),

    getEntrepreneurIndividuals: builder.query({
      query: (id) => `entrepreneur/${id}/individuals`,
      providesTags: ["Individual"],
    }),

    getEntrepreneurByTin: builder.query<
      { fullName: string; shortName: string; ein: string },
      string
    >({
      query: (tin) => ({
        url: `inn/`,
        params: { inn: tin, userType: "entrepreneur" },
      }),
    }),

    checkCarNumber: builder.query<{ exists: boolean; message: string }, string>(
      {
        query: (carNumber) => `transport/transport/${carNumber}`,
        transformResponse: (response: { content: any }, carNumber) => {
          if (!response) {
            return {
              exists: false,
              message: "Ошибка сервера при проверке номера",
            };
          }
          return {
            exists: true,
            message: `Номер ${carNumber} найден!`,
          };
        },
      },
    ),
  }),
});

export const {
  useGetEntrepreneurByIdQuery,
  useUpdateEntrepreneurMutation,
  useDeleteEntrepreneurMutation,
  useAddTransportEntrepreneurMutation,
  useDeleteTransportMutation,
  useAddIndividualMutation,
  useDeleteIndividualMutation,
  useGetAllEntrepeneursQuery,
  useAddEntrepreneurMutation,
  useLazyGetEntrepreneurByTinQuery,
  useGetEntrepreneurTransportsQuery,
  useGetEntrepreneurIndividualsQuery,
  useCheckCarNumberQuery,
} = entrepreneurApi;
