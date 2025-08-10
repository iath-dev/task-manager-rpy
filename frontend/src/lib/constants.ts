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
  role: "ADMIN",
};

export const PAGE_SIZE_OPTIONS = ["5", "10", "15", "20"] as const;

export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

export const PRIORITIES = ["high", "medium", "low"] as const;

export type Priority = (typeof PRIORITIES)[number];

export const ROLES = ["ADMIN", "COMMON"] as const;

export type Role = (typeof ROLES)[number];
