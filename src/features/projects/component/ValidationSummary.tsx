import React from "react";

interface ValidationSummaryProps {
  hasAttemptedSubmit: boolean;
  formIsValid: boolean;
  getValidationSummary: () => string | null;
  fieldErrors: Record<string, string>;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  hasAttemptedSubmit,
  formIsValid,
  getValidationSummary,
  fieldErrors
}) => {
  if (!hasAttemptedSubmit || formIsValid) {
    return null;
  }

  return (
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
  );
};