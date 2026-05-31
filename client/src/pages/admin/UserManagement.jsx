import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { axiosInstance, endPoints } from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import PageLoader from "../../component/PageLoader";
import {
  MdSearch, MdFilterList, MdBlock, MdCheckCircle, MdDelete,
  MdVisibility, MdPeople, MdPersonAdd, MdRefresh, MdClose,
  MdArrowForward, MdWarning, MdAdminPanelSettings,
} from "react-icons/md";
import { FiUsers } from "react-icons/fi";

const BASE_URL = "http://localhost:9000";

const getAvatarUrl = (user) => {
  const name = encodeURIComponent((user?.first_Name || "U") + "+" + (user?.last_Name || ""));
  if (!user?.profilePhoto?.url) {
    return `https://ui-avatars.com/api/?name=${name}&background=4F46E5&color=fff&size=64&bold=true`;
  }
  const url = user.profilePhoto.url;
  if (url.startsWith("http")) return url;
  return `${BASE_URL}/${url.replace(/\\/g, "/")}`;
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, danger }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        >
          <div className={`w-12 h-12 ${danger ? "bg-red-50" : "bg-amber-50"} rounded-2xl flex items-center justify-center mb-4`}>
            <MdWarning size={24} className={danger ? "text-red-500" : "text-amber-500"} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors ${
                danger ? "bg-red-600 hover:bg-red-700" : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, userId: null, userName: "" });
  const PER_PAGE = 10;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const { data } = await axiosInstance.get(`${endPoints.auth.getAllUsers}?${params}`);
      setUsers(data?.data || []);
      setPage(1);
    } catch {
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleBlock = async (userId, currentlyBlocked, userName) => {
    setConfirmModal({
      open: true,
      type: "block",
      userId,
      userName,
      currentlyBlocked,
    });
  };

  const handleDelete = (userId, userName) => {
    setConfirmModal({ open: true, type: "delete", userId, userName });
  };

  const executeAction = async () => {
    const { type, userId, currentlyBlocked } = confirmModal;
    setConfirmModal({ open: false });
    setActionLoading(userId);
    try {
      if (type === "block") {
        const { data } = await axiosInstance.put(endPoints.auth.adminBlockUser(userId));
        toast.success(data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isBlocked: data.isBlocked } : u))
        );
      } else if (type === "delete") {
        await axiosInstance.delete(endPoints.auth.adminDeleteUser(userId));
        toast.success("User deleted successfully.");
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch {
      toast.error("Action failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // Pagination
  const totalPages = Math.ceil(users.length / PER_PAGE);
  const paginatedUsers = users.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalUsers = users.length;
  const activeCount = users.filter((u) => !u.isBlocked).length;
  const blockedCount = users.filter((u) => u.isBlocked).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MdAdminPanelSettings size={28} className="text-indigo-600" />
            User Management
          </h1>
          <p className="text-gray-500 text-sm">Manage all registered students and users</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md"
        >
          <MdRefresh size={18} /> Refresh
        </button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: totalUsers, icon: <FiUsers size={20} className="text-white" />, bg: "bg-gradient-to-br from-indigo-500 to-indigo-600" },
          { label: "Active Users", value: activeCount, icon: <MdCheckCircle size={20} className="text-white" />, bg: "bg-gradient-to-br from-emerald-500 to-emerald-600" },
          { label: "Blocked Users", value: blockedCount, icon: <MdBlock size={20} className="text-white" />, bg: "bg-gradient-to-br from-red-500 to-red-600" },
        ].map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`${c.bg} rounded-2xl p-4 text-white flex items-center gap-3 shadow-md`}
          >
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              {c.icon}
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium">{c.label}</p>
              <p className="text-2xl font-bold">{c.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-3"
      >
        {/* Search */}
        <div className="relative flex-1">
          <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <MdClose size={16} />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <MdFilterList size={18} className="text-gray-400 flex-shrink-0" />
          <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1">
            {["all", "active", "blocked"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  statusFilter === f
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <PageLoader />
                  </td>
                </tr>
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, i) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    {/* User info */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={getAvatarUrl(user)}
                            alt={user.first_Name}
                            className="w-10 h-10 rounded-xl object-cover"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                (user.first_Name || "U") + "+" + (user.last_Name || "")
                              )}&background=4F46E5&color=fff&size=64&bold=true`;
                            }}
                          />
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${
                            user.isBlocked ? "bg-red-400" : "bg-emerald-400"
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {user.first_Name} {user.last_Name}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {user.gender || "—"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "Never"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
                        user.isBlocked
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isBlocked ? "bg-red-500" : "bg-emerald-500"}`} />
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {/* View Details */}
                        <Link
                          to={`/admin/student/${user._id}`}
                          title="View Details"
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <MdVisibility size={17} />
                        </Link>

                        {/* Block/Unblock */}
                        <button
                          onClick={() => handleBlock(user._id, user.isBlocked, `${user.first_Name} ${user.last_Name}`)}
                          disabled={actionLoading === user._id}
                          title={user.isBlocked ? "Unblock User" : "Block User"}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isBlocked
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-amber-600 hover:bg-amber-50"
                          }`}
                        >
                          {actionLoading === user._id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : user.isBlocked ? (
                            <MdCheckCircle size={17} />
                          ) : (
                            <MdBlock size={17} />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(user._id, `${user.first_Name} ${user.last_Name}`)}
                          disabled={actionLoading === user._id}
                          title="Delete User"
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <MdDelete size={17} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                        <FiUsers size={28} className="text-gray-300" />
                      </div>
                      <p className="font-semibold text-gray-500">No users found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search or filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, users.length)} of {users.length} users
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    p === page
                      ? "bg-indigo-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false })}
        onConfirm={executeAction}
        danger={confirmModal.type === "delete"}
        title={
          confirmModal.type === "delete"
            ? "Delete User"
            : confirmModal.currentlyBlocked
            ? "Unblock User"
            : "Block User"
        }
        message={
          confirmModal.type === "delete"
            ? `Are you sure you want to permanently delete "${confirmModal.userName}"? This action cannot be undone.`
            : confirmModal.currentlyBlocked
            ? `Unblock "${confirmModal.userName}"? They will regain access to the platform.`
            : `Block "${confirmModal.userName}"? They will not be able to log in until unblocked.`
        }
        confirmText={
          confirmModal.type === "delete"
            ? "Delete"
            : confirmModal.currentlyBlocked
            ? "Unblock"
            : "Block"
        }
      />
    </div>
  );
};

export default UserManagement;
