import { createApi } from "@reduxjs/toolkit/query/react";
import { TDocumentType, TNewDocumentType } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const documentTypeApi = createApi({
  reducerPath: "documentTypeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["DocumentType"],
  endpoints: (builder) => ({
    getDocumentType: builder.query<
      TDocumentType[],
      { doctype: string; userType: string }
    >({
      query: ({ doctype, userType }) => ({
        url: "document-type/type/",
        params: { doctype, userType },
      }),
      providesTags: ["DocumentType"],
      transformResponse: (response: {
        message: string;
        statusCode: number;
        meta: {
          totalCount: number;
          page: number;
          limit: number;
        };
        content: TDocumentType[];
      }) => response.content,
    }),

    getAllDocumentTypes: builder.query<
      { content: TDocumentType[]; meta: any },
      { page?: number; size?: number; sort?: string }
    >({
      query: ({ page = 0, size = 1000, sort = "id" }) => ({
        url: "document-type/",
        params: { page, size, sort },
      }),
      providesTags: ["DocumentType"],
    }),

    getDocumentTypeById: builder.query<TDocumentType, string>({
      query: (id) => `document-type/${id}`,
      providesTags: (_result, _error, id) => [{ type: "DocumentType", id }],
    }),

    addDocumentType: builder.mutation<TDocumentType, TNewDocumentType>({
      query: (newDocumentType) => ({
        url: "document-type/",
        method: "POST",
        body: newDocumentType,
      }),
      invalidatesTags: ["DocumentType"],
    }),

    deleteDocumentType: builder.mutation<void, string>({
      query: (id) => ({
        url: `document-type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DocumentType"],
    }),

    editDocumentType: builder.mutation<TDocumentType, TDocumentType>({
      query: (documentType) => ({
        url: `document-type/${documentType.id}`,
        method: "PUT",
        body: documentType,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "DocumentType", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetDocumentTypeQuery,
  useGetAllDocumentTypesQuery,
  useGetDocumentTypeByIdQuery,
  useAddDocumentTypeMutation,
  useDeleteDocumentTypeMutation,
  useEditDocumentTypeMutation,
} = documentTypeApi;
