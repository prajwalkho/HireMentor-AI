import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loader from '../Loader'
import toast from 'react-hot-toast'
import { axiosInstance, endPoints } from '../../api/axios'

const EditCourseInformation = ({ isOpen, onClose, courseInfo, getInfo }) => {
  const [title, setTitle] = useState('')
  const [role, setRole] = useState('')
  const [list, setList] = useState('')
  const [dis, setDis] = useState('')
  const [overview, setOverview] = useState('')
  const [image, setImage] = useState(null)
  const [errors, setErrors] = useState({
    title: '',
    role: '',
    list: '',
    overview: '',
    image: '',
    dis: ''
  })
  const [roles, setRoles] = useState([])
  const [courseList, setCourseList] = useState([])
  const [videoLinks, setVideoLinks] = useState([""]);
  const [studyMaterials, setStudyMaterials] = useState([{ title: "", link: "" }]);
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    getRoles()
    getListByRole(courseInfo.roleId._id)
    setRole(courseInfo.roleId._id)
    setList(courseInfo.courseId?._id)
    setTitle(courseInfo.title)
    setDis(courseInfo.description)
    setOverview(courseInfo.overview || '')
    setImage(courseInfo.courseImage || null)
    setVideoLinks(courseInfo.videoLinks?.length > 0 ? courseInfo.videoLinks : [""])
    setStudyMaterials(courseInfo.studyMaterials?.length > 0 ? courseInfo.studyMaterials : [{ title: "", link: "" }])
  }, [])

  const handleAddVideoLink = () => setVideoLinks([...videoLinks, ""]);
  const handleRemoveVideoLink = (index) => setVideoLinks(videoLinks.filter((_, i) => i !== index));
  const handleVideoLinkChange = (index, value) => {
    const newLinks = [...videoLinks];
    newLinks[index] = value;
    setVideoLinks(newLinks);
  };

  const handleAddStudyMaterial = () => setStudyMaterials([...studyMaterials, { title: "", link: "" }]);
  const handleRemoveStudyMaterial = (index) => setStudyMaterials(studyMaterials.filter((_, i) => i !== index));
  const handleStudyMaterialChange = (index, field, value) => {
    const newMaterials = [...studyMaterials];
    newMaterials[index][field] = value;
    setStudyMaterials(newMaterials);
  };

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

  const getList = async id => {
    try {
      const { data } = await axiosInstance.get(
        endPoints.courses.getAll
      )
      setCourseList(data.data)
      if (data.data?.length === 1) {
        setList(data.data[0]?._id)
      }
    } catch (error) {
      toast.error('Error ', error)
    }
  }

  const getListByRole = async id => {
    try {
      const { data } = await axiosInstance.get(
        `${endPoints.courses.getByRole}/${id}`
      )
      setCourseList(data.data)
      if (data.data?.length === 1) {
        setList(data.data[0]?._id)
      }
    } catch (error) {
      toast.error('Error ', error)
    }
  }

  const handleAddCourseList = async () => {
    const newErrors = {
      title: '',
      role: '',
      list: '',
      overview: '',
      image: '',
      dis: ''
    }

    if (!title) {
      newErrors.title = 'Title is required.'
    }
    if (!role) {
      newErrors.role = 'Role is required.'
    }
    if (!list) {
      newErrors.list = 'List is required.'
    }
    if (!overview) {
      newErrors.overview = 'Overview is required.'
    }
    if (!dis) {
      newErrors.dis = 'Description is required.'
    }

    setErrors(newErrors)

    if (
      !newErrors.title &&
      !newErrors.role &&
      !newErrors.list &&
      !newErrors.overview &&
      !newErrors.dis
    ) {
      const formData = new FormData()
      formData.append('courseId', list)
      formData.append('roleId', role)
      formData.append('title', title)
      formData.append('description', dis)
      formData.append('overview', overview)
      
      const validVideoLinks = videoLinks.filter(link => link.trim() !== "");
      const validStudyMaterials = studyMaterials.filter(mat => mat.title.trim() !== "" && mat.link.trim() !== "");
      
      formData.append("videoLinks", JSON.stringify(validVideoLinks));
      formData.append("studyMaterials", JSON.stringify(validStudyMaterials));

      if (image && typeof image !== 'string') {
        formData.append('courseImage', image)
      }

      try {
        setLoader(true)
        await axiosInstance.put(
          `${endPoints.courseInfo.update}/${courseInfo._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        getInfo()
        toast.success('Course Info Updated Successfully.')
        onClose()
        setLoader(false)
      } catch (error) {
        toast.error('Error updating course.', error)
        setLoader(false)
      }
    }
  }
  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] overflow-y-auto'>
      <div className='bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[90%] max-h-[90%] sm:w-[450px] lg:w-[400px] overflow-y-auto'>
        <h2 className='text-xl font-bold mb-4'>Edit Course Information</h2>

        <div className='mb-5'>
          {/* Course Role */}
          <div className='flex-1 min-w-[150px]'>
            <label className='block text-gray-700'>Course Role:</label>
            <div className='relative pt-2'>
              <select
                value={role}
                onChange={e => {
                  setRole(e.target.value)
                  getListByRole(e.target.value)
                }}
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

          {/* Course List */}
          <div className='flex-1 min-w-[150px]'>
            <label className='block text-gray-700 pt-3'>Course List:</label>
            <div className='relative pt-2'>
              <select
                value={list}
                onChange={e => {
                  setList(e.target.value)
                }}
                className='w-full p-2 border border-gray-600 rounded-lg outline-none transition duration-200 hover:border-[#76a988] focus:border-[#6bcc8d] focus:ring focus:ring-[#4DC3AB] pr-10'
                style={{ height: '42px' }}
              >
                <option value=''>Select</option>
                {courseList.map(course => (
                  <option value={course._id}>{course.courseType}</option>
                ))}
              </select>
              {errors.list && (
                <span className='text-red-500'>{errors.list}</span>
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

          <div className='flex-1 min-w-[150px]'>
            <label className='block text-gray-700 pt-3'>
              Upload Course Image:
            </label>
            <div className='relative pt-2'>
              <input
                type='file'
                onChange={handleImageChange}
                className='w-full px-4 py-2 border border-gray-600 rounded-lg outline-none transition duration-200 hover:border-[#76a988] focus:border-[#6bcc8d] focus:ring focus:ring-[#4DC3AB]'
              />
              {image && (
                <div className='mt-2 text-gray-600'>
                  {courseInfo.courseImage
                    ? `${courseInfo.courseImage.split('/').pop()}`
                    : 'No image selected'}
                </div>
              )}
              {errors.image && (
                <span className='text-red-500'>{errors.image}</span>
              )}
            </div>
          </div>

          <div className='flex-1 min-w-[150px]'>
            <label className='block text-gray-700 pt-3'>Course Overview:</label>
            <div className='relative pt-2'>
              <textarea
                type='text'
                placeholder='Enter Course Overview'
                value={overview}
                onChange={e => setOverview(e.target.value)}
                className='w-full h-[100px] px-4 py-2 border border-gray-600 rounded-lg outline-none transition duration-200 hover:border-[#76a988] focus:border-[#6bcc8d] focus:ring focus:ring-[#4DC3AB]'
              />
              {errors.overview && (
                <span className='text-red-500'>{errors.overview}</span>
              )}
            </div>
          </div>

          {/* Course Description */}
          <div className='flex-1 min-w-[150px]'>
            <label className='block text-gray-700 pt-3'>
              Course Description:
            </label>
            <div className='relative pt-2'>
              <textarea
                placeholder='Enter Course Description'
                value={dis}
                onChange={e => setDis(e.target.value)}
                className='w-full h-[150px] px-4 py-2 border border-gray-600 rounded-lg outline-none transition duration-200 hover:border-[#76a988] focus:border-[#6bcc8d] focus:ring focus:ring-[#4DC3AB]'
              />
              {errors.dis && <span className='text-red-500'>{errors.dis}</span>}
            </div>
          </div>

          {/* Video Links */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-gray-700 pt-3 font-semibold">Video Links:</label>
            {videoLinks.map((link, index) => (
              <div key={index} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Paste Video URL"
                  value={link}
                  onChange={(e) => handleVideoLinkChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-lg outline-none transition duration-200 hover:border-[#76a988] focus:border-[#6bcc8d] focus:ring focus:ring-[#4DC3AB]"
                />
                {videoLinks.length > 1 && (
                  <button onClick={() => handleRemoveVideoLink(index)} className="text-red-500 font-bold px-2">X</button>
                )}
              </div>
            ))}
            <button onClick={handleAddVideoLink} className="mt-2 text-sm text-[#005151] font-bold hover:underline">+ Add Link</button>
          </div>

          {/* Study Materials */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-gray-700 pt-3 font-semibold">Study Materials (PDF/Docs):</label>
            {studyMaterials.map((material, index) => (
              <div key={index} className="space-y-2 pt-2 border-b pb-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Material Title (e.g. Intro PDF)"
                    value={material.title}
                    onChange={(e) => handleStudyMaterialChange(index, "title", e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-600 rounded-lg outline-none"
                  />
                  {studyMaterials.length > 1 && (
                    <button onClick={() => handleRemoveStudyMaterial(index)} className="text-red-500 font-bold px-2">X</button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Material Link"
                  value={material.link}
                  onChange={(e) => handleStudyMaterialChange(index, "link", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg outline-none"
                />
              </div>
            ))}
            <button onClick={handleAddStudyMaterial} className="mt-2 text-sm text-[#005151] font-bold hover:underline">+ Add Material</button>
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
            onClick={handleAddCourseList}
          >
            {!loader ? 'Create' : <Loader />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditCourseInformation
