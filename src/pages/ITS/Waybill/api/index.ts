import { baseQueryWithReauth } from "@baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";

interface Waybill3cItem {
  id: number;
  number: string;
  exit_date: string;
  entry_date: string;
  doctor_id: number | null;
  mechanic_id: number | null;
  timesheet: {
    full_name: string;
    rma: string;
  };
  parking: {
    registration_number: string;
    transport_type_id: number;
  };
}

interface Waybill3cResponse {
  data: Waybill3cItem[];
  total: number;
  current_page: number;
  per_page: number;
}

interface GetWaybill3cParams {
  organizationRma?: string;
  organizationKpp?: string;
  employeeRma?: string;
  driverRma?: string;
  transportRegistrationNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  perPage?: number;
  page?: number;
}

export const waybillApi = createApi({
  reducerPath: "waybillApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Waybill3c"],
  endpoints: (builder) => ({
    getWaybill3cList: builder.query<Waybill3cResponse, GetWaybill3cParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params.organizationRma)
          queryParams.append("organizationRma", params.organizationRma);
        if (params.organizationKpp)
          queryParams.append("organizationKpp", params.organizationKpp);
        if (params.employeeRma)
          queryParams.append("employeeRma", params.employeeRma);
        if (params.driverRma) queryParams.append("driverRma", params.driverRma);
        if (params.transportRegistrationNumber)
          queryParams.append(
            "transportRegistrationNumber",
            params.transportRegistrationNumber,
          );
        if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
        if (params.dateTo) queryParams.append("dateTo", params.dateTo);
        if (params.perPage)
          queryParams.append("perPage", params.perPage.toString());
        if (params.page) queryParams.append("page", params.page.toString());

        return `/rohkhat/waybill3c?${queryParams.toString()}`;
      },
      providesTags: ["Waybill3c"],
    }),
  }),
});

export const { useGetWaybill3cListQuery } = waybillApi;
