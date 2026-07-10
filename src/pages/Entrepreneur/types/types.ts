import { TCity } from "../../Reference/City/types/types";
import { TCountry } from "../../Reference/Country/types/types";
import { TDistrict } from "../../Reference/District/types/types";
import { TStatus } from "../../Reference/Status/types/type";

export type TEntrepreneur = {
    id: string;
    userType:string;
    name: string;
    tin: string;
    ein:string;

    countryID: string;
    country: TCountry;

    office: string;
    districtID: string;
    district: TDistrict;

    address: string;

    activityStatusID: string;
    activityStatus: TStatus;

    actualAddress: string;

    cityID:string;
    city:TCity

    username: string; // phoneNumber
  };
