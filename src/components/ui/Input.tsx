// src/components/ui/Input.tsx
import React, { type InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col mb-2">
      {label && <label className="mb-1 font-medium">{label}</label>}
      <input className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" {...props} />
    </div>
  );
};

export default Input;
