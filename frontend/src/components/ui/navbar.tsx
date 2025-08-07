import { Moon, Sun, SunMoon } from "lucide-react"; // Assuming lucide-react is installed
import { Link } from "react-router";

import { useTheme } from "@/hooks/useTheme";
import { Button } from "./button";
import logo from "@/assets/logo.svg";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
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
        <div className="space-x-3 flex items-center justify-center">
          <Button size="icon" variant="ghost" onClick={toggleTheme}>
            {getIcon()}
          </Button>
          <Button>Log Out</Button>
        </div>
      </div>
    </nav>
  );
};
