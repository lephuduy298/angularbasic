export interface User {
  id?: string;
  userName: string;
  email?: string;
  fullName?: string;
  birthDate?: Date | string;
  statusFlag?: string;
  departmentName?: string;
  positionTitle?: string;
  companyName?: string;
  stockCode?: string;
  stockExchange?: string;
  createdDate?: Date | string;
  createdBy?: string;
  lastUpdatedDate?: Date | string;
  lastUpdatedBy?: string;
  // Additional fields for UI
  isSpecialized?: boolean;
  roleName?: string;
  phoneNumber?: string;
  address?: string;
  isActive?: boolean;
}

