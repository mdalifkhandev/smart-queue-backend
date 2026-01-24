export const USER_ROLE = {
  admin: "admin",
  staff: "staff",
  user: "user",
} as const;

export type TUser_Role = keyof typeof USER_ROLE;
