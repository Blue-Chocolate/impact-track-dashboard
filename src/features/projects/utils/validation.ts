import { VALIDATION_RULES } from '../constants/validation';
import { type FormData, type ValidationErrors } from '../types/types';

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function validateField(
  field: keyof FormData, 
  value: any, 
  formData?: FormData
): string | null {
  const today = getTodayDate();
  
  switch (field) {
    case 'name':
      if (!VALIDATION_RULES.name.required && !value) return null;
      if (!value || !value.toString().trim()) return "Project name is required";
      if (value.length < VALIDATION_RULES.name.minLength) 
        return `Name must be at least ${VALIDATION_RULES.name.minLength} characters`;
      if (value.length > VALIDATION_RULES.name.maxLength) 
        return `Name must not exceed ${VALIDATION_RULES.name.maxLength} characters`;
      if (!VALIDATION_RULES.name.pattern.test(value)) 
        return "Name contains invalid characters";
      return null;

    case 'description':
      if (!VALIDATION_RULES.description.required && !value) return null;
      if (!value || !value.toString().trim()) return "Description is required";
      if (value.length < VALIDATION_RULES.description.minLength) 
        return `Description must be at least ${VALIDATION_RULES.description.minLength} characters`;
      if (value.length > VALIDATION_RULES.description.maxLength) 
        return `Description must not exceed ${VALIDATION_RULES.description.maxLength} characters`;
      return null;

    case 'beneficiaries':
      if (!value && value !== 0) return "Number of beneficiaries is required";
      const numValue = Number(value);
      if (isNaN(numValue)) return "Beneficiaries must be a valid number";
      if (numValue < VALIDATION_RULES.beneficiaries.min) 
        return `Must have at least ${VALIDATION_RULES.beneficiaries.min} beneficiary`;
      if (numValue > VALIDATION_RULES.beneficiaries.max) 
        return `Cannot exceed ${VALIDATION_RULES.beneficiaries.max} beneficiaries`;
      if (!Number.isInteger(numValue)) return "Beneficiaries must be a whole number";
      return null;

    case 'startDate':
      if (!value) return "Start date is required";
      if (value < today) return "Start date cannot be in the past";
      return null;

    case 'endDate':
      if (!value) return "End date is required";
      if (value < today) return "End date cannot be in the past";
      if (formData?.startDate && value <= formData.startDate) 
        return "End date must be after start date";
      return null;

    default:
      return null;
  }
}

export function validateForm(formData: FormData): ValidationErrors {
  const errors: ValidationErrors = {};
  
  (Object.keys(formData) as Array<keyof FormData>).forEach(field => {
    const error = validateField(field, formData[field], formData);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}

export function isFormValid(formData: FormData): boolean {
  return Object.keys(validateForm(formData)).length === 0;
}

export function focusFirstErrorField(errors: ValidationErrors): void {
  const firstErrorField = Object.keys(errors)[0];
  if (firstErrorField) {
    const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
    element?.focus();
  }
}