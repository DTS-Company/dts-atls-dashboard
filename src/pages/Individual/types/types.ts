import { TCity } from "../../Reference/City/types/types";
import { TCountry } from "../../Reference/Country/types/types";
import { TDistrict } from "../../Reference/District/types/types";
import { TStatus } from "../../Reference/Status/types/type";

export type TIndividual = {
  id: string;
  tin: string;
  individualName: string;
  individualType: string;

  countryID: string;
  country: TCountry;

  cityID: string;
  city: TCity;

  office: string;

  districtID: string;
  district: TDistrict;

  address: string;

  activityStatusID: string;
  activityStatus: TStatus;
  username: string;
};

export type TIndividualResponse = {
  message: string;
  statusCode: number;
  meta: {
    totalCount: number;
    page: number;
    limit: number;
  };
  total: number | null;
  content: TIndividual[];
};
