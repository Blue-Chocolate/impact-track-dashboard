// src/features/projects/component/TemplateButtons.tsx
import React from "react";
import { useDispatch } from "react-redux";
import { updateFormField } from "../projectsSlice";
import type { FormData } from "../types/types";

interface TemplateButtonsProps {
  isLoading?: boolean;
}

export function TemplateButtons({ isLoading = false }: TemplateButtonsProps) {
  const dispatch = useDispatch();

  const templates: Record<string, Partial<FormData>> = {
    education: {
      name: "New School Program",
      description: "Build a program to support education in rural areas",
      beneficiaries: 50,
      startDate: "2025-10-01",
      endDate: "2025-12-31",
    },
    healthcare: {
      name: "Community Health Initiative",
      description: "Provide free health checkups and awareness sessions",
      beneficiaries: 100,
      startDate: "2025-10-15",
      endDate: "2025-11-30",
    },
    environment: {
      name: "Tree Planting Campaign",
      description: "Plant trees in urban areas to improve air quality",
      beneficiaries: 200,
      startDate: "2025-11-01",
      endDate: "2025-11-30",
    },
    infrastructure: {
      name: "Community Center Construction",
      description: "Build a center for community activities and learning",
      beneficiaries: 150,
      startDate: "2025-10-20",
      endDate: "2025-12-15",
    },
  };

  const handleTemplateClick = (type: string) => {
    const templateData = templates[type];
    if (!templateData) return;

    // Dispatch each field to Redux
    Object.entries(templateData).forEach(([field, value]) =>
      dispatch(updateFormField({ field, value }))
    );
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="text-sm font-medium mb-2">Quick Start Templates:</h3>
      <div className="flex flex-wrap gap-2">
        {Object.keys(templates).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleTemplateClick(type)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
            disabled={isLoading}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
