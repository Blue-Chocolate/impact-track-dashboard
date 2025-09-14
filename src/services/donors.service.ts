import api from "../api/axios";
import { type Donor } from "../types";

// Get all donors
export const getDonors = async (): Promise<Donor[]> => {
  const { data } = await api.get<Donor[]>("/donors");
  return data;
};

// Get donor by id
export const getDonorById = async (id: number): Promise<Donor> => {
  const { data } = await api.get<Donor>(`/donors/${id}`);
  return data;
};

// Create donor
export const createDonor = async (payload: Omit<Donor, "id">): Promise<Donor> => {
  const { data } = await api.post<Donor>("/donors", payload);
  return data;
};

// Update donor
export const updateDonor = async (id: number, payload: Partial<Donor>): Promise<Donor> => {
  const { data } = await api.put<Donor>(`/donors/${id}`, payload);
  return data;
};

// Delete donor
export const deleteDonor = async (id: number): Promise<void> => {
  await api.delete(`/donors/${id}`);
};
