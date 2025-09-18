// src/features/projects/component/ProjectForm.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import { type ProjectFormProps } from "../types/types";
import { VALIDATION_RULES } from "../constants/validation";
import { getTodayDate, validateField, isFormValid } from "../utils/validation";
import {
  updateFormField,
  resetForm,
  addNotification,
} from "../projectsSlice";
import { FormField } from "./FormField";
import { TemplateButtons } from "./TemplateButtons";
import { FormActions } from "./FormActions";
import FormStatus from "./FormStatus";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ProjectForm({
  onSubmit,
  initialValues,
  onCancel,
  isLoading = false,
}: ProjectFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const form = useSelector((state: RootState) => state.projects.form);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const today = getTodayDate();

  // Initialize form with initialValues or reset
  useEffect(() => {
    if (initialValues) {
      Object.entries(initialValues).forEach(([key, value]) =>
        dispatch(updateFormField({ field: key, value }))
      );
    } else {
      dispatch(resetForm());
    }
  }, [initialValues, dispatch]);

  // Validate fields on change after first submit attempt
  useEffect(() => {
    if (hasAttemptedSubmit) {
      const errors: Record<string, string> = {};
      Object.entries(form.formData).forEach(([field, value]) => {
        const error = validateField(
          field as keyof typeof form.formData,
          value,
          form.formData
        );
        if (error) errors[field] = error;
      });
      setFieldErrors(errors);
    }
  }, [form.formData, hasAttemptedSubmit]);

  // Handle field changes
  const handleChange = (field: string, value: any) => {
  if (field === "beneficiaries") value = Number(value); // convert to number
  dispatch(updateFormField({ field, value }));

  // Clear field error
  if (fieldErrors[field]) {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }
};

  // Handle blur validation
  const handleBlur = (field: string) => {
    const error = validateField(
      field as keyof typeof form.formData,
      form.formData[field as keyof typeof form.formData],
      form.formData
    );

    if (error) {
      setFieldErrors(prev => ({ ...prev, [field]: error }));
    } else {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    const errors: Record<string, string> = {};
    let hasError = false;

    Object.entries(form.formData).forEach(([field, value]) => {
      const error = validateField(
        field as keyof typeof form.formData,
        value,
        form.formData
      );
      if (error) {
        errors[field] = error;
        hasError = true;
      }
    });

    setFieldErrors(errors);

    if (hasError) {
      dispatch(
        addNotification({
          message: `Please fix ${Object.keys(errors).length} error${
            Object.keys(errors).length > 1 ? "s" : ""
          } before submitting`,
          type: "error",
        })
      );
      return;
    }

    try {
      onSubmit?.(form.formData);

      dispatch(
        addNotification({
          message: initialValues
            ? "Project updated successfully!"
            : "Project created successfully!",
          type: "success",
        })
      );

      dispatch(resetForm());
      setFieldErrors({});
      setHasAttemptedSubmit(false);
    } catch {
      dispatch(
        addNotification({
          message: "Something went wrong. Please try again.",
          type: "error",
        })
      );
    }
  };

  const formIsValid = 
  isFormValid({ ...form.formData, beneficiaries: Number(form.formData.beneficiaries) }) &&
  Object.keys(fieldErrors).length === 0;


  // Quick-fill templates
  const templates: Record<string, Record<string, any>> = {
    education: {
      name: "Educational Excellence Initiative",
      description:
        "Comprehensive program to improve literacy rates and provide quality education resources to underserved communities through teacher training, curriculum development, and infrastructure improvements.",
      beneficiaries: 150,
    },
    healthcare: {
      name: "Community Health Outreach Program",
      description:
        "Mobile health clinics and preventive care services designed to increase healthcare access in rural areas, including vaccination drives, health screenings, and medical education workshops.",
      beneficiaries: 75,
    },
    environment: {
      name: "Green Future Sustainability Project",
      description:
        "Environmental conservation initiative focusing on renewable energy adoption, waste reduction, and community gardens to promote sustainable living practices and environmental awareness.",
      beneficiaries: 200,
    },
    infrastructure: {
      name: "Rural Infrastructure Development",
      description:
        "Critical infrastructure improvements including clean water access, road construction, and digital connectivity to enhance quality of life and economic opportunities in rural communities.",
      beneficiaries: 500,
    },
  };

  const getValidationSummary = () => {
    const errorFields = Object.keys(fieldErrors);
    if (errorFields.length === 0 && !formIsValid) {
      return "Please fill in all required fields";
    }
    if (errorFields.length === 1) {
      return `Please fix the ${errorFields[0]} field`;
    }
    if (errorFields.length > 1) {
      return `Please fix ${errorFields.length} validation errors`;
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-1">
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {initialValues ? "Edit Project" : "Create New Project"}
            </h2>
            <p className="text-gray-600 mt-2">
              {initialValues
                ? "Update your project details and save changes"
                : "Fill in the details below to create a new project"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-8 p-8" noValidate>
          {/* Templates */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Quick Start Templates
            </h3>
            <TemplateButtons
              templates={templates}
              onAutoFill={(data) =>
                Object.entries(data).forEach(([field, value]) =>
                  handleChange(field, value)
                )
              }
              isLoading={isLoading || form.loading}
            />
          </div>

          {/* Fields Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Name */}
              <FormField
                id="name"
                name="name"
                label="Project Name"
                error={fieldErrors.name}
                required
                characterCount={{
                  current: form.formData.name.length,
                  max: VALIDATION_RULES.name.maxLength,
                }}
              >
                <Input
                  id="name"
                  name="name"
                  value={form.formData.name}
                  onChange={(e) =>
                    handleChange("name", e.target.value)
                  }
                  onBlur={() => handleBlur("name")}
                  placeholder="Enter a descriptive project name"
                  maxLength={VALIDATION_RULES.name.maxLength}
                  disabled={isLoading || form.loading}
                  className={`transition-all duration-200 ${
                    fieldErrors.name
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                  }`}
                />
              </FormField>

              {/* Beneficiaries */}
              <FormField
                id="beneficiaries"
                name="beneficiaries"
                label="Number of Beneficiaries"
                error={fieldErrors.beneficiaries}
                required
                helpText="Enter the estimated number of people who will directly benefit from this project"
              >
                <div className="relative">
                  <Input
                    id="beneficiaries"
                    name="beneficiaries"
                    type="number"
                    value={form.formData.beneficiaries}
                    onChange={(e) =>
                      handleChange("beneficiaries", Number(e.target.value))
                    }
                    onBlur={() => handleBlur("beneficiaries")}
                    placeholder="e.g., 100"
                    min={VALIDATION_RULES.beneficiaries.min}
                    max={VALIDATION_RULES.beneficiaries.max}
                    disabled={isLoading || form.loading}
                    className={`pl-12 transition-all duration-200 ${
                      fieldErrors.beneficiaries
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                    }`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                </div>
              </FormField>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  id="startDate"
                  name="startDate"
                  label="Start Date"
                  error={fieldErrors.startDate}
                  required
                >
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={form.formData.startDate}
                    onChange={(e) =>
                      handleChange("startDate", e.target.value)
                    }
                    onBlur={() => handleBlur("startDate")}
                    min={today}
                    disabled={isLoading || form.loading}
                    className={`transition-all duration-200 ${
                      fieldErrors.startDate
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                    }`}
                  />
                </FormField>

                <FormField
                  id="endDate"
                  name="endDate"
                  label="End Date"
                  error={fieldErrors.endDate}
                  required
                >
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={form.formData.endDate}
                    onChange={(e) =>
                      handleChange("endDate", e.target.value)
                    }
                    onBlur={() => handleBlur("endDate")}
                    min={form.formData.startDate || today}
                    disabled={isLoading || form.loading}
                    className={`transition-all duration-200 ${
                      fieldErrors.endDate
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                    }`}
                  />
                </FormField>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <FormField
                id="description"
                name="description"
                label="Project Description"
                error={fieldErrors.description}
                required
                characterCount={{
                  current: form.formData.description.length,
                  max: VALIDATION_RULES.description.maxLength,
                }}
              >
                <Input
                  id="description"
                  name="description"
                  type="textarea"
                  value={form.formData.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value)
                  }
                  onBlur={() => handleBlur("description")}
                  placeholder="Describe the project goals, activities, and expected outcomes..."
                  maxLength={VALIDATION_RULES.description.maxLength}
                  rows={8}
                  disabled={isLoading || form.loading}
                  className={`transition-all duration-200 resize-none ${
                    fieldErrors.description
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                  }`}
                />
              </FormField>
            </div>
          </div>

          {/* Validation Summary */}
          {hasAttemptedSubmit && !formIsValid && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-pulse">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-semibold text-red-800">
                    Form Validation Required
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    {getValidationSummary()}
                  </p>
                </div>
              </div>

              {Object.keys(fieldErrors).length > 0 && (
                <div className="mt-3 ml-8">
                  <ul className="text-sm text-red-700 space-y-1">
                    {Object.entries(fieldErrors).map(([field, error]) => (
                      <li key={field} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                        <strong className="capitalize">{field}:</strong> {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex items-center space-x-4">
                <FormStatus isDirty={form.isDirty} />
                {hasAttemptedSubmit && formIsValid && (
                  <div className="flex items-center text-green-600 text-sm">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Form is valid
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                {onCancel && (
                  <Button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading || form.loading}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={() => {
                    dispatch(resetForm());
                    setFieldErrors({});
                    setHasAttemptedSubmit(false);
                  }}
                  disabled={!form.isDirty || isLoading || form.loading}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50"
                >
                  Reset
                </Button>

                  <Button
                  type="submit"
                  disabled={!formIsValid || isLoading || form.loading}
                  className={`px-8 py-3 text-sm font-medium text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                    !formIsValid || isLoading || form.loading
                      ? "bg-indigo-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {initialValues ? "Update Project" : "Create Project"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
