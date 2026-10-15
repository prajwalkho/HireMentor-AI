import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosInstance, endPoints, getAssetUrl } from "../../api/axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import PageLoader from "../../component/PageLoader";
import {
  MdArrowBack, MdPerson, MdEmail, MdCalendarToday, MdSchool,
  MdCheckCircle, MdPending, MdBarChart, MdStar, MdLogin,
  MdBlock, MdVerified, MdDevices, MdAssignment, MdEmojiEvents,
  MdTrendingUp, MdCake,
} from "react-icons/md";
import { FiBook, FiAward } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-indigo-600">{icon}</span>
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-semibold text-gray-800 mt-0.5">{value || "—"}</p>
    </div>
  </div>
);

const MiniStatCard = ({ label, value, color, icon }) => (
  <div className={`${color} rounded-xl p-4 text-white`}>
    <div className="flex items-center gap-2 mb-1">
      <span className="text-white/80">{icon}</span>
      <span className="text-white/70 text-xs font-medium">{label}</span>
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blockLoading, setBlockLoading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(endPoints.auth.adminGetUser(id));
        setData(res.data?.data);
      } catch {
        toast.error("Failed to load student details.");
        navigate("/admin/user-management");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleToggleBlock = async () => {
    setBlockLoading(true);
    try {
      const res = await axiosInstance.put(endPoints.auth.adminBlockUser(id));
      toast.success(res.data.message);
      setData((prev) => ({
        ...prev,
        user: { ...prev.user, isBlocked: res.data.isBlocked },
      }));
    } catch {
      toast.error("Action failed.");
    } finally {
      setBlockLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <PageLoader />
      </div>
    );
  }

  if (!data) return null;

  const { user, analytics, enrollments, recentExams } = data;

  const getAvatarUrl = () => {
    const name = encodeURIComponent((user?.first_Name || "U") + "+" + (user?.last_Name || ""));
    if (!user?.profilePhoto?.url) {
      return `https://ui-avatars.com/api/?name=${name}&background=4F46E5&color=fff&size=128&bold=true`;
    }
    const url = user.profilePhoto.url;
    return getAssetUrl(url);
  };

  const completionRate = analytics.totalEnrolled
    ? Math.round((analytics.completedCourses / analytics.totalEnrolled) * 100)
    : 0;
  const passRate = analytics.totalExams
    ? Math.round((analytics.passedExams / analytics.totalExams) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button
          onClick={() => navigate("/admin/user-management")}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 text-sm font-medium transition-colors"
        >
          <MdArrowBack size={18} /> Back to User Management
        </button>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible"
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white rounded-full translate-y-1/2" />
        </div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative flex-shrink-0">
            <img
              src={getAvatarUrl()}
              alt={user.first_Name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-xl"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  (user.first_Name || "U") + "+" + (user.last_Name || "")
                )}&background=4F46E5&color=fff&size=128&bold=true`;
              }}
            />
            <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ring-2 ring-white ${
              user.isBlocked ? "bg-red-400" : "bg-emerald-400"
            }`} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.first_Name} {user.last_Name}</h1>
            <p className="text-white/80 text-sm">{user.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold capitalize">
                {user.role}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                user.isBlocked ? "bg-red-500/30 text-white" : "bg-emerald-500/30 text-white"
              }`}>
                {user.isBlocked ? "Blocked" : "Active"}
              </span>
              {user.gender && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold capitalize">
                  {user.gender}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleToggleBlock}
              disabled={blockLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                user.isBlocked
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {blockLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : user.isBlocked ? (
                <><MdVerified size={16} /> Unblock</>
              ) : (
                <><MdBlock size={16} /> Block</>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Enrolled", value: analytics.totalEnrolled, color: "bg-gradient-to-br from-indigo-500 to-indigo-600", icon: <MdSchool size={18} /> },
          { label: "Completed", value: analytics.completedCourses, color: "bg-gradient-to-br from-emerald-500 to-emerald-600", icon: <MdCheckCircle size={18} /> },
          { label: "Exams Taken", value: analytics.totalExams, color: "bg-gradient-to-br from-purple-500 to-purple-600", icon: <MdAssignment size={18} /> },
          { label: "Avg Score", value: `${analytics.avgScore}%`, color: "bg-gradient-to-br from-amber-500 to-orange-500", icon: <MdBarChart size={18} /> },
          { label: "Passed", value: analytics.passedExams, color: "bg-gradient-to-br from-teal-500 to-cyan-600", icon: <MdEmojiEvents size={18} /> },
          { label: "Failed", value: analytics.failedExams, color: "bg-gradient-to-br from-rose-500 to-red-600", icon: <MdTrendingUp size={18} /> },
          { label: "Logins", value: analytics.loginCount, color: "bg-gradient-to-br from-slate-600 to-slate-700", icon: <MdLogin size={18} /> },
          { label: "Pending", value: analytics.pendingCourses, color: "bg-gradient-to-br from-pink-500 to-rose-600", icon: <MdPending size={18} /> },
        ].map((card, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            animate="visible"
          >
            <MiniStatCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Two columns: Personal Info + Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <MdPerson size={18} className="text-indigo-600" />
            </div>
            <h2 className="font-bold text-gray-800">Personal Information</h2>
          </div>
          <div>
            <InfoRow icon={<MdPerson size={16} />} label="Full Name" value={`${user.first_Name} ${user.last_Name}`} />
            <InfoRow icon={<MdEmail size={16} />} label="Email" value={user.email} />
            <InfoRow icon={<MdCake size={16} />} label="Date of Birth" value={user.birth_Date ? new Date(user.birth_Date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null} />
            <InfoRow icon={<MdPerson size={16} />} label="Gender" value={user.gender} />
            <InfoRow icon={<MdLogin size={16} />} label="Last Login" value={user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"} />
            <InfoRow icon={<MdCalendarToday size={16} />} label="Registered On" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null} />
            <InfoRow icon={<MdDevices size={16} />} label="Total Logins" value={analytics.loginCount} />
          </div>
        </motion.div>

        {/* Performance Progress */}
        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <MdTrendingUp size={18} className="text-purple-600" />
            </div>
            <h2 className="font-bold text-gray-800">Performance Analytics</h2>
          </div>

          {/* Progress Bars */}
          {[
            { label: "Course Completion Rate", value: completionRate, color: "bg-indigo-500" },
            { label: "Exam Pass Rate", value: passRate, color: "bg-emerald-500" },
            { label: "Average Exam Score", value: analytics.avgScore, color: "bg-purple-500" },
          ].map((item, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between mb-1.5">
                <span className="text-sm text-gray-600 font-medium">{item.label}</span>
                <span className="text-sm font-bold text-gray-800">{item.value}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, delay: i * 0.15 + 0.5 }}
                  className={`h-full rounded-full ${item.color}`}
                />
              </div>
            </div>
          ))}

          {/* Donut */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle
                  cx="18" cy="18" r="14" fill="none"
                  stroke={completionRate >= 50 ? "#6366f1" : "#f59e0b"}
                  strokeWidth="4"
                  strokeDasharray={`${completionRate * 0.88} 88`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{completionRate}%</span>
                <span className="text-xs text-gray-400">Completion</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0" />
                {analytics.completedCourses} completed
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0" />
                {analytics.pendingCourses} pending
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                {analytics.passedExams} exams passed
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enrolled Courses */}
      {enrollments && enrollments.length > 0 && (
        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <FiBook size={16} className="text-emerald-600" />
            </div>
            <h2 className="font-bold text-gray-800">Enrolled Courses ({enrollments.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Course", "Role", "Theory Exam", "Practical Exam", "Result", "Enrolled On"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {enrollments.map((enroll, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-indigo-50/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-800">{enroll.courseOverview?.title || enroll.course?.title || "—"}</p>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full">
                        {enroll.role?.roleName || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                        enroll.theoryExamStatus === "completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {enroll.theoryExamStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                        enroll.practicalExamStatus === "completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {enroll.practicalExamStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        enroll.status === "Pass" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                      }`}>
                        {enroll.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500">
                      {enroll.createdAt ? new Date(enroll.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Recent Exams */}
      {recentExams && recentExams.length > 0 && (
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <FiAward size={16} className="text-amber-600" />
            </div>
            <h2 className="font-bold text-gray-800">Recent Exam Results ({recentExams.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Course", "Level", "Experience", "Status", "Score", "Result", "Date"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentExams.map((exam, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-amber-50/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800">
                      {exam.course?.title || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full capitalize">
                        {exam.examLaval || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{exam.jobExperience || "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                        exam.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {exam.status === "completed" ? (
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8">
                            <svg viewBox="0 0 36 36" className="w-8 h-8 -rotate-90">
                              <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                              <circle
                                cx="18" cy="18" r="14" fill="none"
                                stroke={parseFloat(exam.Score) >= 70 ? "#10b981" : "#ef4444"}
                                strokeWidth="4"
                                strokeDasharray={`${(parseFloat(exam.Score) || 0) * 0.88} 88`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                              {exam.Score || 0}
                            </div>
                          </div>
                          <span className="text-sm font-semibold">{exam.Score}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        exam.result === "Pass" ? "bg-emerald-50 text-emerald-700" : exam.result === "Fail" ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-500"
                      }`}>
                        {exam.result || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">
                      {exam.createdAt ? new Date(exam.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
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

export default StudentDetails;
