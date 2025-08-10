export interface User {
  email: string;
  username: string;
  full_name: string;
  id: number;
  role: RoleEnum;
  last_access: string;
  is_active: boolean;
}

export const RoleEnum = {
  Admin: "ADMIN",
  User: "COMMON",
} as const;

export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum];
