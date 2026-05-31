import React, { useEffect, useState } from "react";
import { axiosInstance, endPoints } from "../../api/axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import PageLoader from "../../component/PageLoader";
import {
  MdAnalytics, MdPeople, MdSchool, MdBarChart, MdTrendingUp,
  MdVerified, MdBlock, MdStar, MdEmojiEvents, MdCalendarToday,
} from "react-icons/md";
import { FiBook, FiAward } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

// Simple animated bar chart component (no external chart lib needed)
const BarChart = ({ data, colorClass = "bg-indigo-500", label }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      {label && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{label}</p>}
      <div className="flex items-end gap-2 h-32">
        {data.map((item, i) => (
          <div key={i} className="flex flex-col items-center flex-1 h-full justify-end gap-1">
            <span className="text-xs font-bold text-gray-700">{item.value}</span>
            <div className="w-full rounded-t-lg overflow-hidden" style={{ height: "80px" }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / max) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
                className={`w-full ${colorClass} rounded-t-lg`}
              />
            </div>
            <span className="text-xs text-gray-400 truncate w-full text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Donut ring chart
const DonutChart = ({ value, max = 100, size = 100, color = "#6366f1", label, sub }) => {
  const pct = Math.min(Math.round((value / Math.max(max, 1)) * 100), 100);
  const r = 14;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 36 36" style={{ width: size, height: size, transform: "rotate(-90deg)" }}>
          <circle cx="18" cy="18" r={r} fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
          <motion.circle
            cx="18" cy="18" r={r} fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${dash} ${circ}` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-gray-800">{pct}%</span>
        </div>
      </div>
      {label && <p className="text-sm font-semibold text-gray-700">{label}</p>}
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
};

const StatTile = ({ icon, label, value, color, index }) => (
  <motion.div
    variants={fadeUp} custom={index} initial="hidden" animate="visible"
    className={`${color} rounded-2xl p-5 text-white shadow-md flex items-center gap-4`}
  >
    <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">{icon}</div>
    <div>
      <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </motion.div>
);

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoader(true);
        const [statsRes, usersRes, coursesRes] = await Promise.all([
          axiosInstance.get(endPoints.auth.adminStats).catch(() => ({ data: {} })),
          axiosInstance.get(endPoints.auth.getAllUsers),
          axiosInstance.get(endPoints.courseInfo.getAll),
        ]);
        setStats(statsRes.data?.data || {});
        setUsers(usersRes.data?.data || []);
        setCourses(coursesRes.data?.data || []);
      } catch {
        toast.error("Failed to load analytics.");
      } finally {
        setLoader(false);
      }
    };
    load();
  }, []);

  if (loader) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <PageLoader />
      </div>
    );
  }

  const totalUsers   = stats?.totalUsers   || users.length;
  const activeUsers  = stats?.activeUsers  || users.filter((u) => !u.isBlocked).length;
  const blockedUsers = stats?.blockedUsers || users.filter((u) => u.isBlocked).length;
  const totalExams   = stats?.totalExams   || 0;
  const passedExams  = stats?.passedExams  || 0;
  const failedExams  = stats?.failedExams  || 0;
  const passRate     = totalExams ? Math.round((passedExams / totalExams) * 100) : 0;
  const failRate     = 100 - passRate;
  const totalCourses = courses.length;

  // Gender distribution from users
  const maleCount   = users.filter((u) => u.gender === "male").length;
  const femaleCount = users.filter((u) => u.gender === "female").length;
  const otherCount  = users.filter((u) => u.gender === "other" || !u.gender).length;

  // Monthly registrations (last 6 months)
  const now = new Date();
  const monthLabels = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return d.toLocaleString("default", { month: "short" });
  });
  const monthCounts = monthLabels.map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return users.filter((u) => {
      const created = new Date(u.createdAt);
      return created.getFullYear() === d.getFullYear() && created.getMonth() === d.getMonth();
    }).length;
  });

  // Top students
  const topStudents = stats?.topStudents || [];

  // Role distribution in enrolled courses
  const roleCourseCounts = courses.reduce((acc, c) => {
    const role = c.roleId?.roleName || "Other";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});
  const roleChartData = Object.entries(roleCourseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([label, value]) => ({ label: label.replace(" Developer", "").replace(" Engineer", ""), value }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MdAnalytics size={28} className="text-indigo-600" /> Platform Analytics
        </h1>
        <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1">
          <MdCalendarToday size={14} />
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </motion.div>

      {/* Top stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatTile icon={<MdPeople size={22} className="text-white" />}    label="Total Users"    value={totalUsers}   color="bg-gradient-to-br from-indigo-500 to-indigo-700"   index={0} />
        <StatTile icon={<MdVerified size={22} className="text-white" />}  label="Active Users"   value={activeUsers}  color="bg-gradient-to-br from-emerald-500 to-teal-600"    index={1} />
        <StatTile icon={<MdBlock size={22} className="text-white" />}     label="Blocked Users"  value={blockedUsers} color="bg-gradient-to-br from-red-500 to-rose-600"         index={2} />
        <StatTile icon={<FiBook size={20} className="text-white" />}      label="Course Modules" value={totalCourses} color="bg-gradient-to-br from-violet-500 to-purple-700"   index={3} />
        <StatTile icon={<MdBarChart size={22} className="text-white" />}  label="Total Exams"    value={totalExams}   color="bg-gradient-to-br from-amber-500 to-orange-600"     index={4} />
        <StatTile icon={<MdEmojiEvents size={22} className="text-white" />} label="Exams Passed" value={passedExams}  color="bg-gradient-to-br from-teal-500 to-cyan-600"       index={5} />
        <StatTile icon={<MdTrendingUp size={22} className="text-white" />} label="Exams Failed"  value={failedExams}  color="bg-gradient-to-br from-pink-500 to-rose-600"        index={6} />
        <StatTile icon={<MdStar size={22} className="text-white" />}      label="Pass Rate"      value={`${passRate}%`} color="bg-gradient-to-br from-slate-600 to-slate-800" index={7} />
      </div>

      {/* Donut charts row */}
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible"
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
            <MdBarChart size={16} className="text-indigo-600" />
          </div>
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
          <DonutChart value={passedExams} max={totalExams} color="#10b981" label="Pass Rate" sub={`${passedExams} / ${totalExams} exams`} />
          <DonutChart value={activeUsers} max={totalUsers} color="#6366f1" label="Active Users" sub={`${activeUsers} / ${totalUsers} users`} />
          <DonutChart
            value={users.filter((u) => u.lastLogin && new Date(u.lastLogin) > new Date(Date.now() - 7 * 864e5)).length}
            max={totalUsers} color="#f59e0b" label="Weekly Logins"
            sub="logged in last 7d"
          />
          <DonutChart value={totalCourses} max={Math.max(totalCourses, 20)} color="#a855f7" label="Course Coverage" sub={`${totalCourses} modules`} />
        </div>
      </motion.div>

      {/* Bar charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly registrations */}
        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <MdPeople size={16} className="text-emerald-600" />
            </div>
            User Registrations (Last 6 Months)
          </h2>
          <BarChart
            data={monthLabels.map((label, i) => ({ label, value: monthCounts[i] }))}
            colorClass="bg-indigo-400"
          />
        </motion.div>

        {/* Courses by role */}
        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
              <FiBook size={14} className="text-purple-600" />
            </div>
            Courses by Role
          </h2>
          {roleChartData.length > 0 ? (
            <BarChart data={roleChartData} colorClass="bg-purple-400" />
          ) : (
            <p className="text-gray-400 text-sm text-center py-10">No course data available</p>
          )}
        </motion.div>
      </div>

      {/* Exam result breakdown + Gender split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exam breakdown */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
              <FiAward size={14} className="text-amber-600" />
            </div>
            Exam Results Breakdown
          </h2>
          <div className="space-y-4">
            {[
              { label: "Passed Exams",  value: passedExams, total: totalExams, color: "bg-emerald-500", text: "text-emerald-600" },
              { label: "Failed Exams",  value: failedExams, total: totalExams, color: "bg-red-400",    text: "text-red-600" },
              { label: "Pass Rate",     value: passRate,    total: 100,        color: "bg-indigo-500", text: "text-indigo-600", suffix: "%" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-600">{item.label}</span>
                  <span className={`text-sm font-bold ${item.text}`}>
                    {item.value}{item.suffix || ""}{!item.suffix && ` / ${item.total}`}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.total ? (item.value / item.total) * 100 : 0}%` }}
                    transition={{ duration: 1, delay: i * 0.15 + 0.4 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pass/Fail visual */}
          {totalExams > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Pass vs Fail Distribution</p>
              <div className="flex h-8 rounded-xl overflow-hidden gap-0.5">
                <motion.div
                  initial={{ flex: 0 }}
                  animate={{ flex: passedExams }}
                  transition={{ duration: 1 }}
                  className="bg-emerald-500 flex items-center justify-center text-white text-xs font-semibold"
                >
                  {passRate > 15 && `${passRate}%`}
                </motion.div>
                <motion.div
                  initial={{ flex: 0 }}
                  animate={{ flex: failedExams }}
                  transition={{ duration: 1 }}
                  className="bg-red-400 flex items-center justify-center text-white text-xs font-semibold"
                >
                  {failRate > 15 && `${failRate}%`}
                </motion.div>
              </div>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Passed ({passedExams})
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> Failed ({failedExams})
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Gender + User status split */}
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          {/* Gender */}
          <div>
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-7 h-7 bg-pink-50 rounded-lg flex items-center justify-center">
                <MdPeople size={14} className="text-pink-600" />
              </div>
              Gender Distribution
            </h2>
            <div className="flex items-end gap-6">
              <div className="flex-1 space-y-2.5">
                {[
                  { label: "Male",   value: maleCount,   color: "bg-blue-400",  text: "text-blue-600" },
                  { label: "Female", value: femaleCount,  color: "bg-pink-400",  text: "text-pink-600" },
                  { label: "Other",  value: otherCount,   color: "bg-gray-300",  text: "text-gray-500" },
                ].map((g, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">{g.label}</span>
                      <span className={`text-sm font-bold ${g.text}`}>{g.value}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: totalUsers ? `${(g.value / totalUsers) * 100}%` : "0%" }}
                        transition={{ duration: 0.9, delay: i * 0.12 + 0.3 }}
                        className={`h-full rounded-full ${g.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active vs Blocked */}
          <div className="pt-5 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Active vs Blocked Users</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                <MdVerified size={24} className="text-emerald-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-emerald-700">{activeUsers}</p>
                <p className="text-xs text-emerald-600 font-medium">Active</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                <MdBlock size={24} className="text-red-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-600">{blockedUsers}</p>
                <p className="text-xs text-red-500 font-medium">Blocked</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Students leaderboard */}
      {topStudents.length > 0 && (
        <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <MdStar size={18} className="text-amber-500" />
            </div>
            <h2 className="font-bold text-gray-800">Top Performing Students</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topStudents.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === 0 ? "bg-yellow-400 text-yellow-900"
                      : i === 1 ? "bg-gray-300 text-gray-700"
                      : i === 2 ? "bg-amber-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {s.userInfo?.first_Name} {s.userInfo?.last_Name}
                    </p>
                    <p className="text-xs text-gray-400">{s.examCount} exams taken</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-indigo-600">{Math.round(s.avgScore || 0)}%</p>
                    <p className="text-xs text-gray-400">avg</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Users summary table */}
      {stats?.recentUsers?.length > 0 && (
        <motion.div variants={fadeUp} custom={8} initial="hidden" animate="visible"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
                <MdPeople size={14} className="text-indigo-600" />
              </div>
              Recently Joined Users
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Name", "Email", "Gender", "Joined", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentUsers.map((u, i) => (
                  <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">
                      {u.first_Name} {u.last_Name}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">{u.email}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap capitalize">{u.gender || "—"}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
                        u.isBlocked ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isBlocked ? "bg-red-500" : "bg-emerald-500"}`} />
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;
