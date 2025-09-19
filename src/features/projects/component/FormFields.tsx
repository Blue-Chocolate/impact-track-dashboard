import React from "react";

interface CharacterCount {
  current: number;
  max: number;
}

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  characterCount?: CharacterCount;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  error,
  required = false,
  helpText,
  characterCount,
  children
}) => {
  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className={`block text-sm font-medium ${
            error ? "text-red-700" : "text-gray-700"
          }`}
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
        
        {/* Character count */}
        {characterCount && (
          <span className={`text-xs ${
            characterCount.current > characterCount.max
              ? "text-red-500"
              : characterCount.current > characterCount.max * 0.8
              ? "text-yellow-600"
              : "text-gray-500"
          }`}>
            {characterCount.current}/{characterCount.max}
          </span>
        )}
      </div>

      {/* Input field (passed as children) */}
      <div className="relative">
        {children}
      </div>

      {/* Help text */}
      {helpText && !error && (
        <p className="text-sm text-gray-600">
          {helpText}
        </p>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center space-x-1">
          <svg
            className="w-4 h-4 text-red-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};