import { createApi } from "@reduxjs/toolkit/query/react";
import {
  TFormDetails,
  TLicence,
  TLicenceListRequest,
  TLicenceStatus,
} from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const licenceApi = createApi({
  reducerPath: "licenceApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Licence"],
  endpoints: (builder) => ({
    getLicences: builder.query<
      {
        data: TLicence[];
        current_page: number;
        per_page: number;
        total: number;
      },
      TLicenceListRequest
    >({
      query: (params) => ({
        url: "licence/list/all",
        method: "POST",
        body: params,
      }),
      providesTags: ["Licence"],
    }),

    getLicenceStatuses: builder.query<TLicenceStatus[], void>({
      query: () => "licence/statuses",
      transformResponse: (response: any) => response.content,
    }),

    getFormDetails: builder.query<TFormDetails, void>({
      query: () => "licence/form/details",
      transformResponse: (response: any) => response.content,
    }),

    addLicence: builder.mutation<void, Partial<TLicence>>({
      query: (licence) => ({
        url: "licence/",
        method: "POST",
        body: licence,
      }),
      invalidatesTags: ["Licence"],
    }),

    getLicenceDocument: builder.query<
      Blob,
      { clientId: number; clientToken: string }
    >({
      query: ({ clientId, clientToken }) => ({
        url: "licence/document",
        method: "GET",
        params: { clientId, clientToken },
        responseHandler: (response: any) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetLicencesQuery,
  useGetLicenceStatusesQuery,
  useGetFormDetailsQuery,
  useAddLicenceMutation,
  useGetLicenceDocumentQuery,
  useLazyGetLicenceDocumentQuery,
} = licenceApi;
