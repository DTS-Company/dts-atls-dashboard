export const getAccessToken = (): string | null =>
  localStorage.getItem("access_token");

export const getRefreshToken = (): string | null =>
  localStorage.getItem("refresh_token");

export const setTokens = (access: string, refresh: string): void => {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
};

export const clearTokens = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const hasTokens = (): boolean =>
  !!getAccessToken() && !!getRefreshToken();

// http://localhost:8089/registeredIndividuals/INDIVIDUAL/edit/4d8b7233-0359-4d1d-9853-1b982cf6ebd9/documents/DOC_USER
// http://localhost:8089/registeredIndividuals/INDIVIDUAL/view/4d8b7233-0359-4d1d-9853-1b982cf6ebd9/documents/DOC_USER
