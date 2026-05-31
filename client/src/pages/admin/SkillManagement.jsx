import React, { useEffect, useState } from "react";
import axios, { Axios } from "axios";
import add from "../../../public/assets/add-square.svg";
import editButton from "../../../public/assets/EditButton.svg";
import deleteButton from "../../../public/assets/DeleteButton.svg";
import SkillModal from "../../component/models/SkillModal";
import DeleteModel from "../../component/models/DeleteModel";
import PageLoader from "../../component/PageLoader";
import toast from "react-hot-toast";
import Pagination from "../../component/Pagination";
import { axiosInstance, endPoints } from "../../api/axios";

const SkillManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const skillsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [skillTitle, setSkillTitle] = useState("");
  const [loader, setLoader] = useState(false);

  const toggleCreateModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const openEditModal = (skill) => {
    setCurrentSkill(skill);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setCurrentSkill(null);
    setIsEditModalOpen(false);
  };

  const handleSaveSkill = async () => {
    try {
      setLoader(true);
      const response = await axiosInstance.post(
       endPoints.skills.create,
        { title: skillTitle }
      );
      toast.success("Skill saved successfully.");
      setLoader(false);
      onSave(response.data.skill);
      onClose();
    } catch (error) {
      setLoader(false);
      toast.error("Error saving skill.", error);
    }
  };

  const handleDelete = async () => {
    if (selectedSkill) {
      try {
        await axiosInstance.delete(
          `${endPoints.skills.delete}/${selectedSkill._id
          }`
        );
        setSkills((prevSkills) =>
          prevSkills.filter((skill) => skill._id !== selectedSkill._id)
        );
        toast.success("Skill deleted successfully.");
        setOpenDelete(false);
        setSelectedSkill(null);
      } catch (error) {
        toast.error("Failed to delete skill.", error);
      }
    }
  };

  const filteredSkills = Array.isArray(skills)
    ? skills?.filter((skill) =>
      skill?.title?.toLowerCase().includes(searchTerm?.toLowerCase())
    )
    : [];

  const indexOfLastSkill = currentPage * skillsPerPage;
  const indexOfFirstSkill = indexOfLastSkill - skillsPerPage;
  const currentSkills = filteredSkills.slice(
    indexOfFirstSkill,
    indexOfLastSkill
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchSkills = async () => {
    try {
      setLoader(true);
      const response = await axiosInstance.get(
        endPoints.skills.getAll
      );
      setLoader(false);
      setSkills(response.data.skills);
    } catch (error) {
      toast.error("Failed to fetch skills.", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const totalPages = Math.ceil(filteredSkills.length / skillsPerPage);

  return (
    <>
      {/* Skill Table */}
      <div className="border p-4">
        <div className="rounded-lg w-full overflow-x-auto pt-3">
          <h2 className="text-xl font-bold text-[#005151] relative mb-4 text-center sm:text-left">
            Skills Management
            <span className="absolute bottom-[-8px] left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-[70px] h-[2px] bg-[#005151]"></span>
          </h2>
          <div className="flex flex-col-reverse sm:flex-row flex-wrap items-center justify-between mb-4 gap-4 ml-1">
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
              <span>Add Skill Management</span>
            </button>
          </div>
          <div className='overflow-x-auto rounded-lg border'>
            <table className='w-full bg-white shadow-lg rounded-lg overflow-hidden'>
              <thead className='bg-gray-200 w-full'>
                <tr className='font-semibold capitalize'>
                  <th className='p-3  text-left text-gray-700'>Skill Name</th>
                  <th className='p-3 text-left text-gray-700'>Created At</th>
                  <th className='py-3 text-gray-700'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loader ? (
                  <tr className="text-gray-500 select-none">
                    <td className="py-4 leading-[140px]" colSpan="100%">
                      <PageLoader />
                    </td>
                  </tr>
                ) : currentSkills.length > 0 ? (
                  currentSkills.map((skill) => (
                    <tr key={skill._id} className="border-b hover:bg-gray-50">
                      <td className="py-1 px-4 text-semibold text-gray-800 capitalize min-w-[200px]">
                        {skill.title}
                      </td>
                      <td className="py-1 px-4 text-semibold text-gray-800">
                        {new Date(skill?.updatedAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className='py-1 text-sm text-gray-800 flex justify-center space-x-3'>
                        <button
                          className="h-10 w-10"
                          onClick={() => openEditModal(skill)}
                        >
                          <img src={editButton} alt="Edit" />
                        </button>
                        <button
                          className="h-10 w-10"
                          onClick={() => {
                            setOpenDelete(true);
                            setSelectedSkill(skill);
                          }}
                        >
                          <img src={deleteButton} alt="Delete" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="100%"
                      className="py-10 text-center text-gray-500"
                    >
                      No data found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* )} */}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <SkillModal
          onClose={toggleCreateModal}
          onSave={handleSaveSkill}
          fetchSkills={fetchSkills}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <SkillModal
          onClose={closeEditModal}
          skill={currentSkill}
          isEditing={true}
          onSave={handleSaveSkill}
          fetchSkills={fetchSkills}
        />
      )}
      {openDelete && (
        <DeleteModel
          closePopup={() => {
            setOpenDelete(false);
            setSelectedSkill(null);
          }}
          onDelete={handleDelete}
          message={{
            title: "Delete Skill?",
            sms: "Are you sure you want to delete this Skill?",
          }}
        />
      )}
    </>
  );
};

export default SkillManagement;
