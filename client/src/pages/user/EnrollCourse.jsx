import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import PageLoader from "../../component/PageLoader";
import toast from "react-hot-toast";
import { axiosInstance, endPoints } from "../../api/axios";
import { motion } from "framer-motion";

const EnrollCourse = () => {
  const [role, setRole] = useState("");
  const [course, setCourse] = useState("");
  const [roles, setRoles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigation = useNavigate();

  useEffect(() => {
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

    const fetchEnrolledCourses = async () => {
      try {
        setLoader(true);
        const response = await axiosInstance.get(
          endPoints.courseInfo.getAll,
          { withCredentials: true }
        );
        setLoader(false);
        setEnrolledCourses(response.data.data);
      } catch (error) {
        setLoader(false);
        toast.error("Error fetching enrolled courses:", error);
      }
    };

    fetchRoles();
    fetchEnrolledCourses();
  }, []);

  const fetchCoursesByRole = async (roleId) => {
    try {
      setLoader(true);
      const response = await axiosInstance.get(
        `${endPoints.courses.getByRole}/${roleId}`,
        { withCredentials: true }
      );
      setLoader(false);
      setCourses(response.data.data);
    } catch (error) {
      setLoader(false);
      toast.error("Error fetching courses:", error);
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setCourse("");
    setFilteredCourses([]);

    if (selectedRole) {
      fetchCoursesByRole(selectedRole);
    } else {
      setCourses([]);
    }
  };

  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value;
    setCourse(selectedCourse);
    if (role && selectedCourse) {
      setLoader(true);
      const filteredByRoleAndCourse = enrolledCourses.filter(
        (item) =>
          item.roleId?._id === role && item.courseId?._id === selectedCourse
      );
      setFilteredCourses(filteredByRoleAndCourse);
    } else {
      setLoader(false);
      setFilteredCourses([]);
    }
    setLoader(false);
  };

  const handleEnroll = async (course) => {
    try {
      const response = await axiosInstance.post(
        endPoints.enrollment.enroll,
        {
          role: course?.roleId?._id,
          course: course.courseId?._id,
          courseOverview: course?._id,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success("Enrollment successful!");
        navigation(`enroll-course-info/${course._id}`, { state: { selectedCourse: course } });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Enrollment failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-cyan-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Find Your Course
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="role"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                value={role}
                onChange={handleRoleChange}
              >
                <option value="" disabled>Choose a role</option>
                {roles.map((roleItem) => (
                  <option
                    key={roleItem._id}
                    value={roleItem._id}
                    className="capitalize"
                  >
                    {roleItem.roleName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="course"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                value={course}
                onChange={handleCourseChange}
                disabled={!role}
              >
                <option value="" disabled>Choose a course</option>
                {courses.map((courseItem) => (
                  <option
                    key={courseItem._id}
                    value={courseItem._id}
                    className="capitalize"
                  >
                    {courseItem.courseType.length > 45
                      ? courseItem.courseType.slice(0, 45) + "..."
                      : courseItem.courseType}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        {loader ? (
          <div className="flex justify-center items-center h-64">
            <PageLoader />
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  when: "beforeChildren"
                }
              }
            }}
          >
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 10
                      }
                    }
                  }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.courseImage || "https://via.placeholder.com/400x200"}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-cyan-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {course.roleId?.roleName}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.overview}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEnroll(course)}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Enroll Now
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full py-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mx-auto w-24 h-24 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-cyan-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  Start Your Learning Journey
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Select a role and course to discover exciting learning opportunities tailored for you.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnrollCourse;