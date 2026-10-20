// Пункты меню «Путевые листы»: по одному на форму.
// Фильтра «автобус/троллейбус» в API нет, поэтому виды из прототипа указаны в названии.
export const WAYBILL_MENU = [
  { slug: "all", form: "" },
  { slug: "1ad", form: "FORM_1AD" },
  { slug: "1a", form: "FORM_1A" },
  { slug: "2b", form: "FORM_2B" },
  { slug: "5bbm", form: "FORM_5BBM" },
  { slug: "3c", form: "FORM_3C" },
] as const;

export const findWaybillMenu = (slug?: string) =>
  WAYBILL_MENU.find((item) => item.slug === slug);

export const getWaybillListPath = (slug: string) => `/waybills/${slug}`;
export const getWaybillCardPath = (id: string) => `/waybill/${id}`;
