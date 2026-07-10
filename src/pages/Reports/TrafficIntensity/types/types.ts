export type TTrafficIntensityRecord = {
  checkpoint: string;
  plateNumber: string;
  time: string;
  speed: number;
  vehicleType: string;
};

export type TTrafficIntensityResponse = {
  message: string;
  statusCode: number;
  meta: {
    totalCount: number;
    page: number;
    limit: number;
  };
  total: null;
  content: TTrafficIntensityRecord[];
};
