export interface ValidationResult {
  isValid: boolean;
  error?: string;
}


export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
};


export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string
): ValidationResult => {
  if (value.trim().length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }
  return { isValid: true };
};


export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string
): ValidationResult => {
  if (value.trim().length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be less than ${maxLength} characters`,
    };
  }
  return { isValid: true };
};


export const combineValidationResults = (...results: ValidationResult[]): ValidationResult => {
  for (const result of results) {
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true };
};
