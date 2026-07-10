import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@baseApi";
import { TDocUploadPolicy } from "../types/types";
import {
  DocUploadPolicy,
  DocUploadPolicyFormData,
} from "../types/docUploadPolicyConstants";

export const docUploadPolicyApi = createApi({
  reducerPath: "docUploadPolicyApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["docUploadPolicy"], 
  endpoints: (builder) => ({
    getAllDocUploadPolicy: builder.query<
      { content: TDocUploadPolicy[]; meta: any },
      {
        userType?: string;
        docType?: string;
        docView?: string;
        externalApi?: string;
        requirement?: string;
        page?: number;
        size?: number;
        sort?: string;
      }
    >({
      query: (params = {}) => {
        const {
          userType,
          docType,
          docView,
          externalApi,
          requirement,
          page = 0,
          size = 5,
          sort = "id",
        } = params;

        const queryParams: Record<string, string | number> = {
          page,
          size,
          sort,
        };

        if (userType) queryParams.userType = userType;
        if (docType) queryParams.docType = docType;
        if (docView) queryParams.docView = docView;
        if (externalApi) queryParams.externalApi = externalApi;
        if (requirement) queryParams.requirement = requirement;

        return {
          url: "document-upload-policy/",
          params: queryParams,
        };
      },
      providesTags: ["docUploadPolicy"], 
    }),

    createDocUploadPolicy: builder.mutation({
      query: (body) => ({
        url: "document-upload-policy/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["docUploadPolicy"], 
    }),

    updateDocUploadPolicy: builder.mutation<
      DocUploadPolicy,
      { id: string; data: DocUploadPolicyFormData }
    >({
      query: ({ id, data }) => ({
        url: `/document-upload-policy/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["docUploadPolicy"],
    }),
  }),
});

export const {
  useGetAllDocUploadPolicyQuery,
  useCreateDocUploadPolicyMutation,
  useUpdateDocUploadPolicyMutation, 
} = docUploadPolicyApi;
