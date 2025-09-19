import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import type { ProjectFormProps } from "../types/types";
import { updateFormField, resetForm } from "../projectsSlice";
import { TemplateButtons } from "./TemplateButtons";
import { FormHeader } from "./FormHeader";
import { FormFields } from "./FormField";
import { FormActions } from "./FormActions";
import { ValidationSummary } from "./ValidationSummary";
import { useFormValidation } from "../hooks/useFormValidation";
import { useFormSubmission } from "../hooks/useFormSubmission";

export default function ProjectForm({
  onSubmit,
  initialValues,
  onCancel,
  isLoading = false,
}: ProjectFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const form = useSelector((state: RootState) => state.projects.form);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Custom hooks
  const {
    fieldErrors,
    formIsValid,
    clearFieldError,
    handleBlur,
    validateAllFields,
    getValidationSummary,
    resetValidation
  } = useFormValidation(form.formData, hasAttemptedSubmit);

  const { handleSubmit } = useFormSubmission(initialValues, onSubmit);

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

  // Handle field changes
  const handleChange = (field: string, value: any) => {
    if (field === "beneficiaries") value = Number(value);
    dispatch(updateFormField({ field, value }));
    clearFieldError(field);
  };

  // Handle form submission
  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submit triggered"); // Debug log
    
    await handleSubmit(
      form.formData,
      validateAllFields,
      resetValidation,
      setHasAttemptedSubmit
    );
  };

  // Handle form reset
  const handleReset = () => {
    dispatch(resetForm());
    resetValidation();
    setHasAttemptedSubmit(false);
  };

  // Quick-fill templates
  const templates: Record<string, Record<string, any>> = {
    education: {
      name: "Educational Excellence Initiative",
      description: "Comprehensive program to improve literacy rates and provide quality education resources to underserved communities through teacher training, curriculum development, and infrastructure improvements.",
      beneficiaries: 150,
    },
    healthcare: {
      name: "Community Health Outreach Program",
      description: "Mobile health clinics and preventive care services designed to increase healthcare access in rural areas, including vaccination drives, health screenings, and medical education workshops.",
      beneficiaries: 75,
    },
    environment: {
      name: "Green Future Sustainability Project",
      description: "Environmental conservation initiative focusing on renewable energy adoption, waste reduction, and community gardens to promote sustainable living practices and environmental awareness.",
      beneficiaries: 200,
    },
    infrastructure: {
      name: "Rural Infrastructure Development",
      description: "Critical infrastructure improvements including clean water access, road construction, and digital connectivity to enhance quality of life and economic opportunities in rural communities.",
      beneficiaries: 500,
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <FormHeader initialValues={initialValues} />

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <form onSubmit={onFormSubmit} className="space-y-8 p-8" noValidate>
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

          <FormFields
            formData={form.formData}
            fieldErrors={fieldErrors}
            isLoading={isLoading || form.loading}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />

          <ValidationSummary
            hasAttemptedSubmit={hasAttemptedSubmit}
            formIsValid={formIsValid}
            getValidationSummary={getValidationSummary}
            fieldErrors={fieldErrors}
          />

          <FormActions
            onCancel={onCancel}
            onReset={handleReset}
            initialValues={initialValues}
            formIsValid={formIsValid}
            isLoading={isLoading || form.loading}
            isDirty={form.isDirty}
            hasAttemptedSubmit={hasAttemptedSubmit}
          />
        </form>
      </div>
    </div>
  );
}