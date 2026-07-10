export type TCountry = {
  id: string;
  name: string;
  code: string;
};

export type TCity = {
  id: string;
  name: string;
};

export type TDistrict = {
  id: string;
  name: string;
};

export type TSubdivision = {
  id: string;
  createdBy: string;
  updatedBy: string;
  userType: "COMPANY";
  name: string;
  shortName: string;
  subdivision: string;
  tin: string;
  ein: string;
  kpp: string;
  country: TCountry;
  city: TCity;
  district: TDistrict;
  office: string;
  address: string;
  companyType: string | null;
  activityStatus: string | null;
  actualAddress: string | null;
  latitude: string;
  longitude: string;
  property: any | null;
};

export type TSubdivisionsMeta = {
  totalCount: number;
  page: number;
  limit: number;
};

export type TSubdivisionsResponse = {
  message: string;
  statusCode: number;
  meta: TSubdivisionsMeta;
  total: number | null;
  content: TSubdivision[];
};
