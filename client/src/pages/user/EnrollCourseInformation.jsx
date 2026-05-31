import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import ExamModal from "../../component/models/ExamModal";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../../component/Loader";
import PageLoader from "../../component/PageLoader";
import ExamInformationModal from "../../component/models/ExamInformationModal";
import { motion } from "framer-motion";
import { axiosInstance, endPoints } from "../../api/axios";

const EnrollCourseInformation = () => {
  const location = useLocation();
  const { id } = useParams();
  const [selectedCourse, setSelectedCourse] = useState(location?.state?.selectedCourse || null);
  const [loading, setLoading] = useState(!selectedCourse);
  const [isExamInfoModel, setIsExamInfoModel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [getExamQuestion, setGetExamQuestion] = useState([]);
  const [getExam, setGetExam] = useState([]);

  useEffect(() => {
    if (!selectedCourse && id) {
      fetchCourseDetails();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`${endPoints.courseInfo.getById}/${id}`);
      setSelectedCourse(data.data);
    } catch (error) {
      toast.error("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollExam = async () => {
    setIsExamInfoModel(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <PageLoader />
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 bg-white rounded-xl shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Course Selected
          </h3>
          <p className="text-gray-500">
            Please select a course from the courses page to view details.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4 sm:px-6">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-48 md:h-64 flex items-center justify-center text-center bg-cover bg-center rounded-xl mb-8 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 81, 81, 0.7), rgba(0, 81, 81, 0.7)), url('/assets/education-image.jpg')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="relative z-10 px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            {selectedCourse.title}
          </h1>
          <div className="w-20 h-1 bg-cyan-300 rounded-full mx-auto"></div>
        </div>
      </motion.div>

      {/* Course Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white w-full max-w-6xl mx-auto p-6 md:p-8 rounded-xl shadow-lg mb-8"
      >
        <div className="flex items-center mb-4">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800">Course Overview</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {selectedCourse.description}
        </p>
      </motion.div>

      {/* Course Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8"
      >
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-cyan-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-medium text-gray-800">Duration</h3>
          </div>
          <p className="text-gray-600">4 Weeks</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-cyan-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="font-medium text-gray-800">Level</h3>
          </div>
          <p className="text-gray-600">Intermediate</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-cyan-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="font-medium text-gray-800">Resources</h3>
          </div>
          <p className="text-gray-600">
            {selectedCourse.studyMaterials?.length || 0} PDFs, {selectedCourse.videoLinks?.length || 0} Videos, Quizzes
          </p>
        </div>
      </motion.div>

      {/* Resources Section */}
      {(selectedCourse.videoLinks?.length > 0 || selectedCourse.studyMaterials?.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
        >
          {/* Video Materials */}
          {selectedCourse.videoLinks?.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4 border-b pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">Video Tutorials</h3>
              </div>
              <ul className="space-y-3">
                {selectedCourse.videoLinks.map((link, index) => (
                  <li key={index} className="flex items-center group">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline break-all transition-colors">
                      Watch Video {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PDF & Documents */}
          {selectedCourse.studyMaterials?.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4 border-b pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">Study Materials</h3>
              </div>
              <ul className="space-y-3">
                {selectedCourse.studyMaterials.map((mat, index) => (
                  <li key={index} className="flex items-center group bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <a href={mat.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors">
                      {mat.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {/* Exam Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-center mt-8"
      >
        <button
          onClick={handleEnrollExam}
          className="relative px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-semibold overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span className="relative z-10 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Take Course Exam
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
      </motion.div>

      {/* Modals */}
      {isExamInfoModel && (
        <ExamInformationModal
          selectedCourse={selectedCourse}
          onClose={() => setIsExamInfoModel(false)}
          setGetExamQuestion={setGetExamQuestion}
          setGetExam={setGetExam}
          setShowModal={setShowModal}
        />
      )}

      {showModal && (
        <ExamModal
          getExamQuestion={getExamQuestion}
          getExam={getExam}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default EnrollCourseInformation;