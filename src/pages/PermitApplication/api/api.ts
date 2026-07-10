import { createApi} from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@baseApi";

export const permitApplicationApi = createApi({
  reducerPath: "permitApplicationApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["PermitApplication"],
  endpoints: (builder) => ({
    getEntrepreneurPermitApplications: builder.query<
      { content: any[]; meta: { totalCount: number; page: number; limit: number } },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: "entrepreneur",
        params: { page, size },
      }),
      providesTags: ["PermitApplication"],
      transformResponse: (response: {
        message: string;
        statusCode: number;
        meta: { totalCount: number; page: number; limit: number };
        content: any[];
      }) => ({
        content: response.content,
        meta: response.meta,
      }),
    }),

    getEntrepreneurPermitApplicationByEntityId: builder.query<
      any,
      { entityId: string; page?: number; size?: number }
    >({
      query: ({ entityId, page = 1, size = 30 }) => ({
        url: `entrepreneur/${entityId}`,
        params: { page, size },
      }),
      providesTags: ["PermitApplication"],
    }),

    getCompanyPermitApplications: builder.query<
      { content: any[]; meta: { totalCount: number; page: number; limit: number } },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: "company",
        params: { page, size },
      }),
      providesTags: ["PermitApplication"],
      transformResponse: (response: {
        message: string;
        statusCode: number;
        meta: { totalCount: number; page: number; limit: number };
        content: any[];
      }) => ({
        content: response.content,
        meta: response.meta,
      }),
    }),

    getCompanyPermitApplicationByEntityId: builder.query<
      any,
      { entityId: string; page?: number; size?: number }
    >({
      query: ({ entityId, page = 1, size = 30 }) => ({
        url: `company/${entityId}`,
        params: { page, size },
      }),
      providesTags: ["PermitApplication"],
    }),
  }),
});

export const {
  useGetEntrepreneurPermitApplicationsQuery,
  useGetEntrepreneurPermitApplicationByEntityIdQuery,
  useGetCompanyPermitApplicationsQuery,
  useGetCompanyPermitApplicationByEntityIdQuery,
} = permitApplicationApi;