import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@baseApi";
import { TDocument } from "@pages/Entrepreneur/page/TabsPage/DocumentEntrepreneur/types/types";

export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Document"],
  endpoints: (builder) => ({
    getDocuments: builder.query<TDocument[], { entityId: string }>({
      query: ({ entityId }) => `${entityId}/document/`,
      providesTags: ["Document"],
      transformResponse: (response: { content: TDocument[] }) =>
        response.content,
    }),

    createDocument: builder.mutation<
      TDocument,
      { entityId: string; data: Partial<TDocument> }
    >({
      query: ({ entityId, data }) => ({
        url: `${entityId}/document/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Document"],
    }),

    updateDocument: builder.mutation<
      TDocument,
      { entityId: string; id: string; data: Partial<TDocument> }
    >({
      query: ({ entityId, id, data }) => ({
        url: `${entityId}/document/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Document"],
    }),

    deleteDocument: builder.mutation<void, { entityId: string; id: string }>({
      query: ({ entityId, id }) => ({
        url: `${entityId}/document/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Document"],
    }),

    getDocumentByType: builder.query<
      TDocument[],
      { entityId: string; docType: string }
    >({
      query: ({ entityId, docType }) =>
        `${entityId}/document/doc-type/${docType}`,
      transformResponse: (response: { content: TDocument[] }) =>
        response.content,
      providesTags: ["Document"],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetDocumentByTypeQuery,
} = documentApi;
