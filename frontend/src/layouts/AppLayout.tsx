import { Outlet } from "react-router-dom";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
