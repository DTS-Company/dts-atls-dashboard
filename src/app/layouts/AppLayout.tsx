import { Outlet } from "react-router";
import { AppHeader } from "@widgets/header";
import { AppSidebar, Backdrop } from "@widgets/sidebar";
import { SidebarProvider, useSidebar } from "@shared/lib/sidebar/SidebarContext";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex bg-gray-50 dark:bg-gray-900">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`relative flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-screen-2xl md:px-7 md:py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
