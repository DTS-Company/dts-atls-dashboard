import i18next from "i18next";

type ApiErrorBody = {
  message?: string;
  content?: unknown;
  error?: {
    violations?: { message?: string }[];
  };
};

type ApiError = {
  status?: number | string;
  data?: unknown;
};

const toRecordMessages = (value: unknown): string[] => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.entries(value as Record<string, unknown>)
    .filter(([, text]) => typeof text === "string")
    .map(([field, text]) => `${field}: ${text}`);
};

const getViolationMessages = (body: ApiErrorBody): string[] =>
  (body.error?.violations ?? [])
    .map((violation) => violation.message)
    .filter((text): text is string => Boolean(text));

/**
 * Превращает ошибку RTK Query в текст для пользователя.
 * 400 — message или ошибки по полям, 409 — запись изменилась,
 * 422 — список нарушений допуска.
 */
export const getApiErrorMessage = (error: unknown, fallback?: string): string => {
  const { status, data } = (error ?? {}) as ApiError;
  const body = (data && typeof data === "object" ? data : {}) as ApiErrorBody;

  switch (status) {
    case 400: {
      if (body.message === "Validation failed") {
        const fields = toRecordMessages(body.content);
        if (fields.length) return fields.join("\n");
      }
      return body.message ?? fallback ?? i18next.t("common.errors.bad_request");
    }
    case 403:
      return i18next.t("common.errors.forbidden");
    case 404:
      return body.message ?? i18next.t("common.errors.not_found");
    case 409:
      return body.message ?? i18next.t("common.errors.conflict");
    case 422: {
      const violations = getViolationMessages(body);
      if (violations.length) return violations.join("\n");
      const fields = toRecordMessages(data);
      if (fields.length) return fields.join("\n");
      return body.message ?? i18next.t("common.errors.unprocessable");
    }
    case 500:
      return i18next.t("common.errors.server");
    case "FETCH_ERROR":
      return i18next.t("common.errors.network");
    default:
      return body.message ?? fallback ?? i18next.t("common.errors.unknown");
  }
};
