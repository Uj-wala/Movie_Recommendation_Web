export const EMAIL_FORMAT_ERROR = "Enter a valid email address.";
export const EMAIL_MAX_LENGTH = 100;
export const EMAIL_MAX_LENGTH_ERROR =
  "Email Address cannot exceed 100 characters.";
const EMAIL_ALLOWED_INPUT_CHARS = /[^A-Za-z0-9._+\-@]/g;
export const limitEmailInput = (value: string) =>
  value.slice(0, EMAIL_MAX_LENGTH);
export const hasReachedEmailMaxLength = (value: string) =>
  value.length >= EMAIL_MAX_LENGTH;
export const sanitizeEmailInput = (value: string) =>
  value.replace(EMAIL_ALLOWED_INPUT_CHARS, "");
export const PASSWORD_LENGTH_ERROR = "Password must be 8 to 12 characters";
export const PASSWORD_COMPLEXITY_ERROR =
  "Password must contain uppercase, lowercase, number and special character";
export const PASSWORD_RESTRICTED_CHAR_ERROR =
  "Spaces and dots (.) are not allowed in the password.";
export const UNREGISTERED_MOBILE_NUMBER_ERROR =
  "This mobile number is not registered. Please check the number or create a new account.";
export const UNREGISTERED_EMAIL_ERROR =
  "This email address is not registered. Please check the email or create a new account.";

export const getEmailValidationError = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) return "";

  if (/\s/.test(value)) {
    return "Email address cannot contain spaces.";
  }

  if (/[^A-Za-z0-9._+\-@]/.test(trimmedValue)) {
    return "Email address contains invalid characters.";
  }

  const atMatches = trimmedValue.match(/@/g) || [];
  if (atMatches.length !== 1) {
    return "Email address must contain exactly one @ symbol.";
  }

  const [localPart, domainPart] = trimmedValue.split("@");
  if (!localPart || !domainPart) {
    return EMAIL_FORMAT_ERROR;
  }

  if (!/^[A-Za-z0-9._+-]+$/.test(localPart)) {
    return "Email address contains invalid characters before @.";
  }

  if (!/^[A-Za-z0-9.-]+$/.test(domainPart)) {
    return "Email address contains invalid characters after @.";
  }

  if (localPart.startsWith(".") || localPart.endsWith(".")) {
    return "Email address cannot start or end with a dot before @.";
  }

  if (trimmedValue.includes("..")) {
    return "Email address cannot contain consecutive dots.";
  }

  if (!domainPart.includes(".")) {
    return "Email domain must include a dot.";
  }

  const domainLabels = domainPart.split(".");
  if (domainLabels.some((label) => !label)) {
    return EMAIL_FORMAT_ERROR;
  }

  if (domainLabels.some((label) => label.startsWith("-") || label.endsWith("-"))) {
    return "Email domain labels cannot start or end with a hyphen.";
  }

  const tld = domainLabels[domainLabels.length - 1];
  if (!/^[A-Za-z]{2,}$/.test(tld)) {
    return "Email domain extension must contain at least two letters.";
  }

  return "";
};

export const isValidEmailFormat = (value: string) =>
  !getEmailValidationError(value);

export const isValidPasswordLength = (value: string) =>
  value.length >= 8 && value.length <= 12;

export const isValidPasswordComplexity = (value: string) =>
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])/.test(value);

export const hasRestrictedPasswordChars = (value: string) => /[ .]/.test(value);

export const sanitizePasswordInput = (value: string) => value.replace(/[ .]/g, "");

export const isValidPasswordCharacters = (value: string) =>
  !hasRestrictedPasswordChars(value);

export const getApiDetailMessage = (detail: unknown) => {
  if (Array.isArray(detail)) {
    return detail[0]?.msg || "";
  }

  if (typeof detail === "string") {
    return detail;
  }

  if (detail && typeof detail === "object" && "message" in detail) {
    const message = (detail as { message?: unknown }).message;
    return typeof message === "string" ? message : "";
  }

  return "";
};

export const isUnregisteredMobileNumberError = (detail: unknown) => {
  const message = getApiDetailMessage(detail).toLowerCase();

  return (
    message.includes("user not found") ||
    message.includes("mobile number not registered") ||
    message.includes("phone number not registered") ||
    message.includes("not registered") ||
    message.includes("does not exist")
  );
};

export const isUnregisteredEmailError = (detail: unknown) => {
  const message = getApiDetailMessage(detail).toLowerCase();

  return (
    message.includes("email address not registered") ||
    message.includes("email not registered")
  );
};
