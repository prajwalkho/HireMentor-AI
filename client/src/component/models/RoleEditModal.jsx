import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Loader from '../Loader'
import toast from 'react-hot-toast'
import { axiosInstance, endPoints } from '../../api/axios'

const RoleEditModal = ({ isOpen, onClose, selectedRole, fetchRoleData }) => {
  const [errors, setErrors] = useState({ role: '' })
  const [roleName, setRoleName] = useState(selectedRole.roleName || '')
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    if (selectedRole) {
      setRoleName(selectedRole.roleName)
    }
  }, [selectedRole])

  const handleEditCourseList = async () => {
    const newErrors = { role: '' }
    if (!roleName.trim()) {
      newErrors.role = 'Role name is required'
      setErrors(newErrors)
      return
    }

    setErrors(newErrors)

    try {
      setLoader(true)
      const response = await axiosInstance.put(
        `${endPoints.roles.update}/${selectedRole._id}`,
        { roleName }
      )

      if (response.data.success) {
        toast.success('Role updated successfully.', response.data)
        fetchRoleData()
        onClose()
      } else {
        toast.error('Failed to update role.')
        setErrors({ role: 'Failed to update role' })
      }
      setLoader(false)
    } catch (error) {
      setLoader(false)
      toast.error('Error updating role.', error)
      setErrors({ role: 'Error updating role' })
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] overflow-y-auto'>
      <div className='bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[90%] max-h-[90%] sm:w-[450px] lg:w-[400px] overflow-y-auto'>
        <h2 className='text-xl font-bold mb-4'>Edit Role</h2>

        <div className='mb-5'>
          <label className='block text-sm font-medium text-gray-700 mt-4 pb-2'>
            Role Name
          </label>
          <input
            type='text'
            placeholder='Role Name'
            value={roleName}
            onChange={e => setRoleName(e.target.value)}
            className='border border-gray-300 p-2 rounded w-full'
          />
          {errors.role && <p className='text-red-500 text-sm'>{errors.role}</p>}
        </div>
        <div className='flex gap-3'>
          <button
            className='bg-white border w-full border-gray-300 font-semibold text-gray-700 py-2 px-4 rounded-lg'
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 w-full rounded-lg bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] font-semibold border border-[#278a8a]`}
            onClick={handleEditCourseList}
            disabled={loader}
          >
            {!loader ? 'Edit' : <Loader />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoleEditModal
