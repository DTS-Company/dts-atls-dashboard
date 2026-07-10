import { createApi } from "@reduxjs/toolkit/query/react";
import { TIndividual } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";
import {
  TAttachedIndividual,
  TTransportResponse,
} from "@pages/Transport/types/types";
import { API_BASE_URL } from "@apiConfig";

export const individualApi = createApi({
  reducerPath: "individualApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Individual", "Transport"],
  endpoints: (builder) => ({
    getIndividuals: builder.query<
      { content: TIndividual[]; meta: { totalCount: number } },
      { page: number; limit: number; search?: string }
    >({
      query: ({ page, limit, search }) => {
        const queryParams = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (search) {
          queryParams.set("search", search);
        }

        return `individual/?${queryParams.toString()}`;
      },
      transformResponse: (response: {
        content: TIndividual[];
        meta: { totalCount: number };
      }) => response,
    }),

    addIndividual: builder.mutation<{ message: string }, TIndividual>({
      query: (newObj) => ({
        url: "individual/",
        method: "POST",
        body: newObj,
      }),
      invalidatesTags: ["Individual"],
    }),

    deleteIndividual: builder.mutation<void, string>({
      query: (id) => ({
        url: `individual/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Individual"],
    }),

    editIndividual: builder.mutation<void, TIndividual>({
      query: (obj) => ({
        url: `individual/${obj.id}`,
        method: "PUT",
        body: obj,
      }),
      invalidatesTags: ["Individual"],
    }),

    getTransportForIndividual: builder.query<
      TTransportResponse,
      { id: string; page: number; limit: number; search?: string }
    >({
      query: ({ id, page, limit, search }) => ({
        url: `individual/${id}/transports`,
        params: { page, limit, sort: "id", search },
      }),
      transformResponse: (response: TTransportResponse) => response,
      providesTags: ["Transport"],
    }),
    checkIndividualINN: builder.query<
      {
        exists: boolean;
        message: string;
        individualId?: { id: string; individualId: string };
      },
      string
    >({
      query: (tin) => ({
        url: `individual/tin/`,
        method: "GET",
        params: {
          tin,
          userType: "COMPANY",
        },
      }),
      transformResponse: (response: any) => {
        if (response?.content) {
          return {
            exists: true,
            message:
              "ИНН найден. Хотите связать это физическое лицо с вашей компанией?",
            individualId: {
              id: response.content.id,
              individualId: response.content.individualId,
            },
          };
        } else {
          return {
            exists: false,
            message: "К сожалению, такой ИНН не существует.",
          };
        }
      },
    }),

    addTransportToIndividual: builder.mutation<
      void,
      { transportId: string; individualId: string }
    >({
      query: ({ transportId, individualId }) => ({
        url: `individual/${individualId}/transport?transportId=${transportId}`,
        method: "POST",
      }),
      invalidatesTags: ["Transport"],
    }),

    deleteTransportFromIndividual: builder.mutation<
      void,
      { individualId: string; transportId: string }
    >({
      query: ({ individualId, transportId }) => ({
        url: `individual/${individualId}/transport?transportId=${transportId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transport"],
    }),

    checkTransportlicensePlate: builder.query<
      {
        exists: boolean;
        message: string;
        licensePlate?: { id: string; licensePlate: string };
      },
      string
    >({
      query: (licensePlate) => `transport/check/${licensePlate}`,
      transformResponse: (response: any) => {
        if (response?.content) {
          return {
            exists: true,
            message:
              "Автомобильный номер найден. Хотите связать этот автомобиль с вашей компанией?",
            licensePlate: {
              id: response.content.id,
              licensePlate: response.content.licensePlate,
            },
          };
        }
        return {
          exists: false,
          message: "К сожалению, такой автомобильный номер не существует.",
        };
      },
    }),

    getIndividualByTin: builder.query<{ fullName: string }, string>({
      query: (tin) => ({
        url: `${API_BASE_URL}inn/`,
        params: { inn: tin, userType: "individual" },
      }),
    }),
    getAttachedIndividual: builder.query<TAttachedIndividual[], string>({
      query: (id) => `individual/attached/${id}`,
      transformResponse: (response: {
        message: string;
        statusCode: number;
        meta: any;
        total: any;
        content: TAttachedIndividual[]; 
      }) => response.content,
      providesTags: ["Individual"],
    }),
    getIndividualById: builder.query<
      {
        message: string;
        statusCode: number;
        meta: any;
        total: any;
        content: TIndividual;
      },
      string
    >({
      query: (id) => `individual/${id}`,
      transformResponse: (response: {
        message: string;
        statusCode: number;
        meta: any;
        total: any;
        content: TIndividual;
      }) => response,
      providesTags: (result) =>
        result ? [{ type: "Individual", id: result.content.id }] : [],
    }),
    getIndividualsTemporaryStatus: builder.query<
      {
        message: string;
        statusCode: number;
        meta: {
          totalCount: number;
          page: number;
          limit: number;
        };
        total: null;
        content: Array<{
          childIdId: string | null;
          childName: string;
          contractNumber: string;
          detachmentDate: string;
          createdAt: string;
          entityId: string;
          checkStatus: string;
          entityName: string;
          position: string;
          id: string;
        }>;
      },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `individual/checkstatus/temporary`,
        params: { page, size },
      }),
      providesTags: ["Individual"],
    }),
    updateIndividualTemporaryStatus: builder.mutation<
      { message: string; statusCode: number },
      { id: string; status: number }
    >({
      query: ({ id, status }) => ({
        url: `individual/checkstatus/temporary/approval`,
        method: "POST",
        params: { id, status },
      }),
      invalidatesTags: ["Individual"],
    }),
  }),
});

export const {
  useGetIndividualsQuery,
  useAddIndividualMutation,
  useDeleteIndividualMutation,
  useEditIndividualMutation,
  useGetTransportForIndividualQuery,
  useAddTransportToIndividualMutation,
  useDeleteTransportFromIndividualMutation,
  useLazyCheckTransportlicensePlateQuery,
  useLazyGetIndividualByTinQuery,
  useLazyCheckIndividualINNQuery,
  useGetAttachedIndividualQuery,
  useGetIndividualByIdQuery,
  useGetIndividualsTemporaryStatusQuery,
  useUpdateIndividualTemporaryStatusMutation,
} = individualApi;
