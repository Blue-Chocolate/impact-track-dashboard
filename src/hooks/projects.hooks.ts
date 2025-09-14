import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projects.service";
import {type  Project } from "../types";

// Query keys helpers
const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (params: { page: number; search?: string }) =>
    [...projectKeys.lists(), params] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: number) => [...projectKeys.details(), id] as const,
};

// useProjects with server-side pagination + search
export function useProjects(params: { page: number; search?: string }) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => getProjects(params)
  });
}

// Create project with optimistic update
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onMutate: async (newProject) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: projectKeys.lists() });

      // Snapshot previous
      const previous = queryClient.getQueryData<Project[]>(projectKeys.lists());

      // Optimistic update
      if (previous) {
        queryClient.setQueryData<Project[]>(projectKeys.lists(), [
          ...previous,
          { ...newProject, id: Date.now() }, // temp id
        ]);
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
    mutationFn: ({ id, data }: { id: number; data: Partial<Project> }) =>
      updateProject(id, data),
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
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}
