import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { adminrole, sidebarItems } from "../sidebar/sidebardata";
import { MdClose, MdChevronRight, MdExpandMore } from "react-icons/md";

const BASE_URL = "http://localhost:9000";

export default function Sidebar({ isSidebarOpen, toggleSidebar, isCollapsed }) {
  const [activeItem, setActiveItem] = useState(null);
  const [openSubItems, setOpenSubItems] = useState({});
  const [sidebarData, setSidebarData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSidebarData, setFilteredSidebarData] = useState([]);
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleItemClick = (item) => {
    setActiveItem(item.name);
    if (item.subMenu) {
      setOpenSubItems((prev) => ({ ...prev, [item.name]: !prev[item.name] }));
    } else {
      setOpenSubItems({});
      if (isSidebarOpen) toggleSidebar();
    }
    localStorage.setItem("activeItem", item.name);
  };

  useEffect(() => {
    const storedActiveItem = localStorage.getItem("activeItem");
    if (storedActiveItem) {
      setActiveItem(storedActiveItem);
      const sidebarItem = sidebarData.find((item) => item.name === storedActiveItem);
      if (sidebarItem?.subMenu) {
        setOpenSubItems({ [sidebarItem.name]: true });
      }
    }
    if (location.pathname.includes("admin")) {
      setSidebarData(adminrole);
    } else if (location.pathname.includes("user")) {
      setSidebarData(sidebarItems);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredSidebarData(sidebarData);
    } else {
      const filtered = sidebarData
        .map((item) => {
          const matchesItem = item.name.toLowerCase().includes(searchTerm.toLowerCase());
          const filteredSubMenu = item.subMenu
            ? item.subMenu.filter((sub) =>
                sub.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : [];
          return {
            ...item,
            subMenu: filteredSubMenu.length > 0 || matchesItem ? filteredSubMenu : undefined,
          };
        })
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.subMenu && item.subMenu.length > 0)
        );
      setFilteredSidebarData(filtered);
    }
  }, [searchTerm, sidebarData]);

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
    if (photoPath.startsWith("http")) return photoPath;
    return `${BASE_URL}/${photoPath.replace(/\\/g, "/")}`;
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998] lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          shadow-2xl z-[9999] transition-all duration-300 ease-in-out flex flex-col overflow-hidden
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${isCollapsed ? "lg:w-[72px]" : "lg:w-72"}
          w-72
        `}
      >
        {/* Header */}
        <div
          className={`flex items-center h-16 border-b border-slate-700/50 flex-shrink-0 ${
            isCollapsed ? "lg:justify-center px-4" : "px-5 gap-3"
          }`}
        >
          {/* Logo icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Title */}
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-white font-bold text-base leading-tight whitespace-nowrap">
               HireMentor AI
              </h1>
              <p className="text-slate-400 text-xs whitespace-nowrap">Learning Suite</p>
            </div>
          )}

          {/* Mobile close button */}
          <button
            onClick={toggleSidebar}
            className="ml-auto lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* User Profile Section */}
        <div
          className={`border-b border-slate-700/50 flex-shrink-0 transition-all duration-300 ${
            isCollapsed ? "lg:py-4 lg:px-2 py-5 px-5" : "py-5 px-5"
          }`}
        >
          {isCollapsed ? (
            /* Mini mode: just avatar */
            <div className="hidden lg:flex justify-center">
              <Link to={`/${currentUser?.role}/update-profile`}>
                <img
                  src={getProfileImageUrl()}
                  alt="Profile"
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/50 hover:ring-indigo-400 transition-all"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      (currentUser?.first_Name || "U") + "+" + (currentUser?.last_Name || "")
                    )}&background=4F46E5&color=fff&size=128&bold=true`;
                  }}
                />
              </Link>
            </div>
          ) : null}

          {/* Full mode profile */}
          <div className={`flex items-center gap-3 ${isCollapsed ? "lg:hidden" : ""}`}>
            <div className="relative flex-shrink-0">
              <img
                src={getProfileImageUrl()}
                alt="Profile"
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/50"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    (currentUser?.first_Name || "U") + "+" + (currentUser?.last_Name || "")
                  )}&background=4F46E5&color=fff&size=128&bold=true`;
                }}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-slate-800"></span>
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-semibold truncate leading-tight">
                {currentUser?.first_Name} {currentUser?.last_Name}
              </p>
              <span className="inline-block px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 rounded-full capitalize mt-0.5">
                {currentUser?.role}
              </span>
            </div>
            <Link
              to={`/${currentUser?.role}/update-profile`}
              className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex-shrink-0"
              title="Edit Profile"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Search - only in full mode */}
        {!isCollapsed && (
          <div className="px-4 py-3 flex-shrink-0">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search menu..."
                className="w-full bg-slate-700/50 border border-slate-600/50 text-slate-200 placeholder-slate-500 text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-700">
          {/* Section label */}
          {!isCollapsed && (
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-2 py-2">
              Navigation
            </p>
          )}

          {filteredSidebarData.map((item) => {
            const isActive =
              activeItem === item.name ||
              (item.path &&
                (location.pathname === item.path ||
                  location.pathname.endsWith("/" + item.path)));

            return (
              <div key={item.id}>
                <NavLink
                  to={item.path || "#"}
                  onClick={() => handleItemClick(item)}
                  title={isCollapsed ? item.name : undefined}
                  className={`
                    group flex items-center rounded-xl transition-all duration-200 relative
                    ${isCollapsed ? "lg:justify-center lg:px-0 lg:py-3 px-3 py-3" : "px-3 py-2.5"}
                    ${isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                      : "text-slate-400 hover:bg-slate-700/60 hover:text-slate-100"
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/50 rounded-r-full"></span>
                  )}

                  {/* Icon */}
                  {item.icon && (
                    <span className={`flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`}>
                      {item.icon}
                    </span>
                  )}

                  {/* Label + chevron */}
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 font-medium text-sm truncate">{item.name}</span>
                      {item.subMenu && (
                        <MdExpandMore
                          size={18}
                          className={`transition-transform duration-200 ${
                            openSubItems[item.name] ? "rotate-180" : ""
                          } ${isActive ? "text-white/70" : "text-slate-500"}`}
                        />
                      )}
                    </>
                  )}

                  {/* Tooltip in collapsed mode */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-slate-700">
                      {item.name}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
                    </div>
                  )}
                </NavLink>

                {/* Submenu */}
                {item.subMenu && !isCollapsed && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openSubItems[item.name] ? "max-h-64 mt-0.5" : "max-h-0"
                    }`}
                  >
                    <div className="ml-4 pl-3 border-l border-slate-700/50 space-y-0.5 py-1">
                      {item.subMenu.map((subItem) => (
                        <NavLink
                          key={subItem.id}
                          to={subItem.path}
                          onClick={() => {
                            setActiveItem(subItem.name);
                            localStorage.setItem("activeItem", subItem.name);
                            if (isSidebarOpen) toggleSidebar();
                          }}
                          className={({ isActive: subActive }) =>
                            `flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                              subActive
                                ? "bg-indigo-500/20 text-indigo-300 font-medium"
                                : "text-slate-400 hover:bg-slate-700/40 hover:text-slate-200"
                            }`
                          }
                        >
                          {subItem.icon && <span className="flex-shrink-0">{subItem.icon}</span>}
                          <span>{subItem.name}</span>
                          <MdChevronRight size={14} className="ml-auto opacity-40" />
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`border-t border-slate-700/50 p-3 flex-shrink-0 ${isCollapsed ? "lg:flex lg:justify-center" : ""}`}>
          {isCollapsed ? (
            <div className="hidden lg:flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
                <span className="text-slate-400 text-xs font-bold">AI</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-400 text-xs font-bold">AI</span>
              </div>
              <div>
                <p className="text-slate-400 text-xs leading-tight">  HireMentor AI Suite</p>
                <p className="text-slate-600 text-xs">v2.0 · BCA  2026</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
