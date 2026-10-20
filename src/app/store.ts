import { configureStore } from "@reduxjs/toolkit";
import { permissionsApi } from "@entities/permission";
import { atlsReferenceApi } from "@entities/reference";
import { atlsWaybillApi } from "@entities/waybill";
import { atlsReportApi } from "@entities/report";

export const store = configureStore({
  reducer: {
    [permissionsApi.reducerPath]: permissionsApi.reducer,
    [atlsReferenceApi.reducerPath]: atlsReferenceApi.reducer,
    [atlsWaybillApi.reducerPath]: atlsWaybillApi.reducer,
    [atlsReportApi.reducerPath]: atlsReportApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      permissionsApi.middleware,
      atlsReferenceApi.middleware,
      atlsWaybillApi.middleware,
      atlsReportApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
