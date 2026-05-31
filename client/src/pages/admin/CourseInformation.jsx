import React, { useEffect, useState } from "react";
import editButton from "../../../public/assets/EditButton.svg";
import deleteButton from "../../../public/assets/DeleteButton.svg";
import viewbutton from "../../../public/assets/viewbutton.svg";
import add from "../../../public/assets/add-square.svg";
import AddCourseInformation from "../../component/models/AddCourseInformation";
import EditCourseInformation from "../../component/models/EditCourseInformation";
import axios from "axios";
import DeleteModel from "../../component/models/DeleteModel";
import ViewCourseInformation from "../../component/models/ViewCourseInformation";
import PageLoader from "../../component/PageLoader";
import toast from "react-hot-toast";
import Pagination from "../../component/Pagination";
import { axiosInstance, endPoints } from "../../api/axios";

const CourseInformation = () => {
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewCourseInformation, setIsViewCourseInformation] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [courseInfo, setCourseInfo] = useState(null);
  const [examData, setExamData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const skillsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    try {
      setLoader(true);
      const { data } = await axiosInstance.get(
        endPoints.courseInfo.getAll
      );
      setLoader(false);
      setExamData(data.data);
    } catch (error) {
      setLoader(false);
      toast.error("Error fetching course info.", error);
    }
  };

  const handleDelete = async () => {
    try {
      const { data } = await axiosInstance.delete(
        `${endPoints.courseInfo.delete}/${courseInfo._id}`
      );
      getInfo();
      setIsDeleteModalOpen(false);
      toast.success("CourseInfo Deleted Successfully.");
    } catch (error) {
      toast.error("Error ", error);
    }
  };



  const indexOfLastSkill = currentPage * skillsPerPage;
  const indexOfFirstSkill = indexOfLastSkill - skillsPerPage;
  

  const filteredSkills = examData.filter(
    (skill) =>
      (skill.title &&
        skill.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (skill.roleId?.roleName &&
        skill.roleId.roleName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (skill.courseId?.courseType &&
        skill.courseId.courseType
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (skill.title &&
        skill.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentSkills = filteredSkills.slice(indexOfFirstSkill, indexOfLastSkill);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredSkills.length / skillsPerPage);

  return (
    <div className="p-4 border">
      <div>
        <h2 className="text-xl font-bold text-[#005151] relative mb-4 text-center sm:text-left">
          Course Information
          <span className="absolute bottom-[-8px] left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-[100px] h-[2px] bg-[#005151]"></span>
        </h2>
        <div className="flex flex-col-reverse sm:flex-row flex-wrap items-center justify-between mb-4 gap-4">
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
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 h-10 px-5 rounded-lg bg-[#e5f2ea] text-[#005151] font-bold transition-colors hover:bg-[#d9ece1]"
          >
            <img src={add} alt="Add" className="w-5 h-5" />
            <span>Add Course Details</span>
          </button>
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-200 w-full">
              <tr className="font-semibold capitalize">
                <th className="p-3 text-gray-700 sm:px-6 text-nowrap text-left">
                  Course Name
                </th>
                <th className="py-3 text-gray-700 px-6 md:px-5 text-nowrap text-left">
                  Course Information Role
                </th>
                <th className="p-3 text-gray-700 sm:px-6 text-nowrap text-left">
                  Course Information title
                </th>
                <th className="p-3 text-gray-700 sm:px-6 text-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {loader ? (
                <tr className="text-gray-500 select-none">
                  <td className="text-center py-4 leading-[140px]" colSpan="100%">
                    <PageLoader />
                  </td>
                </tr>
              ) : currentSkills.length > 0 ? (
                currentSkills.map((guard) => (
                  <tr key={guard._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2 sm:px-6 min-w-[500px] flex items-center">
                      <span className="flex justify-center">
                        {guard.courseImage ? (
                          <img
                            src={guard.courseImage}
                            alt="Course Image"
                            className="max-w-[40px] min-h-10 rounded-full object-cover"
                          />
                        ) : (
                          <img
                            src="/path/to/placeholder-image.png"
                            alt="No Course Image"
                            className="max-w-[40px] min-h-10 rounded-full object-cover border"
                          />
                        )}
                      </span>
                      <span className="ms-3">
                        {guard.courseId?.courseType || "No Course"}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-semibold text-gray-800 sm:px-6 text-nowrap text-left whitespace-nowrap">
                      {guard.roleId?.roleName}
                    </td>
                    <td className="py-2 px-2 text-semibold text-gray-800 sm:px-6 text-left min-w-[400px] ">
                      {guard.title}
                    </td>
                    <td className="py-2 px-2 sm:px-6 text-center flex justify-center space-x-3">
                      <button
                        className="text-red-500 hover:text-red-700 h-10 w-10"
                        onClick={() => {
                          setIsViewCourseInformation(true); // Open the modal
                          setSelectedExam(guard); // Pass the selected exam
                        }}
                      >
                        <img src={viewbutton} alt="View" />
                      </button>
                      <button className="text-green-500 hover:text-green-700 h-10 w-10">
                        <img
                          src={editButton}
                          alt="Edit"
                          onClick={() => {
                            setCourseInfo(guard);
                            setIsEditModalOpen(true);
                          }}
                        />
                      </button>
                      <button
                        className="text-green-500 hover:text-green-700 h-10 w-10"
                        onClick={() => {
                          setCourseInfo(guard);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <img src={deleteButton} alt="Delete" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-gray-500 select-none">
                  <td className="text-center py-4 " colSpan="100%">
                    No Data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredSkills.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>



      {isViewCourseInformation && (
        <ViewCourseInformation
          isOpen={isViewCourseInformation}
          onClose={() => {
            setIsViewCourseInformation(false);
            setSelectedExam(null);
          }}
          data={selectedExam} // Pass the selected exam data
        />
      )}

      {isModalOpen && (
        <AddCourseInformation
          getInfo={getInfo}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isEditModalOpen && (
        <EditCourseInformation
          getInfo={getInfo}
          courseInfo={courseInfo}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCourseInfo(null);
          }}
          examData={examData} // Pass the relevant data to the edit modal
          message={{
            title: "Delete Exam?",
            sms: "Are you sure you want to delete this Exam?",
          }}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModel
          closePopup={() => {
            setIsDeleteModalOpen(false);
            setCourseInfo(null);
          }}
          onDelete={handleDelete}
          message={{
            title: "Delete Course?",
            sms: "Are you sure you want to delete this Course?",
          }}
        />
      )}
    </div>
  );
};

export default CourseInformation;
