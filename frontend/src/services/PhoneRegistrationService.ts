import api from "../api/api";

export interface PhoneRegistrationData {
  full_name: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  security_question: string;
  security_answer: string;
  role: string;
}

export interface StudentDetailsData {
  user_id: string;
  grade: string;
  work_place?: string | null;
  school_name?: string;
}

export interface ParentVerificationData {
  user_id: string;
  child_name: string;
  child_grade: string;
  student_reference_id?: string;
}

export interface TeacherVerificationData {
  user_id: string;
  school_name: string;
  subject: string;
}

export const phoneRegistration = async (
  data: PhoneRegistrationData
) => {
  const response = await api.post(
    "/auth/register/phone",
    data
  );

  return response.data;
};

export const saveStudentDetails = async (
  data: StudentDetailsData
) => {
  const response = await api.post(
    "/auth/student-verification",
    data
  );

  return response.data;
};

export const saveParentVerification = async (
  data: ParentVerificationData
) => {
  const response = await api.post(
    "/auth/parent-verification",
    data
  );

  return response;
};

export const saveTeacherVerification = async (
  data: TeacherVerificationData
) => {
  const response = await api.post(
    "/auth/teacher-verification",
    data
  );

  return response;
};