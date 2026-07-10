import { createApi } from "@reduxjs/toolkit/query/react";
import { TContact } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const contactsApi = createApi({
  reducerPath: "contactsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Contacts"],
  endpoints: (builder) => ({
    getContactById: builder.query<TContact, { entityId: string; id: string }>({
      query: ({ entityId, id }) => `${entityId}/contact/${id}`,
      providesTags: ["Contacts"],
    }),

    updateContact: builder.mutation<
      TContact,
      { entityId: string; id: string; data: Partial<TContact> }
    >({
      query: ({ entityId, id, data }) => ({
        url: `${entityId}/contact/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Contacts"],
    }),

    deleteContact: builder.mutation<void, { entityId: string; id: string }>({
      query: ({ entityId, id }) => ({
        url: `${entityId}/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contacts"],
    }),

    getAllContacts: builder.query<TContact[], { entityId: string }>({
      query: ({ entityId }) => `${entityId}/contact/`,
      transformResponse: (response: { content: TContact[] }) =>
        response.content,
      providesTags: ["Contacts"],
    }),

    createContact: builder.mutation<
      TContact,
      { entityId: string; data: Partial<TContact> }
    >({
      query: ({ entityId, data }) => ({
        url: `${entityId}/contact/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Contacts"],
    }),

    updateDefaultContact: builder.mutation<
      { message: string; statusCode: number; meta: null; content: string },
      { entityId: string; id: string; type: string }
    >({
      query: ({ entityId, id, type }) => ({
        url: `${entityId}/contact/default/${id}?type=${type}`,
        method: "PUT",
      }),
      invalidatesTags: ["Contacts"],
    }),
  }),
});

export const {
  useGetContactByIdQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useGetAllContactsQuery,
  useCreateContactMutation,
  useUpdateDefaultContactMutation,
} = contactsApi;
