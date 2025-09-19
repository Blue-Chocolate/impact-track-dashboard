import React from "react";

interface FormHeaderProps {
  initialValues: any;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ initialValues }) => {
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-1">
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {initialValues ? "Edit Project" : "Create New Project"}
          </h2>
          <p className="text-gray-600 mt-2">
            {initialValues
              ? "Update your project details and save changes"
              : "Fill in the details below to create a new project"}
          </p>
        </div>
      </div>
    </div>
  );
};