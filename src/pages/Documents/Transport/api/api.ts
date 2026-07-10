import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@baseApi";
import { GetTransportDocsParams, TransportDocsResponse } from "../types/types";

export const transportDocApi = createApi({
  reducerPath: "transportDocApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["TransportDocs", "TransportTemporary"],
  endpoints: (builder) => ({
    getTransportDocuments: builder.query<
      TransportDocsResponse,
      GetTransportDocsParams
    >({
      query: (params) => ({
        url: "checkstatus/document/transport",
        params: {
          userType: params.userType,
          page: params.page,
          size: params.size,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ entityId, typeId }) => ({
                type: "TransportDocs" as const,
                id: `${entityId}-${typeId}`,
              })),
              { type: "TransportDocs", id: "LIST" },
            ]
          : [{ type: "TransportDocs", id: "LIST" }],
    }),

    getTransportTemporaryStatus: builder.query<
      {
        message: string;
        statusCode: number;
        meta: {
          totalCount: number;
          page: number;
          limit: number;
        };
        total: null;
        content: Array<{
          transportId: string;
          contractNumber: string;
          detachmentDate: string;
          createdAt: string;
          entityId: string;
          checkStatus: string;
          licensePlate: string;
          entityName: string;
          id: string;
        }>;
      },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `transport/checkstatus/temporary`,
        params: { page, size },
      }),
      providesTags: ["TransportTemporary"],
    }),
    updateTransportTemporaryStatus: builder.mutation<
      { message: string; statusCode: number },
      { id: string; status: number }
    >({
      query: ({ id, status }) => ({
        url: `transport/checkstatus/temporary/approval`,
        method: "POST",
        params: { id, status },
      }),
      invalidatesTags: ["TransportTemporary"],
    }),
  }),
});

export const {
  useGetTransportDocumentsQuery,
  useGetTransportTemporaryStatusQuery,
  useUpdateTransportTemporaryStatusMutation,
} = transportDocApi;
