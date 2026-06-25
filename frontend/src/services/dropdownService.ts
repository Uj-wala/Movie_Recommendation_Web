import api from "../api/axios";

export interface DropdownItem {
  id: string;
  name: string;
}

export interface CountryDropdown {
  id: string;
  name: string;
  code: string;
}

export const getSubjectsDropdown = async (): Promise<DropdownItem[]> => {
  const response = await api.get<DropdownItem[]>(
    "/dropdowns/subjects"
  );

  return response.data;
};

export const getRolesDropdown = async (): Promise<DropdownItem[]> => {
  const response = await api.get<DropdownItem[]>(
    "/dropdowns/roles"
  );

  return response.data;
};

export const getCountriesDropdown = async (): Promise<CountryDropdown[]> => {
  const response = await api.get<CountryDropdown[]>(
    "/dropdowns/countries"
  );

  return response.data;
};