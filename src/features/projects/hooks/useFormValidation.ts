import { useState, useEffect } from "react";
import { validateField, isFormValid } from "../utils/validation";
import type { FormData } from "../types/types";

export const useFormValidation = (formData: FormData, hasAttemptedSubmit: boolean) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Validate fields on change after first submit attempt
  useEffect(() => {
    if (hasAttemptedSubmit) {
      const errors: Record<string, string> = {};
      Object.entries(formData).forEach(([field, value]) => {
        const error = validateField(
          field as keyof typeof formData,
          value,
          formData
        );
        if (error) errors[field] = error;
      });
      setFieldErrors(errors);
    }
  }, [formData, hasAttemptedSubmit]);

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    const error = validateField(
      field as keyof typeof formData,
      formData[field as keyof typeof formData],
      formData
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

  const validateAllFields = () => {
    const errors: Record<string, string> = {};
    let hasError = false;

    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(
        field as keyof typeof formData,
        value,
        formData
      );
      if (error) {
        errors[field] = error;
        hasError = true;
      }
    });

    setFieldErrors(errors);
    return { errors, hasError };
  };

  const formIsValid = 
    isFormValid({ ...formData, beneficiaries: Number(formData.beneficiaries) }) &&
    Object.keys(fieldErrors).length === 0;

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

  const resetValidation = () => {
    setFieldErrors({});
  };

  return {
    fieldErrors,
    formIsValid,
    clearFieldError,
    handleBlur,
    validateAllFields,
    getValidationSummary,
    resetValidation
  };
};