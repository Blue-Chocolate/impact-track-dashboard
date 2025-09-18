import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { fetchProjects, createProject, updateProject, deleteProject } from "./api/projectsApi";
import { type  Project } from "./types/project";

// ── Interfaces ─────────────────────────────
interface FormState {
  formData: Omit<Project, "id">;
  errors: Record<string, string | undefined>;
  isDirty: boolean;
  loading: boolean;
  notifications: { message: string; type: "success" | "error" }[];
}

interface ProjectsState {
  items: Project[];
  loading: boolean;
  error: string | null;
  success: string | null;
  form: FormState;
  searchTerm: string;
}

const initialFormState: FormState = {
  formData: { name: "", description: "", beneficiaries: 0, startDate: "", endDate: "" },
  errors: {},
  isDirty: false,
  loading: false,
  notifications: [],
};

const initialState: ProjectsState = {
  items: [],
  loading: false,
  error: null,
  success: null,
  form: initialFormState,
  searchTerm: "",
};

// ── Thunks ────────────────────────────────
export const loadProjects = createAsyncThunk("projects/load", async () => {
  return await fetchProjects();
});

export const addProject = createAsyncThunk(
  "projects/add",
  async (project: Omit<Project, "id">) => {
    return await createProject(project);
  }
);

export const editProject = createAsyncThunk(
  "projects/edit",
  async (project: Project) => {
    return await updateProject(project);
  }
);

export const removeProject = createAsyncThunk(
  "projects/delete",
  async (id: number) => {
    await deleteProject(id);
    return id;
  }
);

// ── Slice ────────────────────────────────
const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    updateFormField(state, action: PayloadAction<{ field: string; value: any }>) {
      state.form.formData[action.payload.field as keyof typeof state.form.formData] = action.payload.value;
      state.form.isDirty = true;
    },
    resetForm(state) {
      state.form = initialFormState;
    },
    clearMessages(state) {
      state.error = null;
      state.success = null;
      state.form.notifications = [];
    },
    addNotification(state, action: PayloadAction<{ message: string; type: "success" | "error" }>) {
      state.form.notifications.push(action.payload);
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load Projects
      .addCase(loadProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load projects";
      })

      // Add Project
      .addCase(addProject.pending, (state) => {
        state.form.loading = true;
      })
      .addCase(addProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.items.push(action.payload);
        state.form.loading = false;
        state.form.notifications.push({ message: "Project created successfully!", type: "success" });
        state.form.isDirty = false;
      })
      .addCase(addProject.rejected, (state, action) => {
        state.form.loading = false;
        state.form.notifications.push({ message: action.error.message || "Failed to add project", type: "error" });
      })

      // Edit Project
      .addCase(editProject.pending, (state) => {
        state.form.loading = true;
      })
      .addCase(editProject.fulfilled, (state, action: PayloadAction<Project>) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        state.form.loading = false;
        state.form.notifications.push({ message: "Project updated successfully!", type: "success" });
        state.form.isDirty = false;
      })
      .addCase(editProject.rejected, (state, action) => {
        state.form.loading = false;
        state.form.notifications.push({ message: action.error.message || "Failed to edit project", type: "error" });
      })

      // Delete Project
      .addCase(removeProject.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        state.success = "Project deleted successfully!";
      })
      .addCase(removeProject.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete project";
      });
  },
});

export const { updateFormField, resetForm, clearMessages, addNotification, setSearchTerm } = projectsSlice.actions;
export default projectsSlice.reducer;
