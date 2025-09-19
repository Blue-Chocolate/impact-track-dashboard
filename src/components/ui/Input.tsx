import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    type?: string;
  };

export default function Input({ className = "", type = "text", ...props }: InputProps) {
  const baseClasses =
    "w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200";

  if (type === "textarea") {
    return (
      <textarea
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        className={`${baseClasses} resize-none ${className}`}
      />
    );
  }

  return (
    <input
      type={type}
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      className={`${baseClasses} ${className}`}
    />
  );
}
