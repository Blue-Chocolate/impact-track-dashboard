// src/hooks/useFormState.ts
import { useState, useCallback, useEffect } from 'react';
import {  type FormData,type ValidationErrors,type Project } from '../types/types';
import { validateField, validateForm, focusFirstErrorField } from '../utils/validation';

const initialFormData: FormData = {
  name: "",
  description: "",
  beneficiaries: 0,
  startDate: "",
  endDate: "",
};

const initialTouchedState = {
  name: false,
  description: false,
  beneficiaries: false,
  startDate: false,
  endDate: false,
};

export function useFormState(initialValues?: Project) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>(initialTouchedState);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form with initial values
  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name,
        description: initialValues.description,
        beneficiaries: initialValues.beneficiaries,
        startDate: initialValues.startDate,
        endDate: initialValues.endDate,
      });
      setIsDirty(false);
    }
  }, [initialValues]);

  const handleFieldChange = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);

    // Validate field if it's been touched
    if (touched[field]) {
      const error = validateField(field, value, formData);
      setErrors(prev => ({
        ...prev,
        [field]: error || undefined,
      }));
    }
  }, [touched, formData]);

  const handleFieldBlur = useCallback((field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate the field on blur
    const error = validateField(field, formData[field], formData);
    setErrors(prev => ({
      ...prev,
      [field]: error || undefined,
    }));
  }, [formData]);

  const validateAllFields = useCallback(() => {
    setTouched(initialTouchedState);
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      focusFirstErrorField(validationErrors);
      return false;
    }
    return true;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setTouched(initialTouchedState);
    setIsDirty(false);
  }, []);

  return {
    formData,
    errors,
    touched,
    isDirty,
    handleFieldChange,
    handleFieldBlur,
    validateAllFields,
    resetForm,
  };
}

