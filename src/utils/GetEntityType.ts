export const getEntityTypeFromPath = (pathname: string): string => {
  if (
    pathname.includes("/registeredIndividuals/") ||
    pathname.includes("/documents/INDIVIDUAL/")
  ) {
    return "INDIVIDUAL";
  }
  if (
    pathname.includes("/registeredCompanies/") ||
    pathname.includes("/documents/COMPANY/")
  ) {
    return "COMPANY";
  }
  if (
    pathname.includes("/registeredentrepreneurs/") ||
    pathname.includes("/documents/ENTREPRENEUR/")
  ) {
    return "ENTREPRENEUR";
  }
  return "INDIVIDUAL";
};