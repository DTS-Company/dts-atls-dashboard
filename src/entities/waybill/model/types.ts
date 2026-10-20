// Путевые листы ATLS (просмотр ведомством) — поля из Swagger atls-waybill-monitoring

export type TWaybillFuel = {
  fuelKind: string;
  remainBeforeExit: number | null;
  fuelGiven: number | null;
  remainEntry: number | null;
};

export type TWaybill = {
  id: string;
  form: string;
  number: string;
  status: string;
  companyId: string;
  companyName: string | null;
  transportId: string;
  transportLicensePlate: string | null;
  transportBrand: string | null;
  transportModel: string | null;
  driverId: string;
  driverName: string | null;
  secondDriverName: string | null;
  clientName: string | null;
  routeNumber: string | null;
  routeName: string | null;
  directionName: string | null;
  cargoTitle: string | null;
  arrivalTime: string | null;
  indicationCounterExit: number | null;
  exitDate: string | null;
  indicationCounterEntry: number | null;
  entryDate: string | null;
  mileage: number | null;
  numberLap: number | null;
  specialMark: string | null;
  doctorName: string | null;
  doctorResult: string | null;
  doctorNote: string | null;
  doctorAt: string | null;
  mechanicName: string | null;
  mechanicResult: string | null;
  mechanicNote: string | null;
  mechanicAt: string | null;
  closedAt: string | null;
  createdAt: string | null;
  /** Поля, свои у каждой формы */
  fields: Record<string, unknown> | null;
  fuels: TWaybillFuel[] | null;
};

export type TWorkDay = {
  id: string;
  date: string;
  exitTime: string | null;
  entryTime: string | null;
  workTime: string | null;
  workTimeInMinutes: number | null;
  indicationCounterExit: number | null;
  indicationCounterEntry: number | null;
  mileage: number | null;
};

export type TCargoNote = {
  id: string;
  number: string;
  /** 1 или 2 — приложение 1 или 2 */
  type: number | null;
  workDayId: string | null;
  clientName: string | null;
  senderName: string | null;
  receiverName: string | null;
  forwarderName: string | null;
  cargoName: string | null;
  date: string | null;
  cargoAmount: number | null;
  reisAmount: number | null;
  distance: number | null;
  cargoCapacity: number | null;
  entryTime: string | null;
  distanceSpecialWork: number | null;
};

export type TWaybillCard = {
  waybill: TWaybill;
  workDays: TWorkDay[] | null;
  cargoNotes: TCargoNote[] | null;
};

export type TWaybillFilters = {
  form?: string;
  status?: string;
  companyId?: string;
  transportId?: string;
  exitFrom?: string;
  exitTo?: string;
  openLongerThanDays?: string;
  page: number;
  size: number;
};
