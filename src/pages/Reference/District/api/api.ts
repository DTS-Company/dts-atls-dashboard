import { createApi } from "@reduxjs/toolkit/query/react";
import { TDistrict } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const districtApi = createApi({
  reducerPath: "districtApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["District"],
  endpoints: (builder) => ({
    getDistrict: builder.query<TDistrict[], void>({
      query: () => ({
        url: "district/",
        params: {
          page: 0,
          size: 1000,
          sort: "id",
        },
      }),
      providesTags: ["District"],
      transformResponse: (response: { content: TDistrict[] }) =>
        response.content,
    }),

    addDistrict: builder.mutation<void, TDistrict>({
      query: (newDistrict) => ({
        url: "district/",
        method: "POST",
        body: newDistrict,
      }),
      invalidatesTags: ["District"],
    }),

    deleteDistrict: builder.mutation<void, string>({
      query: (id) => ({
        url: `district/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["District"],
    }),

    editDistrict: builder.mutation<void, TDistrict>({
      query: (district) => ({
        url: `district/${district.id}`,
        method: "PUT",
        body: district,
      }),
      invalidatesTags: ["District"],
    }),
  }),
});

export const {
  useGetDistrictQuery,
  useAddDistrictMutation,
  useDeleteDistrictMutation,
  useEditDistrictMutation,
} = districtApi;
