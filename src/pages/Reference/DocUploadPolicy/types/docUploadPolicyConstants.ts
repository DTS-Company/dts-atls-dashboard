export const USER_TYPE_OPTIONS = [
  { value: "INDIVIDUAL", label: "INDIVIDUAL" },
  { value: "COMPANY", label: "COMPANY" },
  { value: "ENTREPRENEUR", label: "ENTREPRENEUR" },
  { value: "TRANSPORT", label: "TRANSPORT" },
] as const;

export const DOC_TYPE_OPTIONS = [
  { value: "DOC_USER", label: "DOC_USER" },
  { value: "LICENSE", label: "LICENSE" },
  { value: "LICENSE_CARD", label: "LICENSE_CARD" },
  { value: "CERTIFICATE", label: "CERTIFICATE" },
  { value: "SPECIAL_PERMITS", label: "SPECIAL_PERMITS" },
  { value: "E_TIR", label: "E_TIR" },
  { value: "I_T_PERMITS", label: "I_T_PERMITS" },
] as const;

export const DOC_VIEW_OPTIONS = [
  { value: "LIC", label: "LIC" },
  { value: "SER", label: "SER" },
  { value: "ID_CARD", label: "ID_CARD" },
  { value: "PASSPORT", label: "PASSPORT" },
  { value: "REG_CERTIFICATE", label: "REG_CERTIFICATE" },
  { value: "INTER_LIC", label: "INTER_LIC" },
] as const;

export const EXTERNAL_API_OPTIONS = [
  { value: "ROHKHAT_API", label: "ROHKHAT_API" },
  { value: "CERTIFICATE_API", label: "CERTIFICATE_API" },
  { value: "LICENSE_API", label: "LICENSE_API" },
] as const;

export const REQUIREMENT_OPTIONS = [
  { value: "REQUIRED", label: "REQUIRED" },
  { value: "OPTIONAL", label: "OPTIONAL" },
  { value: "NOT_REQUIRED", label: "NOT_REQUIRED" },
] as const;

export const INITIAL_FORM_STATE = {
  userType: "INDIVIDUAL" as const,
  docType: "DOC_USER" as const,
  docView: "NULL" as const,
  externalApi: "ROHKHAT_API" as const,
  requirement: "REQUIRED" as const,
};

export type DocUploadPolicyFormData = {
  userType: string;
  docType: string;
  docView: string;
  externalApi: string;
  requirement: string;
};

export type DocUploadPolicy = {
  id: string;
} & DocUploadPolicyFormData;
