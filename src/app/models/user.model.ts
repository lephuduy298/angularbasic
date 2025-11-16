export interface UserResponse {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  birthDate: Date;

  // Personal info
  genderCd: number;
  address: string;
  phoneNo: string;
  faxNo: string;

  // Identity info
  identity: string;
  identityTypeCd: number;
  identityIssuedDate: Date;
  identityIssuedPlace: string;

  // Organization info (có cả ID và Name để dễ edit)
  departmentId: string;
  departmentName: string;

  positionCd: number;
  positionTitle: string;

  companyProfileId: string
  companyName: string;
  stockCode: string;
  stockExchange: string;

  statusFlg: number;
  statusFlag: string;

  description: string;

  // Audit fields
  createdDate: Date;
  createdBy: string;
  lastUpdatedDate: Date;
  lastUpdatedBy: string;
}

export interface CreateUserRequest {
  userName: string;
  email: string;
  password: string;
  fullName: string;
  departmentId: number;
  companyProfileId: number;
  description: string;
}

export interface UpdateUserRequest {
  userName: string;
  email: string;
  password?: string;              // Optional when update
  fullName: string;
  birthDate?: Date;
  genderCd?: number;
  address?: string;
  phoneNo?: string;
  faxNo?: string;
  identity?: string;
  identityTypeCd?: number;
  identityIssuedDate?: Date;
  identityIssuedPlace?: string;
  departmentId: number;
  positionCd?: number;
  statusFlg?: number;
  companyProfileId: number;
  description?: string;
}


