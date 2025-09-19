import React from "react";
import Button from "@/components/ui/Button";
import FormStatus from "./FormStatus";
import { useDispatch } from "react-redux";
import { addNotification } from "../../notifications/notificationsSlice";

interface FormActionsProps {
  onCancel?: () => void;
  onReset: () => void;
  initialValues: any;
  formIsValid: boolean;
  isLoading: boolean;
  isDirty: boolean;
  hasAttemptedSubmit: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onReset,
  initialValues,
  formIsValid,
  isLoading,
  isDirty,
  hasAttemptedSubmit
}) => {
  const dispatch = useDispatch();

  const handleCancel = () => {
    onCancel?.();
    dispatch(addNotification({ message: "Action cancelled", type: "info" }));
  };

  const handleReset = () => {
    onReset();
    dispatch(addNotification({ message: "Form reset successfully", type: "success" }));
  };

  return (
    <div className="border-t border-gray-200 pt-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center space-x-4">
          <FormStatus isDirty={isDirty} />
          {hasAttemptedSubmit && formIsValid && (
            <div className="flex items-center text-green-600 text-sm">
              ✅ Form is valid
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          {onCancel && (
            <Button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border rounded-xl"
            >
              Cancel
            </Button>
          )}

          <Button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || isLoading}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border rounded-xl"
          >
            Reset
          </Button>

          <Button
            type="submit"
            disabled={!formIsValid || isLoading}
            className={`px-8 py-3 text-sm font-medium text-white rounded-xl ${
              !formIsValid || isLoading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            onClick={() => {
              dispatch(addNotification({
                message: initialValues ? "Project updated successfully" : "Project created successfully",
                type: "success"
              }));
            }}
          >
            {initialValues ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </div>
    </div>
  );
};
