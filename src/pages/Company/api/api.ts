import { createApi } from "@reduxjs/toolkit/query/react";
import { TTransportResponse } from "@pages/Transport/types/types";
import { TIndividualResponse } from "@pages/Individual/types/types";
import { TCompany, TCompanyUser } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export interface FailedTransport {
  transportId: string;
  success: boolean;
  message: string;
  registrationNumber: string | null;
}

export interface FailedEmployee {
  employeeId?: string;
  employeeName?: string;
  driverName?: string;
  mechanicName?: string;
  doctorName?: string;
  name?: string;
  message: string;
}

export interface SyncResult {
  allSynchronize: number;
  successSynchronize: number;
  errorSynchronize: number;
  failedTransports?: FailedTransport[];
  failedDrivers?: FailedEmployee[];
  failedEmployees?: FailedEmployee[];
  message: string | null;
}

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Company", "Individual", "Transport", "Employee"],
  endpoints: (builder) => ({
    getAllCompanies: builder.query<
      { content: TCompany[]; meta: { totalCount: number } },
      { page: number; size: number; search?: string }
    >({
      query: ({ page, size, search }) => {
        const queryParams = new URLSearchParams({
          page: String(page),
          size: String(size),
          userType: "COMPANY",
        });

        if (search) {
          queryParams.set("search", search);
        }

        return `company/?${queryParams.toString()}`;
      },
      providesTags: ["Company"],
      transformResponse: (response: {
        content: TCompany[];
        meta: { totalCount: number };
      }) => response,
    }),

    getCompanyById: builder.query({
      query: (id) => `company/${id}`,
      providesTags: ["Company"],
    }),

    updateCompany: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `company/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Company"],
    }),

    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `company/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Company"],
    }),

    addTransportToCompany: builder.mutation<
      void,
      { transportId: string; companyId: string }
    >({
      query: ({ transportId, companyId }) => ({
        url: `company/${companyId}/transport?transportId=${transportId}`,
        method: "POST",
      }),
      invalidatesTags: ["Transport"],
    }),

    deleteTransport: builder.mutation({
      query: ({ id, transportId }) => ({
        url: `company/${id}/transport?transportId=${transportId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transport"],
    }),

    addIndividual: builder.mutation({
      query: ({ id, individualId, position }) => ({
        url: `company/${id}/individual?individualId=${individualId}&position=${position}`,
        method: "POST",
      }),
      invalidatesTags: ["Individual"],
    }),

    deleteIndividual: builder.mutation({
      query: ({ id, individualId }) => ({
        url: `company/${id}/individual?individualId=${individualId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Individual"],
    }),

    addCompany: builder.mutation({
      query: (data) => ({
        url: `/company/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Company"],
    }),

    getCompanyTransports: builder.query<
      TTransportResponse,
      { id: string; page: number; limit: number; search?: string }
    >({
      query: ({ id, page, limit, search }) => {
        const params: any = { page, limit, sort: "id" };

        if (search) {
          params.search = search;
        }

        return {
          url: `company/${id}/transports`,
          params,
        };
      },
      providesTags: ["Transport"],
    }),

    getIndividuals: builder.query<
      TIndividualResponse,
      {
        position: string;
        entityId: string;
        page: number;
        size: number;
        search?: string;
      }
    >({
      query: ({ entityId, position, page, size, search }) => {
        const params: any = {
          position,
          page,
          limit: size,
          sort: "id",
        };

        if (search) {
          params.search = search;
        }

        return {
          url: `company/${entityId}/individuals`,
          params,
        };
      },
      providesTags: ["Individual"],
      transformResponse: (response: TIndividualResponse) => response,
    }),

    getCompanyByTin: builder.query<
      { fullName: string; shortName: string; ein: string },
      string
    >({
      query: (tin) => ({
        url: `inn/`,
        params: { inn: tin, userType: "company" },
      }),
    }),

    getCompanyUser: builder.query<TCompanyUser, string>({
      query: (id) => `user/${id}`,
      providesTags: ["Company"],
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

    synchronizeAllTransports: builder.mutation<SyncResult, string>({
      query: (companyId) => ({
        url: `/rohkhat/synchronize/alltransports/${companyId}`,
        method: "POST",
      }),
      invalidatesTags: ["Transport"],
    }),

    synchronizeAllMechanics: builder.mutation<SyncResult, string>({
      query: (companyId) => ({
        url: `/rohkhat/synchronize/allmechanics/${companyId}`,
        method: "POST",
      }),
      invalidatesTags: ["Employee"],
    }),

    synchronizeAllDrivers: builder.mutation<SyncResult, string>({
      query: (companyId) => ({
        url: `/rohkhat/synchronize/alldrivers/${companyId}`,
        method: "POST",
      }),
      invalidatesTags: ["Employee"],
    }),

    synchronizeAllDoctors: builder.mutation<SyncResult, string>({
      query: (companyId) => ({
        url: `/rohkhat/synchronize/alldoctors/${companyId}`,
        method: "POST",
      }),
      invalidatesTags: ["Employee"],
    }),
  }),
});

export const {
  useGetCompanyByIdQuery,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useDeleteTransportMutation,
  useAddIndividualMutation,
  useDeleteIndividualMutation,
  useGetAllCompaniesQuery,
  useAddCompanyMutation,
  useLazyGetCompanyByTinQuery,
  useGetCompanyTransportsQuery,
  useGetIndividualsQuery,
  useGetCompanyUserQuery,
  useCheckCarNumberQuery,
  useAddTransportToCompanyMutation,
  useSynchronizeAllTransportsMutation,
  useSynchronizeAllMechanicsMutation,
  useSynchronizeAllDriversMutation,
  useSynchronizeAllDoctorsMutation,
} = companyApi;
