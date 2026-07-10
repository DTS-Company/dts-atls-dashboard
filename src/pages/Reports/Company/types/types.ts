type TCompanyReport = {
  district_name: string;
  transport_count: number;
  individual_count: number;
  city_name: string;
  tin: string;
  office: string;
  name: string;
  id: string;
  address: string;
  created_at: string;
  updated_at: string;
  created_by_name: string;
  updated_by_name: string;
};

export type TCompanyReportsResponse = {
  message: string;
  statusCode: number;
  meta: {
    totalCount: number;
    page: number;
    limit: number;
  };
  total: {
    individual: number;
    transport: number;
  };
  content: TCompanyReport[];
};
