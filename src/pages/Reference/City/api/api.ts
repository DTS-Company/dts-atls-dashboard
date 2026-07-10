import { createApi } from "@reduxjs/toolkit/query/react";
import { TCity } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const cityApi = createApi({
  reducerPath: "cityApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["City"],
  endpoints: (builder) => ({
    getCity: builder.query<TCity[], void>({
      query: () => ({
        url: "city/",
        params: {
          page: 0,
          size: 1000,
          sort: "id",
        },
      }),
      providesTags: ["City"],
      transformResponse: (response: { content: TCity[] }) => response.content,
    }),

    addCity: builder.mutation<void, TCity>({
      query: (newCity) => ({
        url: "city/",
        method: "POST",
        body: newCity,
      }),
      invalidatesTags: ["City"],
    }),

    deleteCity: builder.mutation<void, string>({
      query: (id) => ({
        url: `city/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["City"],
    }),

    editCity: builder.mutation<void, TCity>({
      query: (city) => ({
        url: `city/${city.id}`,
        method: "PUT",
        body: city,
      }),
      invalidatesTags: ["City"],
    }),
  }),
});

export const {
  useGetCityQuery,
  useAddCityMutation,
  useDeleteCityMutation,
  useEditCityMutation,
} = cityApi;
