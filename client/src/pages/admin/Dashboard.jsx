import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageLoader from "../../component/PageLoader";
import toast from "react-hot-toast";
import { axiosInstance, endPoints, getAssetUrl } from "../../api/axios";
import { motion } from "framer-motion";
import {
  FiUsers, FiBriefcase, FiBook, FiAward,
} from "react-icons/fi";
import {
  MdPeople, MdSchool, MdBarChart, MdTrendingUp, MdStar,
  MdVerified, MdBlock, MdPersonAdd, MdSearch, MdArrowForward,
  MdAdminPanelSettings, MdAnalytics,
} from "react-icons/md";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45 } }),
};

const StatCard = ({ title, value, icon, gradient, sub, path, index }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => path && navigate(path)}
      className={`${gradient} rounded-2xl p-5 text-white shadow-md hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group`}
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-500" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          {path && (
            <MdArrowForward size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
        <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold mt-0.5">{value}</p>
        {sub && <p className="text-white/60 text-xs mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [roleCount, setRoleCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [blockedUsers, setBlockedUsers] = useState(0);
  const [skills, setSkills] = useState([]);
  const [courseInfo, setCourseInfo] = useState([]);
  const [recentRoles, setRecentRoles] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [totalExams, setTotalExams] = useState(0);
  const [passedExams, setPassedExams] = useState(0);
  const [loader, setLoader] = useState(false);
  const [searchCourseTerm, setSearchCourseTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);
        const [rolesRes, coursesRes, usersRes, skillsRes, statsRes] = await Promise.all([
          axiosInstance.get(endPoints.roles.getAll),
          axiosInstance.get(endPoints.courseInfo.getAll),
          axiosInstance.get(endPoints.auth.getAllUsers),
          axiosInstance.get(endPoints.skills.getAll),
          axiosInstance.get(endPoints.auth.adminStats).catch(() => ({ data: {} })),
        ]);

        setRoleCount(rolesRes.data.data?.length || 0);
        setRecentRoles(rolesRes.data.data?.slice(-5) || []);
        setCourseCount(coursesRes.data.count || coursesRes.data.data?.length || 0);
        setCourseInfo(coursesRes.data.data?.slice(-6) || []);
        setUserCount(usersRes.data.count || 0);
        setSkills(skillsRes.data.skills?.slice(-6) || []);

        if (statsRes.data?.data) {
          const s = statsRes.data.data;
          setActiveUsers(s.activeUsers || 0);
          setBlockedUsers(s.blockedUsers || 0);
          setRecentUsers(s.recentUsers || []);
          setTopStudents(s.topStudents || []);
          setTotalExams(s.totalExams || 0);
          setPassedExams(s.passedExams || 0);
        } else {
          setActiveUsers(usersRes.data.count || 0);
        }
      } catch {
        toast.error("Error fetching dashboard data.");
      } finally {
        setLoader(false);
      }
    };
    fetchData();
  }, []);

  const passRate = totalExams ? Math.round((passedExams / totalExams) * 100) : 0;

  const statCards = [
    {
      title: "Total Users",
      value: userCount,
      icon: <MdPeople size={22} className="text-white" />,
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-700",
      path: "/admin/user-management",
      sub: `${activeUsers} active`,
    },
    {
      title: "Total Courses",
      value: courseCount,
      icon: <FiBook size={20} className="text-white" />,
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
      path: "/admin/course-list",
      sub: "Across all roles",
    },
    {
      title: "Active Students",
      value: activeUsers,
      icon: <MdVerified size={22} className="text-white" />,
      gradient: "bg-gradient-to-br from-violet-500 to-purple-700",
      sub: `${blockedUsers} blocked`,
    },
    {
      title: "Total Exams",
      value: totalExams,
      icon: <MdBarChart size={22} className="text-white" />,
      gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
      sub: `${passRate}% pass rate`,
    },
    {
      title: "Exams Passed",
      value: passedExams,
      icon: <MdStar size={22} className="text-white" />,
      gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
      sub: `${totalExams - passedExams} failed`,
    },
    {
      title: "Roles Created",
      value: roleCount,
      icon: <FiBriefcase size={20} className="text-white" />,
      gradient: "bg-gradient-to-br from-cyan-500 to-blue-600",
      path: "/admin/role-management",
    },
    {
      title: "Skills Tracked",
      value: skills.length,
      icon: <FiAward size={20} className="text-white" />,
      gradient: "bg-gradient-to-br from-slate-600 to-slate-800",
      path: "/admin/skill-management",
    },
    {
      title: "Blocked Users",
      value: blockedUsers,
      icon: <MdBlock size={22} className="text-white" />,
      gradient: "bg-gradient-to-br from-red-500 to-red-700",
      path: "/admin/user-management",
    },
  ];

  const getAvatarUrl = (user) => {
    const name = encodeURIComponent(
      (user?.first_Name || "U") + "+" + (user?.last_Name || "")
    );
    if (!user?.profilePhoto?.url) {
      return `https://ui-avatars.com/api/?name=${name}&background=4F46E5&color=fff&size=64&bold=true`;
    }
    const url = user.profilePhoto.url;
    return getAssetUrl(url);
  };

  const filteredCourses = courseInfo.filter((c) =>
    (c.title || "").toLowerCase().includes(searchCourseTerm.toLowerCase())
  );

  const filteredRecentUsers = recentUsers.filter(
    (u) =>
      (u.first_Name + " " + u.last_Name).toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MdAdminPanelSettings size={28} className="text-indigo-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Monitor and manage your platform</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/user-management"
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md"
          >
            <MdPeople size={18} /> Manage Users
          </Link>
          <Link
            to="/admin/course-list"
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FiBook size={16} /> Courses
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} index={i} />
        ))}
      </div>

      {/* Exam Performance Bar */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
            <MdAnalytics size={18} className="text-indigo-600" />
          </div>
          <h2 className="font-bold text-gray-800">Exam Performance Overview</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Pass Rate", value: passRate, color: "bg-emerald-500", textColor: "text-emerald-600" },
            { label: "Fail Rate", value: 100 - passRate, color: "bg-red-400", textColor: "text-red-600" },
            { label: "Completion", value: Math.min(passRate + 10, 100), color: "bg-indigo-500", textColor: "text-indigo-600" },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-600">{item.label}</span>
                <span className={`text-sm font-bold ${item.textColor}`}>{item.value}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, delay: i * 0.2 + 0.5 }}
                  className={`h-full rounded-full ${item.color}`}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{item.label === "Pass Rate" ? `${passedExams} passed` : item.label === "Fail Rate" ? `${totalExams - passedExams} failed` : `${totalExams} total`}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Two columns: Recent Users + Top Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <MdPersonAdd size={18} className="text-indigo-600" />
              </div>
              <h2 className="font-bold text-gray-800">Recent Users</h2>
            </div>
            <Link to="/admin/user-management" className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1">
              View All <MdArrowForward size={14} />
            </Link>
          </div>
          <div className="p-3">
            <div className="relative mb-3">
              <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition-all"
              />
            </div>
            {loader ? (
              <div className="py-8 flex justify-center"><PageLoader /></div>
            ) : filteredRecentUsers.length > 0 ? (
              <ul className="space-y-1">
                {filteredRecentUsers.slice(0, 5).map((user, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <img
                      src={getAvatarUrl(user)}
                      alt={user.first_Name}
                      className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          (user.first_Name || "U") + "+" + (user.last_Name || "")
                        )}&background=4F46E5&color=fff&size=64&bold=true`;
                      }}
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.first_Name} {user.last_Name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        user.isBlocked ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                      <Link
                        to={`/admin/student/${user._id}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        <MdArrowForward size={14} />
                      </Link>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-400 py-8 text-sm">No users found</p>
            )}
          </div>
        </motion.div>

        {/* Top Students */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <MdStar size={18} className="text-amber-500" />
            </div>
            <h2 className="font-bold text-gray-800">Top Performing Students</h2>
          </div>
          <div className="p-4">
            {loader ? (
              <div className="py-8 flex justify-center"><PageLoader /></div>
            ) : topStudents.length > 0 ? (
              <ul className="space-y-2">
                {topStudents.map((student, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    {/* Rank */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      i === 0 ? "bg-yellow-400 text-yellow-900"
                        : i === 1 ? "bg-gray-300 text-gray-700"
                        : i === 2 ? "bg-amber-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {i + 1}
                    </div>
                    <img
                      src={getAvatarUrl(student.userInfo)}
                      alt={student.userInfo?.first_Name}
                      className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          (student.userInfo?.first_Name || "U") + "+" + (student.userInfo?.last_Name || "")
                        )}&background=4F46E5&color=fff&size=64&bold=true`;
                      }}
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {student.userInfo?.first_Name} {student.userInfo?.last_Name}
                      </p>
                      <p className="text-xs text-gray-400">{student.examCount} exams</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-indigo-600">{Math.round(student.avgScore || 0)}%</p>
                      <p className="text-xs text-gray-400">avg score</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center">
                <MdStar size={32} className="text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No exam data yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Courses Table */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <FiBook size={16} className="text-emerald-600" />
            </div>
            <h2 className="font-bold text-gray-800">Recent Courses</h2>
          </div>
          <div className="relative w-full sm:w-64">
            <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchCourseTerm}
              onChange={(e) => setSearchCourseTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Course Title", "Type", "Related Role", ""].map((h, i) => (
                  <th key={i} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loader ? (
                <tr><td colSpan="4" className="py-8 text-center"><PageLoader /></td></tr>
              ) : filteredCourses.length > 0 ? (
                filteredCourses.map((course, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-indigo-50/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-800">{course.title}</p>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500">
                      {course.courseId?.courseType || "—"}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700">
                        {course.roleId?.roleName || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <Link
                        to="/admin/course-info"
                        className="text-xs text-indigo-600 font-medium hover:text-indigo-800"
                      >
                        View
                      </Link>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-400 text-sm">No courses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bottom: Roles + Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Roles */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <FiBriefcase size={16} className="text-blue-600" />
              </div>
              <h2 className="font-bold text-gray-800">Recent Roles</h2>
            </div>
            <Link to="/admin/role-management" className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1">
              Manage <MdArrowForward size={14} />
            </Link>
          </div>
          <div className="p-4">
            {recentRoles.length > 0 ? (
              <ul className="space-y-1.5">
                {recentRoles.map((role, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FiBriefcase size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold text-gray-800">{role.roleName}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(role.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-400 py-6 text-sm">No roles yet</p>
            )}
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <FiAward size={16} className="text-emerald-600" />
              </div>
              <h2 className="font-bold text-gray-800">Tracked Skills</h2>
            </div>
            <Link to="/admin/skill-management" className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1">
              Manage <MdArrowForward size={14} />
            </Link>
          </div>
          <div className="p-5">
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => {
                  const tagColors = [
                    "bg-indigo-50 text-indigo-700 border-indigo-100",
                    "bg-emerald-50 text-emerald-700 border-emerald-100",
                    "bg-amber-50 text-amber-700 border-amber-100",
                    "bg-purple-50 text-purple-700 border-purple-100",
                    "bg-pink-50 text-pink-700 border-pink-100",
                    "bg-cyan-50 text-cyan-700 border-cyan-100",
                  ];
                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border ${tagColors[i % tagColors.length]}`}
                    >
                      {skill.title}
                    </motion.span>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-6 text-sm">No skills tracked yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
