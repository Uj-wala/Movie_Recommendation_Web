export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  permissions?: any;
  status: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UserOrRole = Partial<User & Role> & { permissions?: any };
