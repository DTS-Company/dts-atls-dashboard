import { BaseQueryFn, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, API_BASE_URL_REG } from "./apiConfig";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./auth";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    const errorData = result.error.data as { error?: string };
    if (errorData?.error === "Token expired") {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const refreshQuery = fetchBaseQuery({
            baseUrl: API_BASE_URL,
            prepareHeaders: (headers) => {
              headers.set("Authorization", `Bearer ${refreshToken}`);
              headers.set("accept", "*/*");
              return headers;
            },
          });
          const refreshResult = await refreshQuery(
            {
              url: "auth/refresh-token",
              method: "POST",
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const { access_token, refresh_token } = refreshResult.data as any;
            setTokens(access_token, refresh_token);
            const retryResult = await baseQuery(args, api, extraOptions);
            console.groupEnd();
            return retryResult;
          }
          if (refreshResult.error?.status === 401) {
            const refreshError = refreshResult.error.data as { error?: string };
            if (
              refreshError?.error ===
                "Refresh token is not recognized or revoked" ||
              refreshError?.error === "Token expired"
            ) {
              clearTokens();
              window.location.href = API_BASE_URL_REG;
            }
          }
        } catch (error) {
          if (error instanceof TypeError) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return await baseQueryWithReauth(args, api, extraOptions);
          }
        }
      } else {
        clearTokens();
        window.location.href = API_BASE_URL_REG;
      }
    } else if (errorData?.error === "Invalid token") {
      clearTokens();
      window.location.href = API_BASE_URL_REG;
    }
  }
  console.groupEnd();
  return result;
};
