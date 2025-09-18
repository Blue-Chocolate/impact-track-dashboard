import { useCallback } from 'react';
import { PROJECT_TEMPLATES } from '../constants/templates';
import { type FormData } from '../types/types';

export function useFormTemplates(
  handleFieldChange: (field: keyof FormData, value: any) => void,
  setIsDirty: (dirty: boolean) => void
) {
  const handleAutoFill = useCallback((projectType: string) => {
    const template = PROJECT_TEMPLATES[projectType as keyof typeof PROJECT_TEMPLATES];
    if (template) {
      Object.entries(template).forEach(([field, value]) => {
        handleFieldChange(field as keyof FormData, value);
      });
      setIsDirty(true);
    }
  }, [handleFieldChange, setIsDirty]);

  return { handleAutoFill };
}