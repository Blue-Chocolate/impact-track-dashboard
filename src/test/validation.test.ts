import { validateField, validateForm, isFormValid, getTodayDate } from '../features/projects/utils/validation';
import { type FormData } from '../features/projects/types/types';

describe('Validation Utils', () => {
  describe('validateField', () => {
    it('should validate name field correctly', () => {
      expect(validateField('name', '')).toBe('Project name is required');
      expect(validateField('name', 'ab')).toBe('Name must be at least 3 characters');
      expect(validateField('name', 'Valid Name')).toBe(null);
      expect(validateField('name', 'Invalid@Name')).toBe('Name contains invalid characters');
    });

    it('should validate beneficiaries field correctly', () => {
      expect(validateField('beneficiaries', 0)).toBe('Must have at least 1 beneficiary');
      expect(validateField('beneficiaries', 'abc')).toBe('Beneficiaries must be a valid number');
      expect(validateField('beneficiaries', 1.5)).toBe('Beneficiaries must be a whole number');
      expect(validateField('beneficiaries', 100)).toBe(null);
    });

    it('should validate date fields correctly', () => {
      const today = getTodayDate();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      expect(validateField('startDate', yesterday)).toBe('Start date cannot be in the past');
      expect(validateField('startDate', tomorrow)).toBe(null);

      const formData: FormData = {
        name: 'Test',
        description: 'Test description',
        beneficiaries: 100,
        startDate: tomorrow,
        endDate: ''
      };
      
      expect(validateField('endDate', tomorrow, formData)).toBe('End date must be after start date');
    });
  });

  describe('validateForm', () => {
    it('should return errors for invalid form', () => {
      const invalidForm: FormData = {
        name: '',
        description: '',
        beneficiaries: 0,
        startDate: '',
        endDate: ''
      };

      const errors = validateForm(invalidForm);
      expect(Object.keys(errors)).toHaveLength(5);
    });

    it('should return no errors for valid form', () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const dayAfterTomorrow = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const validForm: FormData = {
        name: 'Valid Project Name',
        description: 'This is a valid description that meets all requirements',
        beneficiaries: 100,
        startDate: tomorrow,
        endDate: dayAfterTomorrow
      };

      const errors = validateForm(validForm);
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });

  describe('isFormValid', () => {
    it('should return false for invalid form', () => {
      const invalidForm: FormData = {
        name: '',
        description: '',
        beneficiaries: 0,
        startDate: '',
        endDate: ''
      };

      expect(isFormValid(invalidForm)).toBe(false);
    });

    it('should return true for valid form', () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const dayAfterTomorrow = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const validForm: FormData = {
        name: 'Valid Project Name',
        description: 'This is a valid description that meets all requirements',
        beneficiaries: 100,
        startDate: tomorrow,
        endDate: dayAfterTomorrow
      };

      expect(isFormValid(validForm)).toBe(true);
    });
  });
});