import React from 'react';

interface FormStatusProps {
  isDirty: boolean;
}

export default function FormStatus({ isDirty }: FormStatusProps) {
  if (!isDirty) return null;

  return (
    <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-3">
      <span className="flex items-center">
        <span className="mr-2">💾</span>
        You have unsaved changes
      </span>
    </div>
  );
}