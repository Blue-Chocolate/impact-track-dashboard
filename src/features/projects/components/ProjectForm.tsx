import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectFormSchema, type ProjectFormInput } from "../schemas/project.schema.tsx";
import { useCreateProject } from "../../../hooks/useProjects.ts"; // adjust path if needed
import { type  Project } from "@/types"; // adjust path if needed
import { Button } from "@/components/ui/Button"; // your design system button
import { Input } from "@/components/ui/Input";
import { toast } from "react-hot-toast"; // optional, if you have it; can replace with simple state UI

/**
 * ProjectForm with autosave to localStorage every 5s while user types.
 * - Restores draft on mount
 * - Saves draft every 5 seconds if form is dirty
 * - Saves on beforeunload
 * - Uses zod schema for validation
 */

const DRAFT_KEY = "project_form_draft_v1";

export function ProjectForm() {
  // restore defaults from localStorage (if any)
  const savedDraft = typeof window !== "undefined" ? localStorage.getItem(DRAFT_KEY) : null;
  const parsedDraft: Partial<ProjectFormInput> | null = savedDraft
    ? (() => {
        try {
          const p = JSON.parse(savedDraft);
          return p;
        } catch {
          return null;
        }
      })()
    : null;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProjectFormInput>({
    resolver: zodResolver(projectFormSchema),
    mode: "onChange",
    defaultValues: {
      name: parsedDraft?.name ?? "",
      description: parsedDraft?.description ?? "",
      startDate: parsedDraft?.startDate ?? new Date().toISOString().slice(0, 10),
      endDate: parsedDraft?.endDate ?? "",
      status: (parsedDraft?.status as any) ?? "planned",
      budget: parsedDraft?.budget ?? undefined,
      mainKPI: parsedDraft?.mainKPI ?? undefined,
    },
  });

  const createProject = useCreateProject();
  const [savingDraft, setSavingDraft] = useState(false);
  const watchedValues = watch();
  const autosaveIntervalRef = useRef<number | null>(null);

  // Autosave: every 5 seconds while user types (if form is dirty)
  useEffect(() => {
    // set up interval
    autosaveIntervalRef.current = window.setInterval(() => {
      // only save if something changed
      try {
        if (isDirty) {
          setSavingDraft(true);
          localStorage.setItem(DRAFT_KEY, JSON.stringify(watchedValues));
          setSavingDraft(false);
        }
      } catch (err) {
        console.error("Failed to autosave draft:", err);
      }
    }, 5000);

    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, watchedValues]); // we include watchedValues so latest values saved

  // Also save on unload (in case of abrupt close)
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        if (isDirty) {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(watchedValues));
        }
      } catch {}
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, watchedValues]);

  // Submit handler
  const onSubmit = async (data: ProjectFormInput) => {
    // Map form input to your Project create payload
    // Adjust if your API expects different names (e.g., 'title' vs 'name')
    const payload: Partial<Project> = {
      name: data.name,
      description: data.description ?? "",
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      managerId: 0, // put real manager id if you have it; 0 as placeholder
      // you can extend Project type to include budget and mainKPI on backend if desired
    };

    // Use mutate with callbacks (optimistic handled inside hook if implemented)
    createProject.mutate(payload, {
      onMutate: async (newProject) => {
        // optional: show immediate feedback
        toast?.loading?.("Creating project...");
        return undefined;
      },
      onSuccess: (created) => {
        // clear draft
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {}
        reset(); // reset form to defaults
        toast?.dismiss?.(); // dismiss loading
        toast?.success?.("Project created");
      },
      onError: (err: any) => {
        toast?.dismiss?.();
        toast?.error?.(err?.message ?? "Failed to create project");
      },
    });
  };

  // Small helper to render input with error
  const Field = ({
    id,
    label,
    children,
    errorMsg,
  }: {
    id: string;
    label: string;
    children: React.ReactNode;
    errorMsg?: string | null;
  }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
      {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <Field id="name" label="Project Title" errorMsg={errors.name?.message as string | undefined}>
        <input
          id="name"
          {...register("name")}
          className="w-full border rounded px-3 py-2"
          placeholder="Project title"
        />
      </Field>

      <Field id="description" label="Description" errorMsg={errors.description?.message as string | undefined}>
        <textarea
          id="description"
          {...register("description")}
          className="w-full border rounded px-3 py-2"
          placeholder="Brief description"
          rows={4}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field id="startDate" label="Start Date" errorMsg={errors.startDate?.message as string | undefined}>
          <input id="startDate" type="date" {...register("startDate")} className="w-full border rounded px-3 py-2" />
        </Field>

        <Field id="endDate" label="End Date" errorMsg={errors.endDate?.message as string | undefined}>
          <input id="endDate" type="date" {...register("endDate")} className="w-full border rounded px-3 py-2" />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field id="status" label="Status" errorMsg={errors.status?.message as string | undefined}>
          <select {...register("status")} className="w-full border rounded px-3 py-2">
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </Field>

        <Field id="budget" label="Budget" errorMsg={errors.budget?.message as string | undefined}>
          <input
            id="budget"
            type="number"
            step="0.01"
            {...register("budget", { valueAsNumber: true })}
            className="w-full border rounded px-3 py-2"
            placeholder="0.00"
          />
        </Field>

        <Field id="mainKPI" label="Main KPI (beneficiaries)" errorMsg={errors.mainKPI?.message as string | undefined}>
          <input
            id="mainKPI"
            type="number"
            {...register("mainKPI", { valueAsNumber: true })}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. 1200"
          />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Project"}
        </Button>

        <span className="text-sm text-gray-500">
          {savingDraft ? "Saving draft…" : isDirty ? "Draft unsaved" : "No changes"}
        </span>
      </div>
    </form>
  );
}
