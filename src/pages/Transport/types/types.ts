export type TTransport = {
  id: string;
  LicensePlate: string;
  BodyNo: string;
  BodyType: string;
  Vin: string;
  Color: string;
  Type: string;
  Owner: string;
  RegistrationCertificateIssuePlace: string;
  RegistrationCertificateIssueDate?:
    | {
        Day?: string;
        Year?: string;
        Month?: string;
      }
    | string;
  RegistrationCertificateSeries: string;
  EngineCapacity: string;
  EnginePowerHp: string;
  EnginePowerKw: string;
  EngineType: string;
  MaxWeightLaden: string;
  MaxWeightUnladen: string;
  NumberOfSeats: string;
  VehiclePassport: string;
  YearOfManufacture: string;
  CarBrand: string;
  CarModel: string;
  ChassisNo: string;
  Phone: string;
};

export type TTransportResponse = {
  message: string;
  statusCode: number;
  meta: {
    totalCount: number;
    page: number;
    limit: number;
    search: string;
  };
  total: number | null;
  content: TTransport[];
};

export type TTransportLower = {
  license_plate: string;
  chassis_no: string;
  engine_capacity: string;
  engine_power_hp: string;
  engine_power_kw: string;
  engine_type: string;
  max_weight_laden: string;
  number_of_seats: string;
  vehicle_passport: string;
  car_brand: string;
  car_model: string;
  entity_id: string;
  registration_certificate_series: string;
  object_name: string;
  object_type: string;
  max_weight_unladen: string;
  year_of_manufacture: string;
  body_no: string;
  body_type: string;
  phone: string;
  vin: string;
  color: string;
  id: string;
  type: string;
  owner: string;
};

export type TRegistrationCertificateIssueDate = {
  Day: string;
  Year: string;
  Month: string;
};

export type TAttachedIndividual = {
  entity_type: string;
  detachment_date: string;
  contract_number: string;
  entity_name: string;
  entity_id: string;
  id: string;
  position: string;
};
