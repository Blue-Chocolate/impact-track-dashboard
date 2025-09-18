/**
 * ToastContainer
 *
 * - Renders toasts stacked in top-right corner
 * - Each toast has color depending on type
 * - Auto-dismiss handled by NotificationContext
 */

import React from "react";
import { useNotifications } from "../context/NotificationContext";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded shadow-md text-white cursor-pointer transition-all
            ${
              toast.type === "success"
                ? "bg-green-600"
                : toast.type === "error"
                ? "bg-red-600"
                : toast.type === "warning"
                ? "bg-yellow-600"
                : "bg-blue-600"
            }`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
