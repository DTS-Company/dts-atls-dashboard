import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../../../baseApi";

export const fileApi = createApi({
  reducerPath: "fileApi",
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    uploadFile: builder.mutation<
      { url: string },
      { entityId: string; file: File }
    >({
      query: ({ entityId, file }) => {
        const formData = new FormData();
        formData.append("file", file, file.name);

        return {
          url: `storage/upload/${entityId}`,
          method: "POST",
          body: formData,
          responseHandler: (response: any) => response.text(),
        };
      },
      transformResponse: (response: string) => ({ url: response }),
    }),

    readFile: builder.query<Blob, { entityId: string; filename: string }>({
      query: ({ entityId, filename }) => {
        const token = localStorage.getItem("access_token");
        return {
          url: `storage/read/${entityId}/${filename}?token=${token}`,
          method: "GET",
          responseHandler: async (response: any) => {
            if (!response.ok) throw new Error("Ошибка загрузки файла");
            return response.blob(); 
          },
        };
      },
    }),
  }),
});

export const { useUploadFileMutation, useReadFileQuery } = fileApi;
