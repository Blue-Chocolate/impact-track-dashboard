import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import type { Project, PaginatedResponse } from "@/types";
import { api } from "@/lib/api"; // axios instance

// Query keys helpers
const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (params: { page: number; search?: string }) =>
    [...projectKeys.lists(), params] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: number) => [...projectKeys.details(), id] as const,
};

// Fetch projects with server-side pagination + search
export function useProjects(params: { page: number; search?: string }) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: async (): Promise<PaginatedResponse<Project>> => {
      const res = await api.get("/projects", { params });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
}

// Create project with optimistic update
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Partial<Project>) => {
      const res = await api.post("/projects", project);
      return res.data;
    },
    onMutate: async (newProject) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: projectKeys.lists() });

      // Snapshot previous data
      const previous = queryClient.getQueryData<PaginatedResponse<Project>>(projectKeys.lists());

      // Optimistic update
      if (previous) {
        queryClient.setQueryData<PaginatedResponse<Project>>(projectKeys.lists(), {
          ...previous,
          data: [...previous.data, { ...newProject, id: Date.now() } as Project], // temp id
        });
      }

      return { previous };
    },
    onError: (_err, _newProject, context) => {
      if (context?.previous) {
        queryClient.setQueryData(projectKeys.lists(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

// Update project
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Project> }) => {
      const res = await api.put(`/projects/${id}`, data);
      return res.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(updated.id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

// Delete project
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/projects/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}