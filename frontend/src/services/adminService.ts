import toast from "react-hot-toast";
import api from "../api/axios";

type CreateRolePayload = {
  name: string;
  email: string;
  role_id: string;
  permissions: string[];
};

export const fetchUser = async () => {
    try {
        const response = await api.get('/admin/users');
        return response;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

export const toggleUserActiveStatus = async (userId: string, isActive: boolean) => {
    try {
        const response = await api.put(`/admin/users/${userId}/change-role-status`, { is_active: isActive });
        return response;
    } catch (error) {
        console.error('Error toggling user status:', error);
    }
}
export const editUser = async (userId: string, data: any) => {
    try {
        const response = await api.put(`/admin/users/${userId}/change-role-status`, data);
        return response;
    } catch (error) {
        console.error('Error editing user:', error);
    }
}

export const fetchPermissions = async () => {
    try {
        const response = await api.get('/admin/permissions');
        return response;
    } catch (error) {
        console.error('Error fetching permissions:', error);
    }
}

export const fetchPermissionsByRoleId = async (role_id: string) => {

    if (!role_id) return;
    try {
        const response = await api.get(`/admin/roles/${role_id}/permissions`);
        return response;
    } catch (error) {
    console.log("Error Creating Role :::", error)
    }
}

export const createRole = async (payload:CreateRolePayload) => {
    try {
    const response = await api.post(`/admin/users-create/`,payload);
      if (response?.status === 200) {
        return response
      }
    } catch (error: any) {
      if (error?.status === 400) {
        toast.error(error?.response.data?.detail)
      }
      console.log("Error Creating Role :::", error)
      throw error
    }
}