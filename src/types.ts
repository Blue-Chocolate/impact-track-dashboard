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
}

// Impact tracking entry
export interface ImpactEntry {
  id: number;
  projectId: number;
  metric: string;
  value: number;
  date: string;
}

// Donor model
export interface Donor {
  id: number;
  name: string;
  email: string;
  phone?: string;
  contributionAmount: number;
}
