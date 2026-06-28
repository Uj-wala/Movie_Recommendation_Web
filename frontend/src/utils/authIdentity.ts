export type LoginType = "email" | "phone";

const firstNonEmptyString = (...values: unknown[]) =>
  values.find((value): value is string =>
    typeof value === "string" && value.trim().length > 0
  )?.trim() || "";

export const persistLoginIdentity = (
  response: any,
  submittedIdentifier: string,
  submittedLoginType: LoginType
) => {
  const user = response?.user;
  const responseLoginType = firstNonEmptyString(
    response?.loginType,
    response?.login_type,
    user?.loginType,
    user?.login_type,
  ).toLowerCase();
  const loginType: LoginType =
    responseLoginType === "email" || responseLoginType === "phone"
      ? responseLoginType
      : submittedLoginType;

  const email = firstNonEmptyString(response?.email, user?.email);
  const phoneNumber = firstNonEmptyString(
    response?.phoneNumber,
    response?.phone_number,
    user?.phoneNumber,
    user?.phone_number
  );
  const explicitIdentifier = firstNonEmptyString(
    response?.loginIdentifier,
    response?.login_identifier,
    user?.loginIdentifier,
    user?.login_identifier
  );
  const loginIdentifier =
    explicitIdentifier ||
    (loginType === "email" ? email : phoneNumber) ||
    submittedIdentifier.trim();

  localStorage.setItem("loginIdentifier", loginIdentifier);
  localStorage.setItem("loginType", loginType);

  // Keep the existing key populated for components outside the dashboard modules.
  localStorage.setItem("userEmail", loginIdentifier);
};

export const getAuthenticatedLoginIdentifier = () =>
  firstNonEmptyString(
    localStorage.getItem("loginIdentifier"),
    localStorage.getItem("userEmail")
  );
