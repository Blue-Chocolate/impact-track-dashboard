import api from "../../../Core/api/axiosInstance";
import { type Project } from "../types";

export const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await api.get("/projects");
  return data;
};

export const createProject = async (project: Omit<Project, "id">) => {
  const { data } = await api.post("/projects", project);
  return data;
};

export const deleteProject = async (id: number) => {
  await api.delete(`/projects/${id}`);
};
export const updateProject = async (project: Project) => {
  const { data } = await api.put(`/projects/${project.id}`, project);
  return data;
};