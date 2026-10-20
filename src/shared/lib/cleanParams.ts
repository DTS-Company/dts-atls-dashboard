export type TQueryParams = Record<string, string | number | undefined>;

/** Убирает пустые параметры, чтобы не отправлять ?status=&companyId= */
export const cleanParams = (params: TQueryParams) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );
