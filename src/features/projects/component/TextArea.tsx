import React from 'react';

interface TextAreaProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}

export function TextArea({
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  placeholder,
  maxLength,
  rows = 4
}: TextAreaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      rows={rows}
      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-vertical ${
        error ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
      }`}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      aria-describedby={error ? `${name}-error` : undefined}
    />
  );
}