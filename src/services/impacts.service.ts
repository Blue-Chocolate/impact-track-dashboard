import api from "../api/axios";
import { type  ImpactEntry } from "../types";

// Get all impacts
export const getImpacts = async (): Promise<ImpactEntry[]> => {
  const { data } = await api.get<ImpactEntry[]>("/impacts");
  return data;
};

// Get impact by id
export const getImpactById = async (id: number): Promise<ImpactEntry> => {
  const { data } = await api.get<ImpactEntry>(`/impacts/${id}`);
  return data;
};

// Create impact entry
export const createImpact = async (payload: Omit<ImpactEntry, "id">): Promise<ImpactEntry> => {
  const { data } = await api.post<ImpactEntry>("/impacts", payload);
  return data;
};

// Update impact entry
export const updateImpact = async (id: number, payload: Partial<ImpactEntry>): Promise<ImpactEntry> => {
  const { data } = await api.put<ImpactEntry>(`/impacts/${id}`, payload);
  return data;
};

// Delete impact
export const deleteImpact = async (id: number): Promise<void> => {
  await api.delete(`/impacts/${id}`);
};
