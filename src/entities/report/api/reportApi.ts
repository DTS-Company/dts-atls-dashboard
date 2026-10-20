import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@shared/api/baseApi";
import { cleanParams, TQueryParams } from "@shared/lib/cleanParams";
import { getFileName, saveBlob } from "@shared/lib/file";

// Отчёты ведомства (Swagger atls-waybill-report)
export const atlsReportApi = createApi({
  reducerPath: "atlsReportApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    /** Отчёт целиком: content (+ meta у журнала осмотров) */
    getAtlsReport: builder.query<
      { content: unknown; meta?: { totalCount: number } },
      { slug: string; params: TQueryParams }
    >({
      query: ({ slug, params }) => ({
        url: `atls/report/${slug}`,
        params: cleanParams(params),
      }),
    }),

    /**
     * Excel скачивается запросом с токеном (простая ссылка получит 401).
     * Файл сохраняется прямо в responseHandler, чтобы Blob не попадал в store.
     */
    downloadAtlsReportExcel: builder.mutation<
      null,
      { slug: string; params: TQueryParams; fileName: string }
    >({
      query: ({ slug, params, fileName }) => ({
        url: `atls/report/${slug}/excel`,
        params: cleanParams(params),
        responseHandler: async (response: Response) => {
          if (!response.ok) return response.json().catch(() => null);
          saveBlob(await response.blob(), getFileName(response, fileName));
          return null;
        },
      }),
    }),
  }),
});

export const { useGetAtlsReportQuery, useDownloadAtlsReportExcelMutation } =
  atlsReportApi;
