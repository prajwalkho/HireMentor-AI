import axios from "axios";
import { useEffect, useState } from "react";
import add from "../../../public/assets/add-square.svg";
import RoleAddModel from "../../component/models/RoleAddModel";
import DeleteModel from "../../component/models/DeleteModel";
import RoleEditModal from "../../component/models/RoleEditModal";
import PageLoader from "../../component/PageLoader";
import toast from "react-hot-toast";
import Pagination from "../../component/Pagination";
import { axiosInstance, endPoints } from "../../api/axios";

const RoleManagement = () => {
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const skillsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    try {
      setLoader(true);
      const { data } = await axiosInstance.get(
        `${endPoints.roles.getAll}`
      );
      setLoader(false);
      setRoles(data.data);
    } catch (error) {
      setLoader(false);
      toast.error("Error ", error);
    }
  };
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `${endPoints.roles.delete}/${selectedRole._id}`
      );
      setOpenDelete(false);
      getRoles();
      toast.success("Roles Deleted Successfully.");
    } catch (error) {
      toast.error("Error ", error);
    }
  };

  const indexOfLastRole = currentPage * skillsPerPage;
  const indexOfFirstRole = indexOfLastRole - skillsPerPage;
  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const currentSkills = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);
  const totalPages = Math.ceil(filteredRoles.length / skillsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="border p-4 rounded-lg">
      <h2 className="text-xl font-bold text-[#005151] relative mb-4 text-center sm:text-left">
        Role Details
        <span className="absolute bottom-[-8px] left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-[80px] h-[2px] bg-[#005151]"></span>
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
          <span>Add Role Details</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-200 w-full">
            <tr className="capitalize font-semibold">
              <th className="text-left p-3 text-gray-700 text-nowrap">
                Role Name
              </th>
              <th className="p-3 text-gray-700 text-nowrap">Created At</th>
              <th className="p-3 text-gray-700 text-nowrap">Action</th>
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
              currentSkills
                .slice(indexOfFirstRole, indexOfLastRole)
                .map((role) => (
                  <tr key={role._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 text-semibold text-gray-800 capitalize min-w-[180px]">
                      <div>{role.roleName}</div>
                    </td>

                    <td className="py-2 px-4 text-semibold text-gray-800 text-center">
                      {new Date(role.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-2 px-4  sm:px-6  flex justify-center  space-x-3">
                      <button
                        className="h-10 w-10"
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setSelectedRole(role);
                        }}
                      >
                        <img src="/assets/EditButton.svg" alt="Edit" />
                      </button>
                      <button
                        className="h-10 w-10"
                        onClick={() => {
                          setOpenDelete(true);
                          setSelectedRole(role);
                        }}
                      >
                        <img src="/assets/DeleteButton.svg" alt="Delete" />
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginate}
        setCurrentPage={setCurrentPage}
      />

      {isModalOpen && (
        <RoleAddModel
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          setRoles={setRoles}
        />
      )}

      {isEditModalOpen && (
        <RoleEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRole(null);
          }}
          selectedRole={selectedRole}
          fetchRoleData={getRoles}
        />
      )}

      {openDelete && (
        <DeleteModel
          closePopup={() => {
            setOpenDelete(false);
            setSelectedRole(null);
          }}
          onDelete={handleDelete}
          message={{
            title: "Delete Role?",
            sms: "Are you sure you want to delete this Role?",
          }}
        />
      )}
    </div>
  );
};

export default RoleManagement;
