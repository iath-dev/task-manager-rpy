import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Sidebar } from "@/components/ui/sidebar";
import { Loader } from "@/components/ui/loader";
import { Suspense } from "react";
import { useSidebarStore } from "@/store/sidebarStore";
import { cn } from "@/lib/utils";

export const AppLayout = () => {
  const { isOpen } = useSidebarStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main
        className={cn(
          "flex-grow container mx-auto grid grid-cols-1 gap-4",
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
    </div>
  );
};
