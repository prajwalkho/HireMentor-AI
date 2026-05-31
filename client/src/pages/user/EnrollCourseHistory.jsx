import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../component/Pagination";
import PageLoader from "../../component/PageLoader";
import { Link } from "react-router-dom";
import { axiosInstance, endPoints } from "../../api/axios";

const EnrollCourseHistory = () => {
  const [Enrollexamtable, setEnrollexamtable] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Set items per page to 10
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [examResult, setExamResult] = useState("");
  const [laval, setLaval] = useState("");

  const fetchRoles = async () => {
    try {
      setLoader(true);
      const response = await axiosInstance.get(endPoints.roles.getAll);
      setLoader(false);
      setRoles(response.data.data);
    } catch (error) {
      setLoader(false);
      toast.error("Error fetching roles.", error);
    }
  };

  const getEnroll = async () => {
    try {
      setLoader(true);
      const { data } = await axiosInstance.get(
        endPoints.exam.getByUser,
        {
          withCredentials: true,
        }
      );
      setEnrollexamtable(data?.data);
      console.log(data?.data);
    } catch (error) {
      toast.error("Error fetching course info.", error);
    } finally {
      setLoader(false);
    }
  };

  // Filter enrollments based on search term, role, status, exam result, and laval
  const filteredEnrollments = Enrollexamtable.filter((item) => {
    const matchesSearchTerm =
      item.course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.course?.roleId?.roleName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesRole = role ? item.course?.roleId?._id === role : true;
    const matchesStatus = status ? item?.status === status : true;
    const matchesExamResult = examResult
      ? item?.result === examResult ||
        (!item?.result && examResult === "Pending")
      : true;
    const matchesLaval = laval
      ? item?.examLaval?.toLowerCase() === laval.toLowerCase()
      : true;

    return (
      matchesSearchTerm &&
      matchesRole &&
      matchesStatus &&
      matchesExamResult &&
      matchesLaval
    );
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEnrollments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
  };

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);
  };

  const handleExamResultChange = (e) => {
    const selectedExamResult = e.target.value;
    setExamResult(selectedExamResult);
  };

  useEffect(() => {
    getEnroll();
    fetchRoles();
  }, []);

  return (
    <>
      <div className="border p-4">
        {/* Filters Section */}
        <div className="space-y-4">
          {/* First Row: Role, Status, Exam Result, Laval */}
          <div className="flex flex-wrap gap-4">
            {/* Role Dropdown */}
            <div className="flex-1 min-w-[150px]">
              <label htmlFor="role" className="block text-sm font-medium mb-1">
                Role
              </label>
              <select
                id="role"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                value={role}
                onChange={handleRoleChange}
              >
                <option value="">All Role</option>
                {roles.map((roleItem) => (
                  <option key={roleItem._id} value={roleItem._id}>
                    {roleItem.roleName}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="flex-1 min-w-[150px]">
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                id="status"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                value={status}
                onChange={handleStatusChange}
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Exam Result Dropdown */}
            <div className="flex-1 min-w-[150px]">
              <label
                htmlFor="examResult"
                className="block text-sm font-medium mb-1"
              >
                Exam Result
              </label>
              <select
                id="examResult"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                value={examResult}
                onChange={handleExamResultChange}
              >
                <option value="">All Results</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Laval Dropdown */}
            <div className="flex-1 min-w-[150px]">
              <label htmlFor="laval" className="block text-sm font-medium mb-1">
                Laval
              </label>
              <select
                id="laval"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                value={laval}
                onChange={(e) => setLaval(e.target.value)}
              >
                <option value="">All Lavals</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          {/* Second Row: Search Input */}
          <div className="w-full md:w-1/2 lg:w-1/4">
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Search..."
                className="w-full border rounded py-2 px-4 shadow-sm focus:ring focus:ring-[#4DC3AB] focus:outline-none pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <img
                src="/assets/search-Bordere.svg"
                alt="Search Icon"
                className="absolute left-2 top-2.5 w-6 h-5"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border mt-4">
          <table className="w-full bg-white rounded-lg">
            <thead className="bg-gray-200">
              <tr className="font-semibold capitalize">
                <th className="p-3 text-gray-700 text-left rounded-tl-lg text-nowrap">
                  Course
                </th>
                <th className="p-3 text-gray-700 text-nowrap">Role</th>
                <th className="p-3 text-gray-700 text-nowrap text-center">
                  Status
                </th>
                <th className="p-3 text-gray-700 text-nowrap text-center">
                  Exam Score
                </th>
                <th className="p-3 text-gray-700 text-nowrap text-center">
                  Exam Result
                </th>
                <th className="p-3 text-gray-700 text-nowrap text-center">
                  Laval
                </th>
                <th className="p-3 text-gray-700 text-nowrap text-center rounded-tr-lg">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loader ? (
                <tr className="text-gray-500 select-none">
                  <td className="py-14 leading-[140px]" colSpan="100%">
                    <PageLoader />
                  </td>
                </tr>
              ) : currentItems.length !== 0 ? (
                currentItems.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 flex gap-3 items-center text-semibold text-gray-800 capitalize max-w-[500px]">
                      <img
                        src={item?.course?.courseImage}
                        alt={item?.course?.title}
                        className="w-12 h-12 rounded-full"
                      />{" "}
                      {item?.course?.title}
                    </td>
                    <td className="py-2 px-4 text-semibold text-gray-800 text-center capitalize">
                      {item.course?.roleId?.roleName}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center justify-center">
                        <button
                          className={`flex items-center justify-center px-4 py-1 rounded-full text-center border ${
                            item?.status === "pending"
                              ? "text-red-500 bg-[#ff6d6d33] border-red-500"
                              : "text-green-500 bg-[#E8FFEB] border-green-500"
                          }`}
                        >
                          {item?.status === "pending" ? (
                            <img
                              src="/assets/warning.svg"
                              alt="Pending"
                              className="w-5 h-5"
                            />
                          ) : (
                            <img
                              src="/assets/true.svg"
                              alt="Completed"
                              className="w-5 h-5"
                            />
                          )}
                          <span className="ml-1">{item?.status}</span>
                        </button>
                      </div>
                    </td>
                    <td className="p-2 flex items-center justify-center">
                      <div
                        className={`relative inline-block w-10 h-10 rounded-full ${
                          item.status === "completed"
                            ? item.Score >= 70
                              ? "bg-green-100"
                              : "bg-red-100"
                            : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${
                            item.status === "completed"
                              ? item.Score >= 70
                                ? "text-green-500"
                                : "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {item.Score ? `${item.Score}%` : "N/A"}
                        </div>
                        <div
                          className={`absolute inset-0 rounded-full border-2 border-solid ${
                            item.Score >= 70
                              ? "border-green-500"
                              : item.Score < 70 && item.Score > 0
                              ? "border-red-500"
                              : "border-gray-500"
                          }`}
                        />
                      </div>
                    </td>
                    <td className="py-2 px-2 sm:px-6 text-nowrap">
                      <div className="flex items-center justify-center">
                        <button
                          className={`flex items-center justify-center px-4 py-1 rounded-full text-center border ${
                            item.result === "Fail"
                              ? "text-red-500 bg-[#ff6d6d33] border-red-500"
                              : "text-green-500 bg-[#E8FFEB] border-green-500"
                          }`}
                        >
                          {item.result === "Fail" ? (
                            <img
                              src="/assets/warning.svg"
                              alt="Pending"
                              className="w-5 h-5 mr-1"
                            />
                          ) : (
                            <img
                              src="/assets/true.svg"
                              alt="Completed"
                              className="w-5 h-5 mr-1"
                            />
                          )}
                          {item.result} Exam
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-semibold text-gray-800 text-center capitalize">
                      {item.examLaval}
                    </td>
                    <td className="py-2 px-4 text-semibold text-gray-800 text-center capitalize">
                      <div className="flex items-center justify-center space-x-2">
                        {item?.status === "pending" ? (
                          <img
                            src="/assets/viewbutton.svg"
                            alt="Disabled View"
                            className="opacity-50 cursor-not-allowed w-6 h-6"
                          />
                        ) : (
                          <Link to={`/user/enroll-exam-score/${item?._id}`} title="View Score">
                            <img src="/assets/viewbutton.svg" alt="View Score" className="w-6 h-6" />
                          </Link>
                        )}
                        <Link 
                          to={`/user/enroll-course/enroll-course-info/${item.course?._id}`} 
                          state={{ selectedCourse: item.course }}
                          title="View Course Materials"
                        >
                          <img src="/assets/education-icon.svg" alt="View Course" className="w-6 h-6 hover:scale-110 transition-transform" onError={(e) => e.target.src = "/assets/viewbutton.svg"} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="100%"
                    className="py-20 text-center text-gray-500 max-sm:py-8"
                  >
                    No data found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};

export default EnrollCourseHistory;
