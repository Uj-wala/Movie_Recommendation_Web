import api from "../api/axios";

export type ParentProfileChild = {
  id: string;
  student_reference_id?: string | null;
  registration_number?: string | null;
  child_name?: string | null;
  grade?: string | null;
  school_name?: string | null;
};

type ParentProfileResponse = {
  children?: ParentProfileChild[];
};

export const fetchStudentDetailsByStudentId = async (studentId: string) => {
  const response = await api.get<ParentProfileResponse>("/parent-profile");
  const normalizedStudentId = studentId.trim().toLowerCase();

  return response.data.children?.find((child) => {
    return (
      child.registration_number?.toLowerCase() === normalizedStudentId ||
      child.student_reference_id?.toLowerCase() === normalizedStudentId ||
      child.id?.toLowerCase() === normalizedStudentId
    );
  }) || null;
};
