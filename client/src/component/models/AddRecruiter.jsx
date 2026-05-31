import { format } from "date-fns";
import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import Loader from "../Loader";
import toast from "react-hot-toast";
import { axiosInstance, endPoints } from "../../api/axios";

const AddRecruiter = ({
  isOpen,
  onClose,
  recruiter,
  isEditing,
  fetchRecruiters,
}) => {
  const [formData, setFormData] = useState({
    profilePhoto: "",
    first_Name: "",
    last_Name: "",
    email: "",
    birth_Date: null,
    gender: "",
  });
  const [profilePicFileName, setProfilePicFileName] = useState("");
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (recruiter) {
      setFormData({
        profilePhoto: recruiter.userPhoto?.url || "",
        first_Name: recruiter.first_Name || "",
        last_Name: recruiter.last_Name || "",
        email: recruiter.email || "",
        birth_Date: recruiter.birth_Date
          ? new Date(recruiter.birth_Date)
          : null,
        gender: recruiter.gender || "",
      });
      if (recruiter.userPhoto?.url) {
        setProfilePicFileName(recruiter.userPhoto.url.split("/").pop());
      }
    }
  }, [recruiter]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFileName(file.name);
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profilePhoto: objectUrl,
      }));
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, birth_Date: date }));
    if (errors.birth_Date) {
      setErrors((prev) => ({ ...prev, birth_Date: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "first_Name",
      "last_Name",
      "email",
      "birth_Date",
      "gender",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace("_", " ")} is required`;
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "birth_Date" && value) {
        formDataToSend.append(key, format(value, "yyyy-MM-dd"));
      } else if (key === "gender") {
        formDataToSend.append(key, value.toLowerCase());
      } else if (value) {
        formDataToSend.append(key, value);
      }
    });

    if (fileInputRef.current?.files[0]) {
      formDataToSend.append("userPhoto", fileInputRef.current.files[0]);
    }

    try {
      setLoader(true);
      const url = isEditing
        ? `${endPoints.recruiters.update}/${recruiter._id}`
          : endPoints.recruiters.create;

      const response = await axiosInstance({
        method: isEditing ? "put" : "post",
        url,
        data: formDataToSend,
      });

      if (response.data.success) {
        toast.success(
          isEditing
            ? "Recruiter Updated Successfully"
            : "Recruiter Created Successfully"
        );
        fetchRecruiters();
        onClose();
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoader(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[450px] max-h-[90vh] overflow-y-auto">
        {/* Profile Picture Section */}
        <div className="flex items-center gap-4 mb-6">
          <img
            className="w-16 h-16 rounded-full object-cover border"
            src={
              formData.profilePhoto ||
              "https://www.cgg.gov.in/wp-content/uploads/2017/10/dummy-profile-pic-male1.jpg"
            }
            alt="Profile"
          />
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => fileInputRef.current.click()}
          >
            {profilePicFileName ? "Change Photo" : "Add Photo"}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".png,.jpeg,.jpg"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">First Name*</label>
              <input
                name="first_Name"
                type="text"
                className={`w-full border p-2 rounded ${
                  errors.first_Name ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.first_Name}
                onChange={handleChange}
              />
              {errors.first_Name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_Name}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Last Name*</label>
              <input
                name="last_Name"
                type="text"
                className={`w-full border p-2 rounded ${
                  errors.last_Name ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.last_Name}
                onChange={handleChange}
              />
              {errors.last_Name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_Name}</p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 mb-1">Email*</label>
            <input
              name="email"
              type="email"
              className={`w-full border p-2 rounded ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 mb-1">Date of Birth*</label>
            <DatePicker
              selected={formData.birth_Date}
              onChange={handleDateChange}
              maxDate={new Date()}
              dateFormat="dd-MM-yyyy"
              className={`w-full border p-2 rounded ${
                errors.birth_Date ? "border-red-500" : "border-gray-300"
              }`}
              placeholderText="Select Date"
            />
            {errors.birth_Date && (
              <p className="text-red-500 text-sm mt-1">{errors.birth_Date}</p>
            )}
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-gray-700 mb-1">Gender*</label>
            <select
              name="gender"
              className={`w-full border p-2 rounded ${
                errors.gender ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2 px-4 bg-[#e5f2ea] text-[#005151] rounded-lg border border-[#278a8a] hover:bg-[#d5e8dd]"
            onClick={handleSubmit}
            disabled={loader}
          >
            {loader ? (
              <Loader />
            ) : isEditing ? (
              "Update Recruiter"
            ) : (
              "Add Recruiter"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecruiter;
