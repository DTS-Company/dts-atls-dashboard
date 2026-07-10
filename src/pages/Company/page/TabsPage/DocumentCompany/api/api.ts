import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@baseApi";
import { TDocument } from "@pages/Entrepreneur/page/TabsPage/DocumentEntrepreneur/types/types";

export interface TCheckStatusDocument {
  createdAt: string;
  tin: string;
  entityId: string;
  entityName: string;
  typeId: string;
  typeName: string;
  checkStatus: string;
}

export interface TCheckStatusResponse {
  message: string;
  statusCode: number;
  meta: {
    totalCount: number;
    page: number;
    limit: number;
  };
  content: TCheckStatusDocument[];
}

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

    getDocumentsForChecking: builder.query<
      TCheckStatusResponse,
      { userType: string; page: number; size: number }
    >({
      query: ({ userType, page, size }) => ({
        url: `checkstatus/document`,
        params: { userType, page, size },
      }),
      providesTags: ["Document"],
    }),

    getDocumentType: builder.query<
      {
        content: {
          id: string;
          name: string;
          userType: string[];
          docType: string;
        };
      },
      string
    >({
      query: (typeId) => `document-type/${typeId}`,
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetDocumentByTypeQuery,
  useGetDocumentsForCheckingQuery,
  useGetDocumentTypeQuery,
  useLazyGetDocumentTypeQuery,
} = documentApi;
