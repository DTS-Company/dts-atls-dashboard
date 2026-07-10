export type TLicence = {
  id: number;
  unique_number: string;
  app_field: number;
  rma: string;
  legal_entity: string;
  organization_type: number;
  organization: string;
  bank_account: string;
  bank: string;
  name: string | null;
  surname: string | null;
  patronymics: string | null;
  passport_series: string | null;
  passport_number: string | null;
  issued_date: string | null;
  registered_by: string | null;
  location: number;
  city: string;
  street: string;
  building: string;
  apartment: string;
  token: string;
  phone: string;
  email: string;
  postal_index: string;
  licence_date: string | null;
  status: string;
  updated_at: string;
  created_at: string;
};

export type TLicenceStatus = {
  id: string;
  title: string;
};

export type TFormDetails = {
  legal_entity: Array<{ id: number; value: string }>;
  organizationType: Array<{ id: number; value: string }>;
  locations: Array<{ id: number; location: string }>;
  banks: Array<{ id: number; title: string }>;
  doc_types: Array<{ id: number; title: string }>;
};

export type TLicenceListRequest = {
  search?: string;
  location?: number;
  organization_type?: number;
  legal_entity?: number;
  fromDate?: string;
  toDate?: string;
  per_page?: number;
  page?: number;
  status?: number;
  document_type?: number;
};
