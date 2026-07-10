import { createApi } from "@reduxjs/toolkit/query/react";
import { TCompanyType } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const companyTypeApi = createApi({
  reducerPath: "companyTypeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CompanyType"],
  endpoints: (builder) => ({
    getCompanyType: builder.query<TCompanyType[], void>({
      query: () => ({
        url: "companytype/",
        params: {
          page: 0,
          size: 1000,
          sort: "id",
        },
      }),
      providesTags: ["CompanyType"],
      transformResponse: (response: { content: TCompanyType[] }) =>
        response.content,
    }),

    addCompanyType: builder.mutation<void, TCompanyType>({
      query: (newCompanyType) => ({
        url: "companytype/",
        method: "POST",
        body: newCompanyType,
      }),
      invalidatesTags: ["CompanyType"],
    }),

    deleteCompanyType: builder.mutation<void, string>({
      query: (id) => ({
        url: `companytype/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CompanyType"],
    }),

    editCompanyType: builder.mutation<void, TCompanyType>({
      query: (companytype) => ({
        url: `companytype/${companytype.id}`,
        method: "PUT",
        body: companytype,
      }),
      invalidatesTags: ["CompanyType"],
    }),
  }),
});

export const {
  useGetCompanyTypeQuery,
  useAddCompanyTypeMutation,
  useDeleteCompanyTypeMutation,
  useEditCompanyTypeMutation,
} = companyTypeApi;
