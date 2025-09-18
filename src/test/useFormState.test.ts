import { renderHook, act } from '@testing-library/react';
import { useFormState } from '../features/projects/hooks/useFormState';
import { type Project } from '../features/projects/types/types';

describe('useFormState Hook', () => {
  it('should initialize with empty form data', () => {
    const { result } = renderHook(() => useFormState());
    
    expect(result.current.formData.name).toBe('');
    expect(result.current.formData.description).toBe('');
    expect(result.current.formData.beneficiaries).toBe(0);
    expect(result.current.isDirty).toBe(false);
  });

  it('should initialize with provided initial values', () => {
    const initialValues: Project = {
      id: '1',
      name: 'Test Project',
      description: 'Test Description',
      beneficiaries: 100,
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    };

    const { result } = renderHook(() => useFormState(initialValues));
    
    expect(result.current.formData.name).toBe('Test Project');
    expect(result.current.formData.description).toBe('Test Description');
    expect(result.current.formData.beneficiaries).toBe(100);
  });

  it('should handle field changes correctly', () => {
    const { result } = renderHook(() => useFormState());
    
    act(() => {
      result.current.handleFieldChange('name', 'New Project Name');
    });

    expect(result.current.formData.name).toBe('New Project Name');
    expect(result.current.isDirty).toBe(true);
  });

  it('should handle field blur and validation', () => {
    const { result } = renderHook(() => useFormState());
    
    act(() => {
      result.current.handleFieldBlur('name');
    });

    expect(result.current.touched.name).toBe(true);
    expect(result.current.errors.name).toBeDefined();
  });

  it('should reset form correctly', () => {
    const { result } = renderHook(() => useFormState());
    
    act(() => {
      result.current.handleFieldChange('name', 'Test Name');
    });

    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData.name).toBe('');
    expect(result.current.isDirty).toBe(false);
    expect(result.current.touched.name).toBe(false);
  });
});
