export interface UserHistory {
  id: string;
  userId: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedDate: Date;
}

export interface UserHistoryResponse {
  items: UserHistory[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

