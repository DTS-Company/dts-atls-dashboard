import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@baseApi";
import { TSubdivisionsResponse } from "../types/types";

export const companySubdivisionsApi = createApi({
  reducerPath: "companySubdivisionsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Subdivision"],
  endpoints: (builder) => ({
    getCompanySubdivisions: builder.query<
      TSubdivisionsResponse,
      { id: string; page: number; size: number }
    >({
      query: ({ id, page, size }) => ({
        url: "company/subdivisions",
        params: {
          id,
          page,
          size,
        },
      }),
      providesTags: ["Subdivision"],
      transformResponse: (response: TSubdivisionsResponse) => response,
    }),
  }),
});

export const { useGetCompanySubdivisionsQuery } = companySubdivisionsApi;
