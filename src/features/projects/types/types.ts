export interface Project {
  id: string;
  name: string;
  description: string;
  beneficiaries: number;
  startDate: string;
  endDate: string;
}

export interface ProjectFormProps {
  onSubmit: (project: Omit<Project, "id"> | Project) => void;
  initialValues?: Project;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface ValidationErrors {
  name?: string;
  description?: string;
  beneficiaries?: string;
  startDate?: string;
  endDate?: string;
}

export interface FormData extends Omit<Project, "id"> {
  name: string;
  description: string;
  beneficiaries: number;
  startDate: string;
  endDate: string;
}