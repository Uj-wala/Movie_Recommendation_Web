import api from "../api/axios";

export interface UpdateParentProfileRequest {
    full_name: string;
    relationship_type: string;
    email?: string | null;
    phone_number?: string | null;
}

export interface ParentPasswordUpdateRequest {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

export interface AddChildRequest {
    student_registration_number: string;
}

export const getParentProfile = async () => {
    const response = await api.get(
        "/parent-profile"
    );

    return response.data;
};

export const updateParentProfile = async (
    data: UpdateParentProfileRequest
) => {
    const response = await api.patch(
        "/parent-profile",
        data
    );

    return response.data;
};

export const addChild = async (
    data: AddChildRequest
) => {
    const response = await api.post(
        "/parent-profile/children",
        data
    );

    return response.data;
};

export const removeChild = async (
    childId: string
) => {
    const response = await api.delete(
        `/parent-profile/children/${childId}`
    );

    return response.data;
};

export const updateParentPassword = async (
    data: ParentPasswordUpdateRequest
) => {
    const response = await api.patch(
        "/parent-profile/password",
        data
    );

    return response.data;
};

export const getParentDashboard = async () => {
    const response = await api.get(
        "/parent-profile/dashboard"
    );

    return response.data;
};

export const fetchStudentDetailsByRegistrationNumber = async (
    registrationNumber: string
) => {
    const response = await api.get(
        `/parent-profile/student/${registrationNumber}`
    );

    return response.data;
};