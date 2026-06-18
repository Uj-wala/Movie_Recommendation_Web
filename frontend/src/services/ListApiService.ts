import api from "../api/axios";

export const fetchDropdownData = async (endpoint: string) => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(`Error fetching dropdown data from ${endpoint}:`, error);
        throw error;
    }
}