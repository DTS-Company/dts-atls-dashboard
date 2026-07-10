import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@baseApi";
import { TTrafficIntensityResponse } from "../types/types";

export const trafficIntensityApi = createApi({
  reducerPath: "trafficIntensityApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getTrafficIntensity: builder.query<
      TTrafficIntensityResponse,
      { date: string; page?: number; size?: number }
    >({
      query: ({ date, page = 0, size = 8 }) =>
        `reports/traffic/traffic-intensity/parsed?date=${date}&page=${page}&size=${size}`,
    }),
  }),
});

export const { useGetTrafficIntensityQuery } = trafficIntensityApi;
