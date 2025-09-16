// src/types/index.ts
export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  managerId: number;
}

// Generic pagination response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
