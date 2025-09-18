import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProjectForm from "../features/projects/component/ProjectForm";

describe("ProjectForm", () => {
  it("shows validation error if fields are empty", async () => {
    render(<ProjectForm onSubmit={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /add/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/beneficiaries is required/i)).toBeInTheDocument();
  });

  it("submits valid form", async () => {
    const handleSubmit = vi.fn();
    render(<ProjectForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Education Project" },
    });
    fireEvent.change(screen.getByLabelText(/beneficiaries/i), {
      target: { value: "100" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(handleSubmit).toHaveBeenCalled();
  });
});
