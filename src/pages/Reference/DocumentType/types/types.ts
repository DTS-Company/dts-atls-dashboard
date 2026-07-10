export type TDocumentType = {
  id: string;
  name: string;
  refers: string;
  userType: ("INDIVIDUAL" | "COMPANY" | "ENTREPRENEUR" | "TRANSPORT")[];
  docType:
    | "DOC_USER"
    | "LICENSE"
    | "LICENSE_CARD"
    | "CERTIFICATE"
    | "SPECIAL_PERMITS"
    | "E_TIR"
    | "I_T_PERMITS";
  docView: string;
  descriptionLabel: string;
  descriptionValues: string;
};

export type TNewDocumentType = Omit<TDocumentType, "id">;
