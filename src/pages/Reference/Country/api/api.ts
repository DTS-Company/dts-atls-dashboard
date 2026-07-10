import { createApi } from "@reduxjs/toolkit/query/react";
import { TCountry } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const countryApi = createApi({
  reducerPath: "countryApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Country"],
  endpoints: (builder) => ({
    getCountry: builder.query<TCountry[], void>({
      query: () => ({
        url: "country/",
        params: {
          page: 0,
          size: 1000,
          sort: "id",
        },
      }),
      providesTags: ["Country"],
      transformResponse: (response: { content: TCountry[] }) => response.content,
    }),

    addCountry: builder.mutation<void, TCountry>({
      query: (newCountry) => ({
        url: "country/",
        method: "POST",
        body: newCountry,
      }),
      invalidatesTags: ["Country"],
    }),

    deleteCountry: builder.mutation<void, string>({
      query: (id) => ({
        url: `country/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Country"],
    }),

    editCountry: builder.mutation<void, TCountry>({
      query: (country) => ({
        url: `country/${country.id}`,
        method: "PUT",
        body: country,
      }),
      invalidatesTags: ["Country"],
    }),
  }),
});

export const {
  useGetCountryQuery,
  useAddCountryMutation,
  useDeleteCountryMutation,
  useEditCountryMutation,
} = countryApi;
