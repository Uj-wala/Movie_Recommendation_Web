import api from "../api/api";
 
export interface PhoneRegistrationData {
  full_name: string;
  phone_number?: string;
  email?: string;
  password: string;
  confirm_password: string;
  security_question: string;
  security_answer: string;
  // role_id: string;
  agree_to_terms: boolean;
}
 
export interface ConfirmRoleData {
  user_id: string;
  role_id: string;
}
 
export interface EmailOtpData {
  email: string;
  otp_code: string;
}
 
export interface StudentDetailsData {
  user_id: string;
  grade: string;
  work_place?: string | null;
  school_name?: string | null;
}
 
export interface StudentDetailsResponse {
  message: string;
  user_id: string;
  student_id: string;
}
 
export interface ParentVerificationData {
  user_id: string;
  student_reference_id: string;
}
 
export interface ParentVerificationResponse {
  message: string;
  user_id: string;
  parent_id: string;
}
 
export interface TeacherVerificationData {
  user_id: string;
  school_name: string;
  subject_ids: string[];
}
 
export interface TeacherVerificationResponse {
  message: string;
  user_id: string;
  teacher_id: string;
}
 
export const getApiErrorMessage = (error: any): string => {
  const detail = error?.response?.data?.detail;
  const message = error?.response?.data?.message;
 
  if (typeof detail === "string") return detail;
  if (typeof message === "string") return message;
 
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const field = item?.loc?.join(".");
        return field ? `${field}: ${item?.msg}` : item?.msg;
      })
      .join(", ");
  }
 
  if (typeof detail === "object" && detail !== null) {
    return JSON.stringify(detail);
  }
 
  return error?.message || "Something went wrong";
};
 
export const getPhoneOtpCandidates = (phoneNumber: string): string[] => {
  const normalized = phoneNumber.startsWith("+")
    ? phoneNumber
    : `+${phoneNumber}`;
 
  const candidates = [normalized];
 
  if (normalized.startsWith("+91") && normalized.length === 13) {
    candidates.push(`+${normalized.slice(3)}`);
  }
 
  return [...new Set(candidates)];
};
 
// PHONE REGISTRATION
export const phoneRegistration = async (data: PhoneRegistrationData) => {
  const response = await api.post("/auth/register/phone", data);
  return response.data;
};
 
export const emailRegistration = async (data: PhoneRegistrationData) => {
  const response = await api.post("/auth/register/email", data);
  return response.data;
};
 
export const confirmRole = async (data: ConfirmRoleData) => {
  const response = await api.post("/auth/confirm-role", data);
  return response.data;
};
 
// PHONE OTP SEND / RESEND
export const resendPhoneOtp = async (phone_number: string) => {
  const response = await api.post("/auth/resend-otp", {
    phone_number,
  });
 
  return response.data;
};
 
export const resendPhoneOtpWithFallback = async (phone_number: string) => {
  const candidates = getPhoneOtpCandidates(phone_number);
  let lastError: any;
 
  for (const candidate of candidates) {
    try {
      const data = await resendPhoneOtp(candidate);
      return {
        data,
        phone_number: candidate,
      };
    } catch (error: any) {
      lastError = error;
 
      if (!getApiErrorMessage(error).toLowerCase().includes("user not found")) {
        throw error;
      }
    }
  }
 
  throw lastError;
};
 
// PHONE OTP VERIFY
export const verifyPhoneOtp = async (
  phone_number: string,
  otp_code: string
) => {
  const response = await api.post("/auth/verify-otp", {
    phone_number,
    otp_code,
  });
 
  return response.data;
};
 
// EMAIL OTP SEND
export const sendEmailOtp = async (email: string) => {
  const response = await api.post("/auth/send-email-otp", {
    email,
  });
 
  return response.data;
};
 
// EMAIL OTP VERIFY
export const verifyEmailOtp = async (
  email: string,
  otp_code: string
) => {
  const response = await api.post("/auth/verify-email-otp", {
    email,
    otp_code,
  });
 
  return response.data;
};
 
export const verifyPhoneOtpWithFallback = async (
  phone_number: string,
  otp_code: string
) => {
  const candidates = getPhoneOtpCandidates(phone_number);
  let lastError: any;
 
  for (const candidate of candidates) {
    try {
      const data = await verifyPhoneOtp(candidate, otp_code);
      return {
        data,
        phone_number: candidate,
      };
    } catch (error: any) {
      lastError = error;
      const message = getApiErrorMessage(error).toLowerCase();
 
      if (
        !message.includes("user not found") &&
        !message.includes("invalid or expired otp")
      ) {
        throw error;
      }
    }
  }
 
  throw lastError;
};
 
export const saveStudentDetails = async (data: StudentDetailsData) => {
  const response = await api.post<StudentDetailsResponse>("/auth/student-verification", data);
  return response.data;
};
 
export const saveParentVerification = async (
  data: ParentVerificationData
) => {
  const response = await api.post<ParentVerificationResponse>("/auth/parent-verification", data);
  return response.data;
};
 
export const saveTeacherVerification = async (
  data: TeacherVerificationData
) => {
  const response = await api.post<TeacherVerificationResponse>("/auth/teacher-verification", data);
  return response.data;
};
