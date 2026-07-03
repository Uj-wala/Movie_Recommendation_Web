export interface User {
  id?: string;
  name: string;
  email: string;
  role_name: string;
  role_id: string | null;
  is_active: number;
  registration_number:string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  permissions?: any;
  status: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UserOrRole = Partial<User & Role> & { permissions?: any };
