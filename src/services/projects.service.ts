import api from "../api/axios";
import { type Project } from "../types";

// Get all projects
export const getProjects = async (params: { page: number; search?: string }) => {
  const { page, search } = params;
  const query = new URLSearchParams();
  query.append("_page", String(page));
  query.append("_limit", "10"); // ثابت 10 عناصر بالصفحة
  if (search) query.append("q", search);

  const { data } = await api.get<Project[]>(`/projects?${query.toString()}`);
  return data;
};

// Get project by id
export const getProjectById = async (id: number): Promise<Project> => {
  const { data } = await api.get<Project>(`/projects/${id}`);
  return data;
};

// Create project
export const createProject = async (payload: Omit<Project, "id">): Promise<Project> => {
  const { data } = await api.post<Project>("/projects", payload);
  return data;
};

// Update project
export const updateProject = async (id: number, payload: Partial<Project>): Promise<Project> => {
  const { data } = await api.put<Project>(`/projects/${id}`, payload);
  return data;
};

// Delete project
export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`);
};



/* trategy Recap
 "DELETE BEFORE CREATE/UPDATE TO AVOID CONFLICTS YA 7SSSSNNNNN
Query keys:

["projects", "list", { page, search }] → list with filters

["projects", "detail", id] → single project

Invalidation:

عند create/update/delete نعمل invalidate لـ list queries عشان تتحدث.

عند update كمان نعمل invalidate لـ detail الخاص بالـ id.

Optimistic update في createProject. */