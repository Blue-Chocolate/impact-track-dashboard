import React from 'react';

interface TextInputProps {
  id: string;
  name: string;
  type?: 'text' | 'number' | 'date';
  value: string | number;
  onChange: (value: string | number) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  autoComplete?: string;
}

export function TextInput({
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  placeholder,
  maxLength,
  min,
  max,
  autoComplete = 'off'
}: TextInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      onChange(parseInt(e.target.value) || 0);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
        error ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
      }`}
      placeholder={placeholder}
      maxLength={maxLength}
      min={min}
      max={max}
      disabled={disabled}
      aria-describedby={error ? `${name}-error` : undefined}
      autoComplete={autoComplete}
    />
  );
}