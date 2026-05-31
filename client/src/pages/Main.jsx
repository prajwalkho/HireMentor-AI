import React, { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../component/Navbar";

const Main = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile overlay
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop mini mode
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleMenuToggle = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const isEditProfilePage =
    location.pathname.includes("edit-profile") ||
    location.pathname.includes("update-profile");

  const sidebarWidth = isCollapsed ? "lg:ml-[72px]" : "lg:ml-72";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isCollapsed={isCollapsed}
      />

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarWidth}`}>
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-50">
          <Navbar
            onMenuToggle={handleMenuToggle}
            isSidebarCollapsed={isCollapsed}
          />
        </div>

        {/* Page content */}
        <main className={`flex-1 ${!isEditProfilePage ? "p-4 sm:p-6" : "p-0"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Main;
