import { createApi } from "@reduxjs/toolkit/query/react";
import { Permission } from "../model/types";
import { baseQueryWithReauth } from "@shared/api/baseApi";

export const permissionsApi = createApi({
  reducerPath: "permissionsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getPermissions: builder.query<Permission[], void>({
      query: () => "role-permission/",
      transformResponse: (response: { content: Permission[] }) =>
        response.content,
    }),
  }),
});

export const { useGetPermissionsQuery } = permissionsApi;
