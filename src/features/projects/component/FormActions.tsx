// src/components/FormActions.tsx
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface FormActionsProps {
  isFormValid: boolean;
  isLoading: boolean;
  isDirty: boolean;
  initialValues?: any;
  onCancel?: () => void;
  onReset: () => void;
}

export function FormActions({
  isFormValid,
  isLoading,
  isDirty,
  initialValues,
  onCancel,
  onReset
}: FormActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 pt-4">
      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid || isLoading}
        className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
          !isFormValid || isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <LoadingSpinner />
            Processing...
          </span>
        ) : (
          initialValues ? "Update Project" : "Create Project"
        )}
      </button>

      {/* Cancel Button (only for edit mode) */}
      {initialValues && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
        >
          Cancel
        </button>
      )}

      {/* Reset Button (only for new projects) */}
      {!initialValues && (
        <button
          type="button"
          onClick={onReset}
          disabled={!isDirty || isLoading}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
        >
          Reset Form
        </button>
      )}
    </div>
  );
}