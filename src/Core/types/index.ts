// General user
export interface User {
  id: number;
  username: string;
  role: "admin" | "manager" | "donor";
  token?: string;
}

// Project model
export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  managerId: number;
  status: "planned" | "active" | "completed";
  budget?: number | null;
  mainKPI?: number | null;
  client?: string | null;


  
}


// Impact tracking entry
export interface ImpactEntry {
  id: number;
  projectId: number;
  metric: string;
  value: number;
  date: string;
}// src/types/index.ts
export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  managerId: number;
}

// Generic pagination response
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};


// Donor model
export interface Donor {
  id: number;
  name: string;
  email: string;
  phone?: string;
  contributionAmount: number;
}
