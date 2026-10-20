import { configureStore } from "@reduxjs/toolkit";
import { cityApi } from "@pages/Reference/City/api/api";
import { companyTypeApi } from "@pages/Reference/CompanyType/api/api";
import { countryApi } from "@pages/Reference/Country/api/api";
import { districtApi } from "@pages/Reference/District/api/api";
import { documentTypeApi } from "@pages/Reference/DocumentType/api/api";
import { permitApplicationListApi } from "@pages/Reference/PermitApplicationList/api/api";
import { propertyApi } from "@pages/Reference/Property/api/api";
import { statusApi } from "@pages/Reference/Status/api/api";
import { transportTypeApi } from "@pages/Reference/TranportType/api/api";
import { transportBrandApi } from "@pages/Reference/TransportBrand/api/api";
import { transportFuelApi } from "@pages/Reference/TransportFuel/api/api";
import { transportOwnerShipApi } from "@pages/Reference/TransportOwnerShip/api/api";
import { transportViewApi } from "@pages/Reference/TransportView/api/api";
import { transportOwnerTypeApi } from "@pages/Reference/TransportOwnerType/api/api";
import { individualApi } from "@pages/Individual/api/api";
import { companyApi } from "@pages/Company/api/api";
import { entrepreneurApi } from "@pages/Entrepreneur/api/api";
import { contactsApi } from "@pages/Individual/page/TabsPage/ContactIndividual/api/api";
import { bankDetailsApi } from "@pages/Company/page/TabsPage/BankDetails/api/api";
import { responsiblePersonApi } from "@pages/Company/page/TabsPage/ResponsiblePerson/api/api";
import { fileApi } from "@pages/Reference/Storage/reducers/files";
import { transportApi } from "@pages/Transport/api/api";
import { permitApplicationApi } from "@pages/PermitApplication/api/api";
import { dozvolApi } from "@pages/PermitApplication/page/Dozvol/api/api";
import { documentApi } from "@pages/Company/page/TabsPage/DocumentCompany/api/api";
import { permissionsApi } from "@permissions/permissionsApi";
import { companyReportsApi } from "@pages/Reports/Company/api/api";
import { licenceApi } from "@pages/ITS/Licensing/api/api";
import { trafficIntensityApi } from "@pages/Reports/TrafficIntensity/api/api";
import { companySubdivisionsApi } from "@pages/Company/page/TabsPage/Subdivisions/api/api";
import { docUploadPolicyApi } from "@pages/Reference/DocUploadPolicy/api/api";
import { transportDocApi } from "@pages/Documents/Transport/api/api";
import { waybillApi } from "@pages/ITS/Waybill/api";

export const store = configureStore({
  reducer: {
    [cityApi.reducerPath]: cityApi.reducer,
    [companyTypeApi.reducerPath]: companyTypeApi.reducer,
    [countryApi.reducerPath]: countryApi.reducer,
    [districtApi.reducerPath]: districtApi.reducer,
    [documentTypeApi.reducerPath]: documentTypeApi.reducer,
    [permitApplicationListApi.reducerPath]: permitApplicationListApi.reducer,
    [propertyApi.reducerPath]: propertyApi.reducer,
    [statusApi.reducerPath]: statusApi.reducer,
    [transportTypeApi.reducerPath]: transportTypeApi.reducer,
    [transportBrandApi.reducerPath]: transportBrandApi.reducer,
    [transportFuelApi.reducerPath]: transportFuelApi.reducer,
    [transportOwnerShipApi.reducerPath]: transportOwnerShipApi.reducer,
    [transportViewApi.reducerPath]: transportViewApi.reducer,
    [transportOwnerTypeApi.reducerPath]: transportOwnerTypeApi.reducer,
    [individualApi.reducerPath]: individualApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [entrepreneurApi.reducerPath]: entrepreneurApi.reducer,
    [contactsApi.reducerPath]: contactsApi.reducer,
    [bankDetailsApi.reducerPath]: bankDetailsApi.reducer,
    [responsiblePersonApi.reducerPath]: responsiblePersonApi.reducer,
    [fileApi.reducerPath]: fileApi.reducer,
    [transportApi.reducerPath]: transportApi.reducer,
    [permitApplicationApi.reducerPath]: permitApplicationApi.reducer,
    [dozvolApi.reducerPath]: dozvolApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [permissionsApi.reducerPath]: permissionsApi.reducer,
    [companyReportsApi.reducerPath]: companyReportsApi.reducer,
    [licenceApi.reducerPath]: licenceApi.reducer,
    [trafficIntensityApi.reducerPath]: trafficIntensityApi.reducer,
    [companySubdivisionsApi.reducerPath]: companySubdivisionsApi.reducer,
    [docUploadPolicyApi.reducerPath]: docUploadPolicyApi.reducer,
    [transportDocApi.reducerPath]: transportDocApi.reducer,
    [waybillApi.reducerPath]: waybillApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      cityApi.middleware,
      companyTypeApi.middleware,
      countryApi.middleware,
      districtApi.middleware,
      documentTypeApi.middleware,
      permitApplicationListApi.middleware,
      propertyApi.middleware,
      statusApi.middleware,
      transportTypeApi.middleware,
      transportBrandApi.middleware,
      transportFuelApi.middleware,
      transportOwnerShipApi.middleware,
      transportViewApi.middleware,
      transportOwnerTypeApi.middleware,
      individualApi.middleware,
      companyApi.middleware,
      entrepreneurApi.middleware,
      contactsApi.middleware,
      bankDetailsApi.middleware,
      responsiblePersonApi.middleware,
      fileApi.middleware,
      transportApi.middleware,
      permitApplicationApi.middleware,
      dozvolApi.middleware,
      documentApi.middleware,
      permissionsApi.middleware,
      companyReportsApi.middleware,
      licenceApi.middleware,
      trafficIntensityApi.middleware,
      companySubdivisionsApi.middleware,
      docUploadPolicyApi.middleware,
      transportDocApi.middleware,
      waybillApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;