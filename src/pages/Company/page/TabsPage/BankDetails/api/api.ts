import { createApi } from "@reduxjs/toolkit/query/react";
import { TBankDetailsType } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const bankDetailsApi = createApi({
  reducerPath: "bankDetailsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["BankDetailsType"],
  endpoints: (builder) => ({
    getBankDetailsById: builder.query<
      TBankDetailsType,
      { entityId: string; id: string }
    >({
      query: ({ entityId, id }) => `${entityId}/bank-details/${id}`,
      providesTags: ["BankDetailsType"],
    }),

    updateBankDetails: builder.mutation<
      TBankDetailsType,
      { entityId: string; id: string; data: Partial<TBankDetailsType> }
    >({
      query: ({ entityId, id, data }) => ({
        url: `${entityId}/bank-details/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["BankDetailsType"],
    }),

    deleteBankDetails: builder.mutation<void, { entityId: string; id: string }>(
      {
        query: ({ entityId, id }) => ({
          url: `${entityId}/bank-details/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["BankDetailsType"],
      }
    ),

    getAllBankDetails: builder.query<TBankDetailsType[], { entityId: string }>({
      query: ({ entityId }) => `${entityId}/bank-details/`,
      transformResponse: (response: { content: TBankDetailsType[] }) =>
        response.content,
      providesTags: ["BankDetailsType"],
    }),

    createBankDetails: builder.mutation<
      TBankDetailsType,
      { entityId: string; data: Partial<TBankDetailsType> }
    >({
      query: ({ entityId, data }) => ({
        url: `${entityId}/bank-details/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BankDetailsType"],
    }),

    updateDefaultBank: builder.mutation<
      { message: string; content: string },
      { entityId: string; id: string }
    >({
      query: ({ entityId, id }) => ({
        url: `${entityId}/bank-details/defaultBank/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["BankDetailsType"],
    }),
  }),
});

export const {
  useGetBankDetailsByIdQuery,
  useUpdateBankDetailsMutation,
  useDeleteBankDetailsMutation,
  useGetAllBankDetailsQuery,
  useCreateBankDetailsMutation,
  useUpdateDefaultBankMutation,
} = bankDetailsApi;
