import React from 'react';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  characterCount?: {
    current: number;
    max: number;
  };
}

export function FormField({ 
  id, 
  name, 
  label, 
  error, 
  required = false, 
  disabled = false,
  children,
  characterCount
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="text-red-600 text-sm mt-1 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
      {characterCount && (
        <p className="text-gray-500 text-xs mt-1">
          {characterCount.current}/{characterCount.max} characters
        </p>
      )}
    </div>
  );
}
