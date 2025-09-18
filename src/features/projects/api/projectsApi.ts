// src/features/projects/api/projectsApi.ts
import { type Project } from "../types/project";

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("http://localhost:4000/projects");
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function createProject(project: Omit<Project, "id">): Promise<Project> {
  // Let json-server auto-generate ID
  const res = await fetch("http://localhost:4000/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error("Failed to create project");
  return res.json(); 
}

export async function updateProject(project: Project): Promise<Project> {
  const res = await fetch(`http://localhost:4000/projects/${Number(project.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error("Failed to update project");
  return res.json();
}

export async function deleteProject(id: number): Promise<void> {
  const res = await fetch(`http://localhost:4000/projects/${Number(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete project");
}
