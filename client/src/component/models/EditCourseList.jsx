import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loader from '../Loader'
import toast from 'react-hot-toast'
import { axiosInstance, endPoints } from '../../api/axios'

const EditCourseList = ({ isOpen, onClose, courseId, getCourses }) => {
  const [title, setTitle] = useState('')
  const [role, setRole] = useState('') 
  const [errors, setErrors] = useState({ title: '', role: '' })
  const [roles, setRoles] = useState([])
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    getRoles()
    setRole(courseId.roleId?._id)
    setTitle(courseId.courseType)
  }, [])

  const getRoles = async () => {
    try {
      const { data } = await axiosInstance.get(
        endPoints.roles.getAll
      )
      setRoles(data.data)
    } catch (error) {
      toast.error('Error ', error)
    }
  }

  const handleEditCourseList = async () => {
    const newErrors = { title: '', role: '' }

    if (!title) {
      newErrors.title = 'Title is required.'
    }

    if (!role) {
      newErrors.role = 'Role is required.'
    }

    setErrors(newErrors)
    try {
      setLoader(true)
      if (!newErrors.title && !newErrors.role) {
        const { data } = await axiosInstance.put(
          `${endPoints.courses.update}/${courseId._id}`,
          { courseType: title, roleId: role }
        )
        getCourses()
        onClose()
        toast.success("Course Updated Successfully.")
    }
    setLoader(false)
    } catch (error) {
      toast.error('Error ', error)
      setLoader(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] overflow-y-auto'>
      <div className='bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[90%] max-h-[90%] sm:w-[450px] lg:w-[400px] overflow-y-auto'>
        <h2 className='text-xl font-bold mb-4'>Add Course List</h2>

        <div className='mb-5'>
          {/* Course Role */}
          <div className='flex-1 min-w-[150px]'>
            <label className='block text-gray-700'>Course Role:</label>
            <div className='relative pt-2'>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className='w-full p-2 border border-gray-600 rounded-lg outline-none transition duration-200 hover:border-[#76a988] focus:border-[#6bcc8d] focus:ring focus:ring-[#4DC3AB] pr-10'
                style={{ height: '42px' }}
              >
                <option value=''>Select</option>
                {roles.map(role => (
                  <option value={role._id}>{role.roleName}</option>
                ))}
              </select>
              {errors.role && (
                <span className='text-red-500'>{errors.role}</span>
              )}
            </div>
          </div>

          {/* Course Title */}
          <div className='flex-1 min-w-[150px]'>
            <label className='block text-gray-700 pt-3'>Course Title:</label>
            <div className='relative pt-2'>
              <input
                type='text'
                placeholder='Enter Course Title'
                value={title}
                onChange={e => setTitle(e.target.value)}
                className='w-full px-4 py-2 border border-gray-600 rounded-lg outline-none transition duration-200 hover:border-[#76a988] focus:border-[#6bcc8d] focus:ring focus:ring-[#4DC3AB]'
              />
              {errors.title && (
                <span className='text-red-500'>{errors.title}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
          >
            {!loader ? 'Create' : <Loader />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditCourseList
