
import { type Project } from "./project";

interface FormState {
  formData: Omit<Project, "id">;
  errors: Record<string, string | undefined>;
  isDirty: boolean;
  loading: boolean;
  error: string | null;
  notifications: { message: string; type: "success" | "error" }[];
}

interface ProjectsState {
  items: Project[];
  loading: boolean;
  error: string | null;
  success: string | null;
  form: FormState;
}