// src/widgets/Notifications.tsx
import React, { useEffect } from "react";

interface Props {
  error: string | null;
  success: string | null;
  onClose: () => void;
}

export default function Notifications({ error, success, onClose }: Props) {
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success, onClose]);

  if (!error && !success) return null;

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow">
          ✅ {success}
        </div>
      )}
    </div>
  );
}
