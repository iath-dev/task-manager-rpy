import { useEffect } from "react";

import { X } from "lucide-react";
import { NavLink, useLoaderData } from "react-router-dom";

import { Button, buttonVariants } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { User } from "@/interfaces/user";
import { ADMIN_NAV_LINK, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebarStore";

export function Sidebar() {
  const { isOpen, setIsOpen } = useSidebarStore();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const userData = useLoaderData<User>();

  useEffect(() => {
    setIsOpen(isDesktop);
  }, [isDesktop, setIsOpen]);

  if (!isDesktop && !isOpen) {
    return null;
  }

  return (
    <aside
      className={cn(
        "w-full lg:max-w-64 bg-background p-4 shadow-lg transition-transform duration-300",
        !isDesktop
          ? "fixed inset-y-0 left-0 z-40 translate-x-0"
          : "static shadow-none",
        !isOpen && !isDesktop && "-translate-x-full" // animación para ocultar en mobile
      )}
    >
      <div className="h-16 flex lg:hidden justify-end">
        <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)}>
          <X />
        </Button>
      </div>
      <nav className="flex flex-col space-y-2">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: isActive ? "default" : "ghost" }),
                "justify-start"
              )
            }
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.title}
          </NavLink>
        ))}

        {userData?.role === ADMIN_NAV_LINK.role && (
          <NavLink
            to={ADMIN_NAV_LINK.path}
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: isActive ? "default" : "ghost" }),
                "justify-start"
              )
            }
          >
            <ADMIN_NAV_LINK.icon className="mr-2 h-4 w-4" />
            {ADMIN_NAV_LINK.title}
          </NavLink>
        )}
      </nav>
    </aside>
  );
}
