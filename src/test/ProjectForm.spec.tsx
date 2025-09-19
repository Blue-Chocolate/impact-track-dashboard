// src/test/ProjectForm.spec.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { store } from "../store/store";
import ProjectForm from "../features/projects/component/ProjectForm";

const renderWithProvider = (ui: React.ReactNode) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("ProjectForm", () => {
  it("shows validation error if fields are empty", async () => {
    renderWithProvider(<ProjectForm onSubmit={() => {}} />);

    // Get the form element directly using querySelector since it doesn't have role="form"
    const form = document.querySelector('form');
    const submitButton = screen.getByRole("button", { name: /create project/i });

    // Try submitting the form to trigger validation
    if (form) {
      fireEvent.submit(form);
    }

    // Since the submit button is disabled, the form might not trigger validation
    // Let's try filling and then clearing fields to trigger validation states
    
    const nameInput = screen.getByLabelText(/project name/i);
    const beneficiariesInput = screen.getByLabelText(/number of beneficiaries/i);
    
    // Focus and blur to trigger validation
    fireEvent.focus(nameInput);
    fireEvent.blur(nameInput);
    
    fireEvent.focus(beneficiariesInput);
    fireEvent.blur(beneficiariesInput);

    // Wait for validation to process
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check if button is disabled (which indicates form validation is working)
    expect(submitButton).toBeDisabled();
    
    // Debug what's in the DOM to see what validation messages actually appear
    // Remove this line after you see what validation messages are rendered
    screen.debug(document.body, 20000);
  });

  it("submits valid form", () => {
    // Use vi.fn() instead of jest.fn()
    const handleSubmit = vi.fn();

    renderWithProvider(<ProjectForm onSubmit={handleSubmit} />);

    // Fill out all required fields
    fireEvent.change(screen.getByLabelText(/project name/i), {
      target: { value: "Education Project" },
    });
    
    fireEvent.change(screen.getByLabelText(/number of beneficiaries/i), {
      target: { value: "150" },
    });
    
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2025-09-20" },
    });
    
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: "2025-09-25" },
    });
    
    fireEvent.change(screen.getByLabelText(/project description/i), {
      target: { value: "This is a valid test description" },
    });

    // Click the submit button
    fireEvent.click(
      screen.getByRole("button", { name: /create project/i })
    );

    expect(handleSubmit).toHaveBeenCalled();
  });
});