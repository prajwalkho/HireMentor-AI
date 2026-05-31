import {
  MdDashboard,
  MdPeople,
  MdSettings,
  MdSchool,
  MdWorkHistory,
  MdVideoCall,
  MdPsychology,
  MdCode,
  MdHistory,
  MdSmartToy,
  MdDescription,
  MdManageAccounts,
  MdPlaylistAddCheck,
  MdLibraryBooks,
  MdAdminPanelSettings,
  MdAnalytics,
  MdEmojiEvents,
} from "react-icons/md";
import {
  FiUsers,
  FiBriefcase,
  FiBook,
  FiAward,
  FiList,
  FiInfo,
} from "react-icons/fi";

export const sidebarItems = [
  { id: 1, name: "Dashboard", path: "/user", icon: <MdDashboard size={20} /> },
  { id: 2, name: "Resume Builder", path: "resume-builder", icon: <MdDescription size={20} /> },
  { id: 3, name: "Enroll Course", path: "enroll-course", icon: <MdSchool size={20} /> },
  { id: 4, name: "Course History", path: "enroll-course-history", icon: <MdHistory size={20} /> },
  { id: 5, name: "Live Interview", path: "live-interview", icon: <MdVideoCall size={20} /> },
  { id: 6, name: "AI Coach", path: "ai-career-coatch", icon: <MdPsychology size={20} /> },
  { id: 7, name: "Mock Exam", path: "practical-exam", icon: <MdCode size={20} /> },
  { id: 8, name: "Talk with AI",    path: "talk-with-ai",   icon: <MdSmartToy    size={20} /> },
  { id: 9, name: "Certificates",    path: "certificates",   icon: <MdEmojiEvents size={20} /> },
];

export const adminrole = [
  { id: 1, name: "Dashboard", path: "/admin", icon: <MdDashboard size={20} /> },
  { id: 2, name: "User Management", path: "user-management", icon: <MdManageAccounts size={20} /> },
  {
    id: 3,
    name: "Course Management",
    icon: <FiBook size={20} />,
    subMenu: [
      { id: 31, name: "Course List", path: "course-list", icon: <FiList size={16} /> },
      { id: 32, name: "Course Information", path: "course-info", icon: <FiInfo size={16} /> },
    ],
  },
  { id: 4, name: "Role Management", path: "role-management", icon: <FiBriefcase size={20} /> },
  { id: 5, name: "Skill Management", path: "skill-management", icon: <FiAward size={20} /> },
  { id: 6, name: "Analytics", path: "analytics", icon: <MdAnalytics size={20} /> },
];
