import React, { useEffect, useState } from "react";
import AddCourseList from "../../component/models/AddCourseList";
import axios from "axios";
import DeleteModel from "../../component/models/DeleteModel";
import { useNavigate, useLocation } from "react-router-dom";
import ViewScheduleInterview from "../../component/models/ViewScheduleInterview";
import ViewLiveInterview from "../../component/models/ViewLiveInterview";
import PageLoader from "../../component/PageLoader";
import add from "../../../public/assets/add-square.svg";
import toast from "react-hot-toast";
import Pagination from "../../component/Pagination";
import { axiosInstance, endPoints } from "../../api/axios";

const InterviewProgress = () => {
  const [loader, setLoader] = useState(false);
  const [scheduleInterview, setScheduleInterview] = useState([]);
  const Location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getInterviewProgress();
  }, [Location]);

  const getInterviewProgress = async () => {
    try {
      setLoader(true);
      const { data } = await axiosInstance.get(
        endPoints.interview.viewSchedule,
        { withCredentials: true }
      );
      setLoader(false);
      setScheduleInterview(data.interviews);
    } catch (error) {
      setLoader(false);
      toast.error("Error ", error);
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = scheduleInterview
    .filter(
      (guard) =>
        guard.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guard.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guard.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guard.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guard.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(scheduleInterview.length / itemsPerPage);

  return (
    <div className="p-4 sm:p-6 bg-white shadow rounded-lg w-full border">
      <div className="flex justify-between flex-col md:flex-row max-sm:mb-5">
        <h2 className="text-xl font-bold text-[#005151] relative mb-6 text-center sm:text-left">
          Interview Progress
          <span className="absolute bottom-[-8px] left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-[100px] h-[2px] bg-[#005151]"></span>
        </h2>

        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-[300px] border rounded py-2 px-4 shadow-sm focus:ring focus:ring-[#4DC3AB] focus:outline-none pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img
            src="/assets/search-Bordere.svg"
            alt="Search Icon"
            className="absolute left-3 top-2.5 w-5 h-5"
          />
        </div>
      </div>

      <div className="overflow-x-auto h-[75vh] rounded-lg overflow-hidden border">
        <table className="w-full text-left border-collapse  rounded-lg ">
          <thead className="bg-gray-200 w-full">
            <tr className="font-semibold capitalize text-gray-700">
              <th className="p-3 sm:px-6 text-nowrap">Name</th>
              <th className="p-3 sm:px-6 text-nowrap">Email</th>
              <th className="p-3 sm:px-6 text-nowrap">Gender</th>
              <th className="p-3 sm:px-6 text-nowrap">Role</th>
              <th className="p-3 sm:px-6 text-nowrap text-center">
                live interview status
              </th>
              <th className="p-3 sm:px-6 text-nowrap text-center">
                interview status
              </th>
            </tr>
          </thead>
          <tbody>
            {loader ? (
              <tr className="text-gray-500 select-none">
                <td className="text-center py-4 leading-[140px]" colSpan="100%">
                  <PageLoader />
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((guard) => (
                <tr key={guard.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4  sm:px-6 text-nowrap flex items-center min-w-[190px]">
                    <img
                      src={
                        guard.profile
                          ? guard.profile
                          : "https://via.placeholder.com/50"
                      }
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover me-2"
                    />
                    <span>{guard.candidateName}</span>
                  </td>
                  <td className="py-2 px-4 sm:px-6 text-nowrap">
                    {guard.candidateEmail}
                  </td>
                  <td className="py-2 px-4 sm:px-6 text-nowrap">
                    {guard.gender}
                  </td>
                  <td className="py-2 px-4 sm:px-6 text-nowrap">
                    {guard.role}
                  </td>

                  {guard.status === "Pending" ? (
                    <td className="py-2 px-4">
                      <div className="flex items-center justify-center">
                        <button
                          className={`flex items-center justify-center px-4 py-1 rounded-full text-center border ${
                            guard.status === "Pending"
                              ? "text-red-500 bg-[#ff6d6d33] border-red-500"
                              : "text-green-500 bg-[#E8FFEB] border-green-500"
                          }`}
                        >
                          {guard.status === "Pending" ? (
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
                          <span className="ml-1">{guard.status}</span>
                        </button>
                      </div>
                    </td>
                  ) : (
                    <td className="py-2 px-4 ">
                      <div className="flex items-center justify-center">
                        <button
                          className={`flex items-center justify-center px-4 py-1 rounded-full text-center border ${
                            guard.status === "Pending"
                              ? "text-red-500 bg-[#ff6d6d33] border-red-500"
                              : "text-green-500 bg-[#E8FFEB] border-green-500"
                          }`}
                        >
                          {guard.status === "Pending" ? (
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
                          <span className="ml-1">{guard.status}</span>
                        </button>
                      </div>
                    </td>
                  )}
                  {guard.selected === "Selected" ? (
                    <td className="py-2 px-4 sm:px-6 text-nowrap">
                      <div className="flex items-center justify-center">
                        <button className="text-white bg-[#4DC3AB] px-4 py-1 rounded-full capitalize">
                          {guard.selected}
                        </button>
                      </div>
                    </td>
                  ) : (
                    <td className="py-2 px-4 sm:px-6 text-nowrap">
                      <div className="flex items-center justify-center">
                        <button className="text-white bg-[#E74C3C] px-4 py-1 rounded-full capitalize">
                          {guard.selected === "Not_Selected"
                            ? "Not Selected"
                            : guard.selected}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr className="text-gray-500 select-none">
                <td className="text-center py-4" colSpan="100%">
                  No Data Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {currentItems.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Modals */}
      {/* {isModalOpen && (
        <AddCourseList
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        // getCourses={getCourses}
        />
      )} */}

      {/* {isDeleteModalOpen && (
        <DeleteModel
          closePopup={() => {
            setIsDeleteModalOpen(false);
            setSelectedExam(null);
          }}
          onDelete={handleDelete}
          message={{
            title: "Delete Exam?",
            sms: "Are you sure you want to delete this Interview?",
          }}
        />
      )}

      {isViewModalOpen && (
        <ViewScheduleInterview
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          data={selectedExam}
        />
      )}

      {isLiveInterviewOpen && (
        <ViewLiveInterview
          isOpen={isLiveInterviewOpen}
          onClose={() => setIsLiveInterviewOpen(false)}
        />
      )} */}
    </div>
  );
};

export default InterviewProgress;
