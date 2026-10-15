import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance, endPoints, getAssetUrl } from "../api/axios";
import { MdMenu, MdClose, MdNotifications, MdLogout, MdPerson, MdSettings, MdKeyboardArrowDown } from "react-icons/md";

const Navbar = ({ onMenuToggle, isSidebarCollapsed }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    try {
      await axiosInstance.get(endPoints.auth.logout);
      toast.success("Logged out successfully.");
      navigate("/");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  const getProfileImageUrl = () => {
    if (!currentUser?.profilePhoto) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        (currentUser?.first_Name || "U") + "+" + (currentUser?.last_Name || "")
      )}&background=4F46E5&color=fff&size=128&bold=true`;
    }
    const photoPath =
      typeof currentUser.profilePhoto === "object"
        ? currentUser.profilePhoto.url
        : currentUser.profilePhoto;
    if (!photoPath) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        (currentUser?.first_Name || "U") + "+" + (currentUser?.last_Name || "")
      )}&background=4F46E5&color=fff&size=128&bold=true`;
    }
    return getAssetUrl(photoPath);
  };

  // Breadcrumb generation
  const getBreadcrumbs = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts.map((part, idx) => ({
      label: part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      path: "/" + parts.slice(0, idx + 1).join("/"),
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-4 w-full z-50">
      {/* Left: Hamburger + Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Hamburger toggle */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          aria-label="Toggle sidebar"
        >
          {isSidebarCollapsed ? (
            <MdMenu size={22} />
          ) : (
            <MdMenu size={22} />
          )}
        </button>

        {/* Breadcrumbs - hidden on small screens */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <span className="text-gray-400">Home</span>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span className="text-gray-300 mx-1">/</span>
              <span
                className={
                  idx === breadcrumbs.length - 1
                    ? "text-indigo-600 font-semibold capitalize"
                    : "text-gray-500 capitalize hover:text-indigo-500 cursor-pointer"
                }
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Actions + Profile */}
      <div className="flex items-center gap-2">
        {/* App title - mobile only */}
        <span className="md:hidden text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
         HireMentor AI
        </span>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-indigo-600 transition-all duration-200 focus:outline-none">
          <MdNotifications size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-indigo-50 transition-all duration-200 focus:outline-none group"
          >
            <img
              src={getProfileImageUrl()}
              alt="profile"
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-100 group-hover:ring-indigo-300 transition-all"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  (currentUser?.first_Name || "U") + "+" + (currentUser?.last_Name || "")
                )}&background=4F46E5&color=fff&size=128&bold=true`;
              }}
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-gray-800 leading-tight">
                {currentUser?.first_Name} {currentUser?.last_Name}
              </p>
              <p className="text-xs text-indigo-500 capitalize leading-tight">
                {currentUser?.role}
              </p>
            </div>
            <MdKeyboardArrowDown
              size={16}
              className={`text-gray-400 hidden sm:block transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2">
              {/* User Info */}
              <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">
                  {currentUser?.first_Name} {currentUser?.last_Name}
                </p>
                <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full capitalize font-medium">
                  {currentUser?.role}
                </span>
              </div>

              {/* Links */}
              <div className="py-1">
                <Link
                  to={`/${currentUser?.role}/edit-profile`}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <MdPerson size={18} className="text-indigo-400" />
                  Edit Profile
                </Link>
                <Link
                  to={`/${currentUser?.role}/update-profile`}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <MdSettings size={18} className="text-indigo-400" />
                  Settings
                </Link>
              </div>

              {/* Logout */}
              <div className="py-1 border-t border-gray-100">
                <button
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <MdLogout size={18} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
