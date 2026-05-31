import React, { useEffect, useState } from "react";
import editButton from "../../../public/assets/EditButton.svg";
import deleteButton from "../../../public/assets/DeleteButton.svg";
import add from "../../../public/assets/add-square.svg";
import AddCourseList from "../../component/models/AddCourseList";
import EditCourseList from "../../component/models/EditCourseList";
import axios from "axios";
import DeleteModel from "../../component/models/DeleteModel";
import PageLoader from "../../component/PageLoader";
import toast from "react-hot-toast";
import Pagination from "../../component/Pagination";
import { axiosInstance, endPoints } from "../../api/axios";

const CourseList = () => {
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseEditId, setCourseEditId] = useState(null);
  const [examData, setExamData] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const skillsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    try {
      setLoader(true);
      const { data } = await axiosInstance.get(
        endPoints.courses.getAll
      );
      setLoader(false);
      setExamData(data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch courses. Please try again later."
      );
      setLoader(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { data } = await axiosInstance.delete(
        `${endPoints.courses.delete}/${selectedExam._id}`
      );
      getCourses();
      toast.success("Course deleted successfully.");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete the course.");
    }
  };

  
  const indexOfLastCourse = currentPage * skillsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - skillsPerPage;
 

  const filteredCourses = examData.filter(
    (course) =>
      (course.roleId &&
        course.roleId.roleName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (course.courseType &&
        course.courseType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredCourses.length / skillsPerPage);

  return (
    <div className="p-4 sm:p-6 bg-white shadow rounded-lg w-full border">
      <h2 className="text-xl font-bold text-[#005151] relative mb-4 text-center sm:text-left">
        Course List
        <span className="absolute bottom-[-8px] left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-[70px] h-[2px] bg-[#005151]"></span>
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
          <span>Add Course</span>
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-200 w-full">
            <tr className="font-semibold capitalize">
              <th className="p-3 text-gray-700 sm:px-6 text-nowrap text-left">
                Course Role
              </th>
              <th className="p-3  text-gray-700 sm:px-6 text-nowrap text-left">
                Course title
              </th>
              <th className="p-3  text-gray-700 sm:px-6 text-nowrap">
                Action
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
            ) : currentCourses.length > 0 ? (
              currentCourses.map((guard) => (
                <tr key={guard._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-semibold capitalize text-gray-800 sm:px-6 text-nowrap min-w-[250px]">
                    {guard.roleId?.roleName}
                  </td>
                  <td className="py-2 px-4 text-semibold capitalize text-gray-800 sm:px-6 text-nowrap  min-w-[300px]">
                    {guard.courseType}
                  </td>
                  <td className="py-2 px-2 sm:px-6 flex justify-center space-x-3">
                    <button
                      className="text-green-500 hover:text-green-700 h-10 w-10"
                    >
                      <img src={editButton} alt="Edit" onClick={() => {
                        setCourseEditId(guard)
                        setIsEditModalOpen(true)
                      }} />
                    </button>
                    <button
                      className="text-green-500 hover:text-green-700 h-10 w-10"
                      onClick={() => {
                        setSelectedExam(guard);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <img src={deleteButton} alt="Edit" />
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

      {filteredCourses.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
          setCurrentPage={setCurrentPage}
        />
      )}

      {isModalOpen && (
        <AddCourseList
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          getCourses={getCourses}
        />
      )}

      {isEditModalOpen && (
        <EditCourseList
          getCourses={getCourses}
          courseId={courseEditId}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          examData={examData}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModel
          closePopup={() => {
            setIsDeleteModalOpen(false);
            setSelectedExam(null);
          }}
          onDelete={handleDelete}
          message={{
            title: "Delete Exam?",
            sms: "Are you sure you want to delete this Exam?",
          }}
        />
      )}
    </div>
  );
};

export default CourseList;
