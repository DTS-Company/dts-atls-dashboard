import { TCity } from "../../Reference/City/types/types";
import { TCompanyType } from "../../Reference/CompanyType/types/types";
import { TCountry } from "../../Reference/Country/types/types";
import { TDistrict } from "../../Reference/District/types/types";
import { TProperty } from "../../Reference/Property/types/types";
import { TStatus } from "../../Reference/Status/types/type";

export type TCompany = {
  id: string;
  userType: string;
  shortName: string;
  subdivision: string;
  tin: string;
  ein: string;
  kpp: string;
  name: string;
  companyTypeID: string;
  companyType: TCompanyType;
  office: string;
  districtID: string;
  district: TDistrict;
  address: string;
  actualAddress: string;
  activityStatusID: string;
  activityStatus: TStatus;
  countryID: string;
  country: TCountry;
  latitude: string;
  longitude: string;
  propertyID: string;
  property: TProperty;
  cityID: string;
  city: TCity;
  username: string; // phoneNumber
};

export type TCompanyUser = {
  name: string;
  userName: string;
};
