import React, { useEffect, useState } from "react";
import { features } from "../../utils/defaultData";
import { Link, useNavigate } from "react-router-dom";
import PageLoader from "../../component/PageLoader";
import toast from "react-hot-toast";
import { axiosInstance, endPoints } from "../../api/axios";
import { motion } from "framer-motion";
import {
  MdSchool, MdCheckCircle, MdPending, MdTrendingUp, MdEmojiEvents,
  MdStar, MdVideoCall, MdArrowForward, MdTimeline, MdBarChart,
  MdPerson, MdCalendarToday,
} from "react-icons/md";
import { FiBook, FiAward } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const StatCard = ({ icon, label, value, color, bg, index }) => (
  <motion.div
    variants={fadeUp}
    custom={index}
    initial="hidden"
    animate="visible"
    whileHover={{ y: -4, scale: 1.02 }}
    className={`${bg} rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all cursor-default`}
  >
    <div className={`w-12 h-12 ${color} bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner`}>
      {icon}
    </div>
    <div>
      <p className="text-white/80 text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="text-white text-2xl font-bold leading-tight">{value}</p>
    </div>
  </motion.div>
);

const ProgressBar = ({ label, value, color, index }) => (
  <motion.div
    variants={fadeUp}
    custom={index}
    initial="hidden"
    animate="visible"
    className="mb-4"
  >
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-bold text-gray-800">{value}%</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" }}
        className={`h-2.5 rounded-full ${color}`}
      />
    </div>
  </motion.div>
);

const UserDashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [Enrollexamtable, setEnrollexamtable] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handelToolsClick = (tool) => {
    navigate(tool.link);
    localStorage.setItem("activeItem", tool.name);
  };

  const getEnroll = async () => {
    try {
      setLoader(true);
      const [examRes, enrollRes] = await Promise.all([
        axiosInstance.get(endPoints.exam.getLatest, { withCredentials: true }),
        axiosInstance.get(endPoints.enrollment.getUserCourses, { withCredentials: true }),
      ]);
      setEnrollexamtable(examRes?.data?.data || []);
      setEnrollments(enrollRes?.data?.data || []);
    } catch {
      toast.error("Error fetching dashboard data.");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getEnroll();
  }, []);

  // Computed stats
  const totalEnrolled = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.theoryExamStatus === "completed").length;
  const pendingCourses = totalEnrolled - completedCourses;
  const completedExams = Enrollexamtable.filter((e) => e.status === "completed").length;
  const passedExams = Enrollexamtable.filter((e) => e.result === "Pass").length;
  const avgScore = completedExams
    ? Math.round(Enrollexamtable.filter((e) => e.status === "completed")
        .reduce((sum, e) => sum + (parseFloat(e.Score) || 0), 0) / completedExams)
    : 0;
  const completionRate = totalEnrolled ? Math.round((completedCourses / totalEnrolled) * 100) : 0;
  const passRate = completedExams ? Math.round((passedExams / completedExams) * 100) : 0;

  const statCards = [
    {
      icon: <MdSchool size={24} className="text-white" />,
      label: "Enrolled Courses",
      value: totalEnrolled,
      bg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      color: "text-white",
    },
    {
      icon: <MdCheckCircle size={24} className="text-white" />,
      label: "Completed",
      value: completedCourses,
      bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      color: "text-white",
    },
    {
      icon: <MdPending size={24} className="text-white" />,
      label: "Pending",
      value: pendingCourses,
      bg: "bg-gradient-to-br from-amber-500 to-orange-500",
      color: "text-white",
    },
    {
      icon: <MdBarChart size={24} className="text-white" />,
      label: "Avg Exam Score",
      value: `${avgScore}%`,
      bg: "bg-gradient-to-br from-purple-500 to-purple-600",
      color: "text-white",
    },
    {
      icon: <FiAward size={22} className="text-white" />,
      label: "Exams Passed",
      value: passedExams,
      bg: "bg-gradient-to-br from-pink-500 to-rose-500",
      color: "text-white",
    },
    {
      icon: <MdStar size={24} className="text-white" />,
      label: "Pass Rate",
      value: `${passRate}%`,
      bg: "bg-gradient-to-br from-cyan-500 to-blue-500",
      color: "text-white",
    },
  ];

  const progressItems = [
    { label: "Course Completion", value: completionRate, color: "bg-indigo-500" },
    { label: "Exam Pass Rate", value: passRate, color: "bg-emerald-500" },
    { label: "Average Score", value: avgScore, color: "bg-purple-500" },
    {
      label: "Theory Exams Done",
      value: completedExams ? Math.min(Math.round((completedExams / Math.max(totalEnrolled, 1)) * 100), 100) : 0,
      color: "bg-amber-500",
    },
  ];

  const filteredEnrollments = Enrollexamtable.filter(
    (item) =>
      item.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.course?.roleId?.roleName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toolColors = [
    "from-indigo-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-purple-500 to-pink-600",
    "from-cyan-500 to-blue-500",
    "from-rose-500 to-pink-600",
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">
              <MdCalendarToday size={14} className="inline mr-1" />
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome back, <span className="text-yellow-300">{currentUser?.first_Name}!</span>
            </h1>
            <p className="text-indigo-200 mt-1 text-sm">
              Continue your learning journey with HireMentor AI Suite
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/user/enroll-course"
              className="flex items-center gap-2 bg-white text-indigo-700 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-colors shadow-md"
            >
              <MdSchool size={18} /> Browse Courses
            </Link>
            <Link
              to="/user/ai-career-coatch"
              className="flex items-center gap-2 bg-white/20 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-white/30 transition-colors"
            >
              <MdTrendingUp size={18} /> AI Coach
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} index={index} />
        ))}
      </div>

      {/* Progress + Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Progress */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <MdTimeline size={18} className="text-indigo-600" />
            </div>
            <h2 className="text-base font-bold text-gray-800">Learning Progress</h2>
          </div>

          {progressItems.map((item, idx) => (
            <ProgressBar key={idx} {...item} index={idx} />
          ))}

          {/* Mini donut chart - SVG based */}
          <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-center">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle
                  cx="18" cy="18" r="14" fill="none"
                  stroke="url(#grad)" strokeWidth="4"
                  strokeDasharray={`${completionRate * 0.88} 88`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{completionRate}%</span>
                <span className="text-xs text-gray-500">Overall</span>
              </div>
            </div>
            <div className="ml-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
                Completed ({completedCourses})
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full bg-gray-200 inline-block"></span>
                Pending ({pendingCourses})
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tools Grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <MdVideoCall size={18} className="text-purple-600" />
            </div>
            <h2 className="text-base font-bold text-gray-800">Quick Access Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((tool, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                custom={index}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handelToolsClick(tool)}
                className={`bg-gradient-to-r ${toolColors[index % toolColors.length]} rounded-xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-all`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <img src={tool.icon} alt={tool.title} className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-white font-semibold text-sm truncate">{tool.title}</p>
                    <p className="text-white/70 text-xs truncate">{tool.description}</p>
                  </div>
                  <MdArrowForward size={16} className="text-white/60 ml-auto flex-shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Exam History Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
              <MdBarChart size={20} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Recent Exam History</h2>
              <p className="text-xs text-gray-500">Track your performance and progress</p>
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search exams..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Course", "Role", "Level", "Status", "Score", "Result", "Action"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loader ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center">
                    <PageLoader />
                  </td>
                </tr>
              ) : filteredEnrollments.length > 0 ? (
                filteredEnrollments.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.04 }}
                    className="hover:bg-indigo-50/40 transition-colors"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-indigo-100 flex-shrink-0">
                          <img
                            src={item?.course?.courseImage || "/assets/default-course.png"}
                            alt={item?.course?.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">
                          {item?.course?.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.course?.roleId?.roleName || "—"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 capitalize">
                        {item?.examLaval || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                        item?.status === "pending"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {item?.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {item.status === "completed" ? (
                        <div className="flex items-center gap-2">
                          <div className="relative w-9 h-9">
                            <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
                              <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                              <circle
                                cx="18" cy="18" r="14" fill="none"
                                stroke={parseFloat(item.Score) >= 70 ? "#10b981" : "#ef4444"}
                                strokeWidth="4"
                                strokeDasharray={`${(parseFloat(item.Score) || 0) * 0.88} 88`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                              {item.Score || 0}
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{item.Score}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        item.result === "Fail" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"
                      }`}>
                        {item.result || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {item?.status === "pending" ? (
                        <span className="text-xs text-gray-400">Pending</span>
                      ) : (
                        <Link
                          to={`/user/enroll-exam-score/${item?._id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          View <MdArrowForward size={14} />
                        </Link>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <FiBook size={28} className="text-indigo-300" />
                      </div>
                      <p className="font-semibold text-gray-600">No exam history yet</p>
                      <p className="text-sm text-gray-400">Enroll in a course and take the exam to see results here</p>
                      <Link
                        to="/user/enroll-course"
                        className="mt-2 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                      >
                        Browse Courses
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;
