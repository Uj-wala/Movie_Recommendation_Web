export const EMAIL_FORMAT_ERROR = "Invalid email format.";
export const PASSWORD_LENGTH_ERROR = "Password must be 8 to 12 characters";
export const PASSWORD_COMPLEXITY_ERROR =
  "Password must contain uppercase, lowercase, number and special character";

export const isValidEmailFormat = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export const isValidPasswordLength = (value: string) =>
  value.length >= 8 && value.length <= 12;

export const isValidPasswordComplexity = (value: string) =>
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.#])/.test(value);
