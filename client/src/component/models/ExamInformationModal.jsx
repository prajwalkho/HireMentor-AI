import React, { useState } from "react";
import Loader from "../Loader";
import axios from "axios";
import ExamModal from "./ExamModal";
import { axiosInstance, endPoints } from "../../api/axios";
import toast from "react-hot-toast";

const ExamInformationModal = ({
  selectedCourse,
  onClose,
  setGetExamQuestion,
  setGetExam,
  setShowModal,
}) => {
  const [loading, setLoading] = useState(false);

  const [examLaval, setExamLaval] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};
    if (!examLaval) newErrors.examLaval = "Exam Level is required.";
    if (!jobExperience || isNaN(jobExperience) || jobExperience < 0)
      newErrors.jobExperience = "Valid job experience is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      setLoading(true);
      const inputPrompt = `Create exactly 10 multiple-choice questions (MCQs) based on the course: "${selectedCourse.title}". The difficulty level of the questions should match the exam level: "${examLaval}" and the experience level: "${jobExperience}". Each question should have 4 options, and the format should be:
                        [
                        {
                            "question": "Question text",
                            "options": ["Option1", "Option2", "Option3", "Option4"],
                            "rightAnswer": 0
                        }
                        ]. Return ONLY valid JSON.`;

      const currentUser = JSON.parse(localStorage.getItem("user"));
      
      const response = await axiosInstance.post(
        endPoints.ai.chat,
        { prompt: inputPrompt }
      );

      const aiResponseText = response.data?.data || "";
      const cleanJsonStr = aiResponseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const mockJsonResp = JSON.parse(cleanJsonStr);

      setGetExamQuestion(mockJsonResp);
      if (mockJsonResp) {
        const backendResponse = await axiosInstance.post(
          endPoints.exam.create,
          {
            questions: JSON.stringify(mockJsonResp),
            course: selectedCourse?._id,
            user: currentUser?._id,
            status: "pending",
            examLaval,
            jobExperience,
          }
          // { headers: { "Content-Type": "application/json" } }
        );
        setGetExam(backendResponse?.data?.data);
        setShowModal(true);
        onClose();
      }
    } catch (error) {
      toast.error(
        "Error calling Gemini API: ",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] overflow-y-auto">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[90%] max-h-[90%] sm:w-[450px] lg:w-[500px] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-2">
          Tell us more about yourself
        </h2>
        <p className="mb-4">
          Add details about your job experience and Exam Level.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mt-2">
            <label className="text-gray-700 font-semibold">Exam Level</label>
            <select
              name="examLaval"
              value={examLaval}
              onChange={(e) => setExamLaval(e.target.value)}
              className={`input border w-full rounded-lg p-2 focus:outline-none focus:ring-2 ${
                errors.examLaval ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="" disabled>
                Select Level
              </option>
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
            {errors.examLaval && (
              <p className="text-red-500 text-sm mt-1">{errors.examLaval}</p>
            )}
          </div>

          <div className="mt-2">
            <label className="text-gray-700 font-semibold">
              Years of Experience
            </label>
            <input
              type="number"
              name="jobExperience"
              min="0"
              max="50"
              value={jobExperience}
              onChange={(e) => setJobExperience(e.target.value)}
              placeholder="Ex. 05"
              className={`input border w-full rounded-lg p-2 focus:outline-none focus:ring-2 ${
                errors.jobExperience ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.jobExperience && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jobExperience}
              </p>
            )}
          </div>

          <div className="mt-5 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="shadow-md text-[#005151] bg-[#e5f2ea] hover:bg-[#d9ece1] font-semibold py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="shadow-md text-[#005151] bg-[#e5f2ea] hover:bg-[#d9ece1] font-semibold py-2 px-4 rounded-md"
            >
              {loading ? <Loader /> : "Start Exam"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamInformationModal;
