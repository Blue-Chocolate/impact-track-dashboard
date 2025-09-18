import api from "../../../Core/api/axiosInstance";
import { type  ImpactEntry } from "../types";

export const fetchImpacts = async (): Promise<ImpactEntry[]> => {
  const { data } = await api.get("/impacts");
  return data;
};

export const createImpact = async (impact: Omit<ImpactEntry, "id">) => {
  const { data } = await api.post("/impacts", impact);
  return data;
};

export const deleteImpact = async (id: number) => {
  await api.delete(`/impacts/${id}`);
};
