// src/components/ui/Toast.tsx
import React, { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

type ToastProps = {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
};

const Toast: React.FC<ToastProps> = ({ message, type = "info", duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  let bgClass = "bg-blue-500";
  if (type === "success") bgClass = "bg-green-500";
  if (type === "error") bgClass = "bg-red-500";

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-2 text-white rounded ${bgClass}`}>
      {message}
    </div>
  );
};

export default Toast;
