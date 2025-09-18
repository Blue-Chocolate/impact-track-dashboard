export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-_.()]+$/,
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500,
  },
  beneficiaries: {
    required: true,
    min: 1,
    max: 1000000,
  },
} as const;