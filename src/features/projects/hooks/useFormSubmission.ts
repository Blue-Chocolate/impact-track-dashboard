import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { addNotification, resetForm } from "../projectsSlice";
import type { FormData } from "../types/types";

export const useFormSubmission = (
  initialValues: any,
  onSubmit?: (data: FormData) => void
) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (
    formData: FormData,
    validateAllFields: () => { errors: Record<string, string>; hasError: boolean },
    resetValidation: () => void,
    setHasAttemptedSubmit: (value: boolean) => void
  ) => {
    setHasAttemptedSubmit(true);
    const { errors, hasError } = validateAllFields();

    if (hasError) {
      console.log("Form validation failed:", errors); // Debug log
      dispatch(
        addNotification({
          message: `Please fix ${Object.keys(errors).length} error${
            Object.keys(errors).length > 1 ? "s" : ""
          } before submitting`,
          type: "error",
        })
      );
      return false;
    }

    try {
      console.log("Submitting form with data:", formData); // Debug log
      onSubmit?.(formData);

      console.log("Form submitted successfully, dispatching notification"); // Debug log
      dispatch(
        addNotification({
          message: initialValues
            ? "Project updated successfully!"
            : "Project created successfully!",
          type: "success",
        })
      );

      dispatch(resetForm());
      resetValidation();
      setHasAttemptedSubmit(false);
      return true;
    } catch (error) {
      console.error("Form submission error:", error); // Debug log
      dispatch(
        addNotification({
          message: "Something went wrong. Please try again.",
          type: "error",
        })
      );
      return false;
    }
  };

  return { handleSubmit };
};
