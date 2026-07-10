import { createApi } from "@reduxjs/toolkit/query/react";
import { TResponsiblePerson } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const responsiblePersonApi = createApi({
  reducerPath: "responsiblePersonApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ResponsiblePerson"],
  endpoints: (builder) => ({
    getResponsiblePersonById: builder.query<
      TResponsiblePerson,
      { entityId: string; id: string }
    >({
      query: ({ entityId, id }) => `${entityId}/responsibleperson/${id}`,
      providesTags: ["ResponsiblePerson"],
    }),
    updateResponsiblePerson: builder.mutation<
      TResponsiblePerson,
      { entityId: string; id: string; data: Partial<TResponsiblePerson> }
    >({
      query: ({ entityId, id, data }) => ({
        url: `${entityId}/responsibleperson/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ResponsiblePerson"],
    }),
    deleteResponsiblePerson: builder.mutation<
      void,
      { entityId: string; id: string }
    >({
      query: ({ entityId, id }) => ({
        url: `${entityId}/responsibleperson/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ResponsiblePerson"],
    }),
    getAllResponsiblePerson: builder.query<
      TResponsiblePerson[],
      { entityId: string }
    >({
      query: ({ entityId }) => `${entityId}/responsibleperson/`,
      transformResponse: (response: { content: TResponsiblePerson[] }) =>
        response.content,
      providesTags: ["ResponsiblePerson"],
    }),
    createResponsiblePerson: builder.mutation<
      TResponsiblePerson,
      { entityId: string; data: Partial<TResponsiblePerson> }
    >({
      query: ({ entityId, data }) => ({
        url: `${entityId}/responsibleperson/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ResponsiblePerson"],
    }),

    updateSigningAuthority: builder.mutation<
      { message: string; content: string },
      { entityId: string; id: string }
    >({
      query: ({ entityId, id }) => ({
        url: `${entityId}/responsibleperson/signingAuthority/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["ResponsiblePerson"],
    }),
  }),
});

export const {
  useGetResponsiblePersonByIdQuery,
  useUpdateResponsiblePersonMutation,
  useDeleteResponsiblePersonMutation,
  useGetAllResponsiblePersonQuery,
  useCreateResponsiblePersonMutation,
  useUpdateSigningAuthorityMutation,
} = responsiblePersonApi;
