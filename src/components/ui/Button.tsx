// src/components/ui/Button.tsx
import React, { type ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  ...props
}) => {
  let className = "rounded font-semibold ";

  // Variant
  if (variant === "primary") className += "bg-blue-500 text-white hover:bg-blue-600";
  if (variant === "secondary") className += "bg-gray-500 text-white hover:bg-gray-600";
  if (variant === "danger") className += "bg-red-500 text-white hover:bg-red-600";

  // Size
  if (size === "sm") className += " px-2 py-1 text-sm";
  if (size === "md") className += " px-4 py-2 text-base";
  if (size === "lg") className += " px-6 py-3 text-lg";

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
