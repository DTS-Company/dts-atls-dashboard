export type TCompanyPermitApplication = {
    id:string
    entityId: string;
    applicationNumber: number;
    applicationStatus: string;
    notes: string;
    applicationType: string;
    applicationDate: string;
    userType: string;
    tin: string;     
    companyType: string;
    companyName: string;
    bankAccount: string;
    bankName: string;
    regionalManagement: string;
    city: string;
    building: string;
    room: string;
    phone: string;
    email: string;
    postalCode: string;
};

export type TEntrepreneurPermitApplication = {
    entityId: string;
    applicationNumber: string;
    applicationStatus: string;
    notes: string;
    applicationType: string;
    userType: string;
    tin: string;
    firstName: string;
    lastName: string;
    surname: string;
    passporSeries: string;
    passporNamber: string;
    passporDate: string;
    registrationAuthority: string;
    regionalManagement: string;
    city: string;
    street: string;
    building: string;
    room: string;
    phone: string;
    email: string;
    postalCode: string;
  };
  