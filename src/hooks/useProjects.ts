// src/features/projects/hooks/useProjects.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import type { Project, PaginatedResponse } from "@/types";
import { api } from "@/lib/api"; // axios instance

// Keys
const PROJECTS_KEY = "projects";

export function useProjects(params: { page: number; search?: string }) {
  return useQuery({
    queryKey: [PROJECTS_KEY, params],
    queryFn: async (): Promise<PaginatedResponse<Project>> => {
      const res = await api.get("/projects", { params });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Partial<Project>) => {
      const res = await api.post("/projects", project);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_KEY] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Project) => {
      const res = await api.put(`/projects/${project.id}`, project);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_KEY] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/projects/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_KEY] });
    },
  });
}