import React from "react";
import { FormField } from "./FormFields";
import Input from "@/components/ui/Input";
import { VALIDATION_RULES } from "../constants/validation";
import { getTodayDate } from "../utils/validation";

interface FormFieldsProps {
  formData: any;
  fieldErrors: Record<string, string>;
  isLoading: boolean;
  handleChange: (field: string, value: any) => void;
  handleBlur: (field: string) => void;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  formData,
  fieldErrors,
  isLoading,
  handleChange,
  handleBlur
}) => {
  const today = getTodayDate();

  return (
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
            current: formData.name.length,
            max: VALIDATION_RULES.name.maxLength,
          }}
        >
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="Enter a descriptive project name"
            maxLength={VALIDATION_RULES.name.maxLength}
            disabled={isLoading}
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
              value={formData.beneficiaries}
              onChange={(e) =>
                handleChange("beneficiaries", Number(e.target.value))
              }
              onBlur={() => handleBlur("beneficiaries")}
              placeholder="e.g., 100"
              min={VALIDATION_RULES.beneficiaries.min}
              max={VALIDATION_RULES.beneficiaries.max}
              disabled={isLoading}
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
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              onBlur={() => handleBlur("startDate")}
              min={today}
              disabled={isLoading}
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
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              onBlur={() => handleBlur("endDate")}
              min={formData.startDate || today}
              disabled={isLoading}
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
            current: formData.description.length,
            max: VALIDATION_RULES.description.maxLength,
          }}
        >
          <Input
            id="description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            placeholder="Describe the project goals, activities, and expected outcomes..."
            maxLength={VALIDATION_RULES.description.maxLength}
            rows={8}
            disabled={isLoading}
            className={`transition-all duration-200 resize-none ${
              fieldErrors.description
                ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
            }`}
          />
        </FormField>
      </div>
    </div>
  );
};
