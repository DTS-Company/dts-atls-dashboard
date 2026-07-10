import { TDocumentType } from "@pages/Reference/DocumentType/types/types";
export type TDocument = {
  id: string;
  identificationNumber: string;
  typeId: string;
  type: TDocumentType[];
  documentDate: string;
  documentDateEnd: string;
  documentLink: string;
  issuingAuthority: string;
  checkStatus: boolean;
};
