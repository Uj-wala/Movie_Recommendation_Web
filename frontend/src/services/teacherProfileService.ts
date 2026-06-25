import api from "../api/axios";

export interface TeacherProfile {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  qualification: string;
  bio: string;
  years_of_experience: string;
  subjects: string[];
  profile_image: string;
}

export interface UpdateTeacherProfilePayload {
  full_name?: string;
  qualification?: string;
  bio?: string;
  years_of_experience?: string;
  phone_number?: string;
  subject_ids?: string[];
}

export interface UpdateTeacherPasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface TeacherDashboard {
  full_name: string;
  subjects: string[];
  years_of_experience: string;
  qualification: string;
  assignments_assigned?: number;
  students_above_80?: number;
  subjects_handling?: number;
}

export const getTeacherProfile = async (): Promise<TeacherProfile> => {
  const response = await api.get<TeacherProfile>(
    "/teacher/profile"
  );

  return response.data;
};

export const updateTeacherProfile = async (
  payload: UpdateTeacherProfilePayload
): Promise<TeacherProfile> => {
  const response = await api.patch<TeacherProfile>(
    "/teacher/profile",
    payload
  );

  return response.data;
};

export const updateTeacherPassword = async (
  payload: UpdateTeacherPasswordPayload
): Promise<{ message: string }> => {
  const response = await api.patch<{ message: string }>(
    "/teacher/profile/password",
    payload
  );

  return response.data;
};

export const uploadTeacherProfileImage = async (
  file: File
): Promise<TeacherProfile> => {
  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  const response = await api.post<TeacherProfile>(
    "/teacher/profile/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getTeacherDashboard = async (): Promise<TeacherDashboard> => {
  const response = await api.get<TeacherDashboard>(
    "/teacher/dashboard"
  );

  return response.data;
};