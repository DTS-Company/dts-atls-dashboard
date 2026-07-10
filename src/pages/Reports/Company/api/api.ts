import { createApi } from "@reduxjs/toolkit/query/react";
import { TCompanyReportsResponse } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const companyReportsApi = createApi({
  reducerPath: "companyReportsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getCompanyReports: builder.query<
      TCompanyReportsResponse,
      { city?: string; district?: string; page: number; size: number }
    >({
      query: ({ city, district, page, size }) => {
        const params = new URLSearchParams({
          page: String(page),
          size: String(size),
        });

        if (city) params.append("city", city);
        if (district) params.append("district", district);
        return `reports/subjects/company?${params.toString()}`;
      },
    }),
  }),
});

export const { useGetCompanyReportsQuery } = companyReportsApi;
