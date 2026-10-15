import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loader from '../../component/Loader';
import { axiosInstance, endPoints, getAssetUrl } from '../../api/axios';

const CandidateInformation = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const candidateId = params.get('id');
  const [loader, setLoader] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const formattedBirthDate = user.birth_Date ? user.birth_Date.split('T')[0] : '';
  
  // Handle both new uploads (blob URLs) and existing files (paths)
  const [previewProfile, setPreviewProfile] = useState(
  user?.profilePhoto
    ? typeof user.profilePhoto === 'object'
      ? getAssetUrl(user.profilePhoto.url)
      : getAssetUrl(user.profilePhoto)
    : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
);

  const [formData, setFormData] = useState({
    first_Name: user.first_Name || '',
    last_Name: user.last_Name || '',
    email: user.email || '',
    phoneNumber: '',
    gender: user.gender || '',
    birth_Date: formattedBirthDate || '',
    address: '',
    graduation: '',
    skill: [],
    file: null,
    profile: user.profilePhoto || '',
    role: ''
  });

  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [errors, setErrors] = useState({});
  const animatedComponents = makeAnimated();

  useEffect(() => {
    fetchRolesAndSkills();
    if (candidateId) {
      setIsEdit(true);
      candidateInfoById();
    }
  }, []);

  function formatDate(dateInput) {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const candidateInfoById = async () => {
    try {
      const response = await axiosInstance.get(
        `${endPoints.candidates.getById}/${candidateId}`
      );
      const candidate = response.data.data;
      const formatDated = formatDate(candidate.birth_Date);
      
      // Handle profile photo path
      const profilePhotoUrl = candidate.profile 
        ? candidate.profile.startsWith('profiles/')
          ? `/uploads/${candidate.profile}`
          : candidate.profile
        : '';

      setPreviewProfile(profilePhotoUrl);
      setSelectedFileName(candidate.file);

      setFormData({
        first_Name: candidate.first_Name,
        last_Name: candidate.last_Name,
        email: candidate.email,
        phoneNumber: candidate.phoneNumber,
        gender: candidate.gender,
        birth_Date: formatDated,
        address: candidate.address,
        graduation: candidate.graduation,
        skill: candidate.skill,
        file: candidate.file,
        profile: candidate.profile,
        role: candidate.role
      });
    } catch (error) {
      toast.error('Error fetching candidate data');
      console.error('Error:', error);
    }
  };

  const fetchRolesAndSkills = async () => {
    try {
      const [rolesResponse, skillsResponse] = await Promise.all([
        axiosInstance.get(`${endPoints.roles.getAll}`),
        axiosInstance.get(endPoints.skills.getAll)
      ]);

      setRoles(rolesResponse.data.data);
      setSkills(skillsResponse.data.skills.map(skill => ({
        value: skill.title,
        label: skill.title
      })));
    } catch (error) {
      toast.error('Failed to load roles and skills');
      console.error('Error:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_Name) newErrors.first_Name = 'First name is required';
    if (!formData.last_Name) newErrors.last_Name = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.birth_Date) newErrors.birth_Date = 'Date of birth is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.graduation) newErrors.graduation = 'Graduation is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (formData.skill.length === 0) newErrors.skill = 'At least one skill is required';
    if (!isEdit && !formData.file) newErrors.file = 'Resume is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (!file) return;

      // Validate file size and type
      if (name === "file") {
        if (file.size > 10 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, file: "File must be smaller than 10MB" }));
          return;
        }
        if (file.type !== "application/pdf") {
          setErrors(prev => ({ ...prev, file: "Please upload a PDF file" }));
          return;
        }
        setSelectedFileName(file.name);
      }

      if (name === "profile") {
        if (!file.type.startsWith("image/")) {
          setErrors(prev => ({ ...prev, profile: "Please upload an image file" }));
          return;
        }
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewProfile(reader.result);
        };
        reader.readAsDataURL(file);
      }

      setFormData(prev => ({ ...prev, [name]: file }));
      setErrors(prev => ({ ...prev, [name]: undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSkillsChange = selectedOptions => {
    setFormData(prev => ({
      ...prev,
      skill: selectedOptions.map(option => option.value)
    }));
    setErrors(prev => ({ ...prev, skill: undefined }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);
    setLoader(true);

    const formDataToSend = new FormData();
    
    // Append all non-file fields
    Object.keys(formData).forEach(key => {
      if (key !== 'file' && key !== 'profile' && key !== 'skill') {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Handle skills array
    formDataToSend.append('skill', JSON.stringify(formData.skill));

    // Handle file uploads
    if (formData.profile instanceof File) {
      formDataToSend.append('profile', formData.profile);
    }
    if (formData.file instanceof File) {
      formDataToSend.append('file', formData.file);
    }

    try {
      const url = isEdit
        ? `${endPoints.candidates.update}/${candidateId}`
        : endPoints.candidates.create;

      const method = isEdit ? 'put' : 'post';

      const response = await axiosInstance({
        method,
        url,
        data: formDataToSend,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(`Candidate ${isEdit ? 'updated' : 'created'} successfully!`);
      navigate('/user/schedule-interview');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit information');
    } finally {
      setIsSubmitting(false);
      setLoader(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6 mx-auto bg-white shadow-lg rounded-lg max-w-6xl">
      <h1 className="text-3xl font-bold text-[#005151] relative mb-8">
        {isEdit ? "Edit Candidate Information" : "Candidate Information"}
        <span className="absolute bottom-[-8px] left-0 w-[130px] h-[2px] bg-[#005151]"></span>
      </h1>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Profile Photo Section */}
        <div className="col-span-12 sm:col-span-3 flex flex-col items-center">
          <div className="relative w-40 h-40 rounded-full border-4 border-[#005151] overflow-hidden bg-gray-100">
            <label htmlFor="profile-upload" className="cursor-pointer w-full h-full">
              <img
                src={previewProfile}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                <svg className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </label>
            <input
              type="file"
              id="profile-upload"
              onChange={handleChange}
              name="profile"
              className="hidden"
              accept="image/*"
            />
          </div>
          {errors.profile && (
            <p className="mt-2 text-sm text-red-600">{errors.profile}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">Click to change photo</p>
        </div>

        {/* Form Fields */}
        <div className="col-span-12 sm:col-span-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#005151] border-b pb-2">Personal Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                name="first_Name"
                value={formData.first_Name}
                onChange={handleChange}
                className={`w-full rounded-lg border ${errors.first_Name ? 'border-red-500' : 'border-gray-300'} p-2 focus:ring-2 focus:ring-[#4DC3AB] focus:outline-none`}
                disabled
              />
              {errors.first_Name && <p className="mt-1 text-sm text-red-600">{errors.first_Name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                name="last_Name"
                value={formData.last_Name}
                onChange={handleChange}
                className={`w-full rounded-lg border ${errors.last_Name ? 'border-red-500' : 'border-gray-300'} p-2 focus:ring-2 focus:ring-[#4DC3AB] focus:outline-none`}
                disabled
              />
              {errors.last_Name && <p className="mt-1 text-sm text-red-600">{errors.last_Name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-2 focus:ring-2 focus:ring-[#4DC3AB] focus:outline-none`}
                disabled
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full rounded-lg border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} p-2 focus:ring-2 focus:ring-[#4DC3AB] focus:outline-none`}
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#005151] border-b pb-2">Additional Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full rounded-lg border ${errors.gender ? 'border-red-500' : 'border-gray-300'} p-2 focus:ring-2 focus:ring-[#4DC3AB] focus:outline-none`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                name="birth_Date"
                value={formData.birth_Date}
                onChange={handleChange}
                className={`w-full rounded-lg border ${errors.birth_Date ? 'border-red-500' : 'border-gray-300'} p-2 focus:ring-2 focus:ring-[#4DC3AB] focus:outline-none`}
              />
              {errors.birth_Date && <p className="mt-1 text-sm text-red-600">{errors.birth_Date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`w-full rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'} p-2 focus:ring-2 focus:ring-[#4DC3AB] focus:outline-none`}
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Graduation *</label>
              <input
                type="text"
                name="graduation"
                value={formData.graduation}
                onChange={handleChange}
                className={`w-full rounded-lg border ${errors.graduation ? 'border-red-500' : 'border-gray-300'} p-2 focus:ring-2 focus:ring-[#4DC3AB] focus:outline-none`}
              />
              {errors.graduation && <p className="mt-1 text-sm text-red-600">{errors.graduation}</p>}
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#005151] border-b pb-2">Professional Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full rounded-lg border ${errors.role ? 'border-red-500' : 'border-gray-300'} p-2 focus:ring-2 focus:ring-[#4DC3AB] focus:outline-none`}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role._id} value={role.roleName}>{role.roleName}</option>
                ))}
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills *</label>
              <Select
                isMulti
                options={skills}
                value={formData.skill.map(skill => ({ value: skill, label: skill }))}
                onChange={handleSkillsChange}
                className={`basic-multi-select ${errors.skill ? 'border-red-500' : ''}`}
                classNamePrefix="select"
                components={animatedComponents}
              />
              {errors.skill && <p className="mt-1 text-sm text-red-600">{errors.skill}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isEdit ? 'Update Resume' : 'Upload Resume *'}
              </label>
              <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.file ? 'border-red-500' : 'border-gray-300'}`}>
                <input
                  type="file"
                  id="resume-upload"
                  name="file"
                  onChange={handleChange}
                  accept="application/pdf"
                  className="hidden"
                />
                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    {selectedFileName || 'Click to upload resume (PDF only)'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
                </label>
              </div>
              {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center px-6 py-2 rounded-lg font-medium text-white ${isSubmitting ? 'bg-[#4DC3AB] opacity-70' : 'bg-[#005151] hover:bg-[#003d3d]'} transition-colors`}
        >
          {loader ? (
            <Loader />
          ) : isSubmitting ? (
            'Processing...'
          ) : isEdit ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Update Candidate
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Candidate
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CandidateInformation;