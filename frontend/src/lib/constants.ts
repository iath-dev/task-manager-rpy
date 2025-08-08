import { RoleEnum } from "@/interfaces/user";
import { LayoutDashboard, ListTodo, ShieldCheck } from "lucide-react";

export const NAV_LINKS = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    path: "/tasks",
    icon: ListTodo,
  },
];

export const ADMIN_NAV_LINK = {
  title: "Admin Panel",
  path: "/admin",
  icon: ShieldCheck,
  role: RoleEnum.Admin,
};
