export type TDocUploadPolicy = {
  id: string;
  userType: string;
  docType: string;
  docView: string;
  externalApi: string;
  requirement: string;
  page?: number;
  size?: number;
  sort?: string;
};
