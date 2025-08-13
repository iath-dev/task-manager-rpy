import { Suspense } from "react";

import { Outlet } from "react-router-dom";

import { Footer } from "@/components/ui/footer";
import { Loader } from "@/components/ui/loader";
import { Navbar } from "@/components/ui/navbar";
import { Sidebar } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebarStore";

export const AppLayout = () => {
  const { isOpen } = useSidebarStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main
        className={cn(
          "flex-grow container mx-auto px-4 grid grid-cols-1 gap-4",
          isOpen && "lg:grid-cols-5"
        )}
      >
        <Sidebar />
        <div className={cn("col-span-1", isOpen && "lg:col-span-4")}>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};
