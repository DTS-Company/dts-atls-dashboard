import { createApi } from "@reduxjs/toolkit/query/react";
import { TProperty } from "../types/types";
import { baseQueryWithReauth } from "@baseApi";

export const propertyApi = createApi({
  reducerPath: "propertyApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Property"],
  endpoints: (builder) => ({
    getProperty: builder.query<TProperty[], void>({
      query: () => ({
        url: "property/",
        params: { size: 1000, sort: "id" },
      }),
      providesTags: ["Property"],
      transformResponse: (response: { content: TProperty[] }) =>
        response.content,
    }),

    addProperty: builder.mutation<void, TProperty>({
      query: (newProperty) => ({
        url: "property/",
        method: "POST",
        body: newProperty,
      }),
      invalidatesTags: ["Property"],
    }),

    deleteProperty: builder.mutation<void, string>({
      query: (id) => ({
        url: `property/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Property"],
    }),

    editProperty: builder.mutation<void, TProperty>({
      query: (property) => ({
        url: `property/${property.id}`,
        method: "PUT",
        body: property,
      }),
      invalidatesTags: ["Property"],
    }),
  }),
});

export const {
  useGetPropertyQuery,
  useAddPropertyMutation,
  useDeletePropertyMutation,
  useEditPropertyMutation,
} = propertyApi;
