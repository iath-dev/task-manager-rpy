import { Menu, Moon, Sun, SunMoon } from "lucide-react"; // Assuming lucide-react is installed
import { Link, useNavigate } from "react-router";

import logo from "@/assets/logo.svg";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/authStore";
import { useSidebarStore } from "@/store/sidebarStore";

import { Button } from "./button";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuthStore();
  const { toggle } = useSidebarStore();
  const navigation = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    navigation("/auth");
  };

  const getIcon = () => {
    switch (theme) {
      case "system":
        return <SunMoon />;
      case "dark":
        return <Moon />;
      case "light":
        return <Sun />;
    }
  };

  return (
    <nav className="bg-background border-b-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="flex lg:hidden"
            onClick={toggle}
          >
            <Menu />
          </Button>
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <figure>
              <img src={logo} alt="Logo" className="h-8 invert dark:invert-0" />
            </figure>
            <span className="text-2xl self-center font-semibold whitespace-nowrap">
              Task Manager
            </span>
          </Link>
        </div>
        <div className="space-x-3 flex items-center justify-center">
          <Button size="icon" variant="ghost" onClick={toggleTheme}>
            {getIcon()}
          </Button>
          <Button onClick={handleLogout}>Log Out</Button>
        </div>
      </div>
    </nav>
  );
};
