export interface TransportDocument {
  carModel: string;
  createdAt: string;
  licensePlate: string;
  entityId: string;
  typeId: string;
  checkStatus: "SENT" | "ACCEPTED" | "REJECTED";
  typeName: string;
}

export interface TransportDocsResponse {
  message: string;
  statusCode: number;
  meta: {
    totalCount: number;
    page: number;
    limit: number;
  };
  total: null;
  content: TransportDocument[];
}

export interface GetTransportDocsParams {
  userType: "TRANSPORT";
  page: number;
  size: number;
}
