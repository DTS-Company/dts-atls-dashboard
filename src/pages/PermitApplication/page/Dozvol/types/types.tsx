export type TDozvol = {
  id: string;
  doc_num: string;
  id_country: string;
  permit_type: string;
  ser: string;
  num_start: string;
  num_end: string;
  date_expiry: string;
};

export type TMetaPermit = {
  permit_type: string;
  permit_Name: string;
};

export type TMetaCountry = {
  country_code: string;
  country_Name: string;
};

export type TBlanksStats = {
  id: string;
  country_FullName: string;
  permit_type_FullName: string;
  cnt: number;
};
