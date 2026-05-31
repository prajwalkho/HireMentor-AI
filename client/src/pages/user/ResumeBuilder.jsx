import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SkillSection from "../../component/SkillSection";
import Section from "../../component/ResumeBuilderSection";
import Loader from "../../component/Loader";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 20px rgba(0, 180, 180, 0.3)",
    transition: {
      duration: 0.3,
      yoyo: Infinity
    }
  },
  tap: {
    scale: 0.95
  }
};

const ResumeBuilder = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    location: "",
    gender: "",
    profile_photo: null,
    dateOfBirth: "",
    phone: "",
    email: "",
    website: "",
    objective: "",
    workExperience: [
      {
        company: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        location: "",
        description: ""
      }
    ],
    education: [
      {
        school: "",
        startDate: "",
        endDate: "",
        degree: "",
        cgpa: "",
        additionalInfo: "",
        location: ""
      }
    ],
    certificates: [{ name: "", location: "", startDate: "", endDate: "" }],
    projects: [{ projectName: "", date: "", description: "", url: "" }],
    languages: [{ name: "" }],
    interests: [{ name: "" }],
    skills: [{ name: "" }],
    featuredSkills: [{ name: "" }]
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profile_photo: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (index, field, section, value) => {
    setFormData((prev) => {
      const updatedArray = [...(prev[section] || [])];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      return { ...prev, [section]: updatedArray };
    });
  };

  const addSectionItem = (section, newItem) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeSectionItem = (section, index) => {
    const updatedArray = formData[section].filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, [section]: updatedArray }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.role.trim()) newErrors.role = "Professional role is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.gender.trim()) newErrors.gender = "Please select your gender";
    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone = "Please enter a valid 10-digit phone number";
    if (!formData.email.trim() || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.website.trim() || !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(formData.website))
      newErrors.website = "Please enter a valid website URL";
    if (!formData.objective.trim()) newErrors.objective = "Career objective is required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    setLoader(true);
    
    if (Object.keys(validationErrors).length === 0) {
      const filteredFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => {
          if (Array.isArray(value)) {
            return [
              key,
              value.filter((item) =>
                Object.values(item).some((field) => field && field.trim?.())
              )
            ];
          }
          return [key, value];
        })
      );

      navigate("/user/select-resume", {
        state: { formData: filteredFormData }
      });
    }
    setLoader(false);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-10 px-4 sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form
        className="mx-auto space-y-8 bg-white rounded-2xl p-6 sm:p-8 shadow-2xl max-w-6xl"
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          boxShadow: "0 20px 40px -10px rgba(0, 100, 100, 0.2)"
        }}
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 
            className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-400"
            data-aos="fade-down"
          >
            Professional Resume Builder
          </h1>
          <p className="text-gray-600" data-aos="fade-up" data-aos-delay="100">
            Craft your perfect resume in just a few simple steps
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-teal-400 to-cyan-300 rounded-full mx-auto mt-4" 
               data-aos="fade-up" data-aos-delay="200"></div>
        </motion.div>

        {/* Profile Section */}
        <motion.div 
          className="flex flex-col md:flex-row gap-8 items-start"
          variants={itemVariants}
          data-aos="fade-up"
        >
          {/* Profile Photo */}
          <motion.div 
            className="relative w-40 h-40 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center group overflow-hidden border-2 border-dashed border-cyan-200"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label
              htmlFor="profile_photo"
              className="cursor-pointer w-full h-full relative flex items-center justify-center"
            >
              {formData.profile_photo ? (
                <motion.img
                  src={URL.createObjectURL(formData.profile_photo)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <div className="text-center p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 mx-auto text-cyan-500 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="text-sm text-cyan-600 font-medium">Upload Photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm font-medium">Change Photo</span>
              </div>
            </label>
            <input
              id="profile_photo"
              type="file"
              name="profile_photo"
              className="hidden"
              accept=".png,.jpeg,.jpg"
              onChange={handleChange}
            />
          </motion.div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            {[
              {
                label: "Full Name",
                name: "name",
                placeholder: "John Doe",
                required: true,
                type: "text"
              },
              {
                label: "Professional Title",
                name: "role",
                placeholder: "Software Engineer",
                required: true,
                type: "text"
              },
              {
                label: "Location",
                name: "location",
                placeholder: "San Francisco, CA",
                required: true,
                type: "text"
              },
              {
                label: "Phone Number",
                name: "phone",
                placeholder: "(123) 456-7890",
                required: true,
                type: "tel"
              },
              {
                label: "Email Address",
                name: "email",
                placeholder: "john@example.com",
                required: true,
                type: "email"
              },
              {
                label: "Gender",
                name: "gender",
                placeholder: "Select gender",
                required: true,
                type: "select",
                options: ["", "Male", "Female", "Other", "Prefer not to say"]
              },
              {
                label: "Website/Portfolio",
                name: "website",
                placeholder: "https://yourportfolio.com",
                required: true,
                type: "url"
              }
            ].map((field, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    {field.options.map((option, i) => (
                      <option key={i} value={option.toLowerCase()}>
                        {option === "" ? "Select gender" : option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={field.name === "phone" ? (e) => {
                      const { value } = e.target;
                      if (/^\d{0,10}$/.test(value)) {
                        handleChange(e);
                      }
                    } : handleChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                  />
                )}
                {errors[field.name] && (
                  <motion.p 
                    className="text-red-500 text-xs mt-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors[field.name]}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Career Objective */}
        <motion.div variants={itemVariants} data-aos="fade-up">
          <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-2">
            Professional Summary
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            rows={4}
            placeholder="Briefly describe your professional background, skills, and career goals..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none"
          />
          {errors.objective && (
            <motion.p 
              className="text-red-500 text-xs mt-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.objective}
            </motion.p>
          )}
        </motion.div>

        {/* Main Sections */}
        <motion.div variants={containerVariants} className="space-y-8">
          {[
            {
              title: "Work Experience",
              icon: "💼",
              sectionKey: "workExperience",
              fields: [
                { name: "company", label: "Company Name" },
                { name: "jobTitle", label: "Job Title" },
                { name: "startDate", label: "Start Date", type: "date" },
                { name: "endDate", label: "End Date", type: "date" },
                { name: "location", label: "Location" },
                { name: "description", label: "Description", type: "textarea" }
              ],
              newItem: {
                company: "",
                jobTitle: "",
                startDate: "",
                endDate: "",
                location: "",
                description: ""
              }
            },
            {
              title: "Education",
              icon: "🎓",
              sectionKey: "education",
              fields: [
                { name: "school", label: "Institution" },
                { name: "degree", label: "Degree" },
                { name: "startDate", label: "Start Date", type: "date" },
                { name: "endDate", label: "End Date", type: "date" },
                { name: "cgpa", label: "GPA/Score" },
                { name: "additionalInfo", label: "Achievements", type: "textarea" },
                { name: "location", label: "Location" }
              ],
              newItem: {
                school: "",
                startDate: "",
                endDate: "",
                degree: "",
                cgpa: "",
                additionalInfo: "",
                location: ""
              }
            },
            {
              title: "Certifications",
              icon: "📜",
              sectionKey: "certificates",
              fields: [
                { name: "name", label: "Certificate Name" },
                { name: "location", label: "Issuing Organization" },
                { name: "startDate", label: "Date Earned", type: "date" },
                { name: "endDate", label: "Expiry Date", type: "date" }
              ],
              newItem: {
                name: "",
                location: "",
                startDate: "",
                endDate: ""
              }
            },
            {
              title: "Projects",
              icon: "🚀",
              sectionKey: "projects",
              fields: [
                { name: "projectName", label: "Project Name" },
                { name: "date", label: "Date Completed", type: "date" },
                { name: "description", label: "Description", type: "textarea" },
                { name: "url", label: "Project URL", type: "url" }
              ],
              newItem: {
                projectName: "",
                date: "",
                description: "",
                url: ""
              }
            }
          ].map((section, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <Section
                title={section.title}
                icon={section.icon}
                sectionKey={section.sectionKey}
                items={formData[section.sectionKey]}
                fields={section.fields}
                handleArrayChange={handleArrayChange}
                addSectionItem={() => addSectionItem(section.sectionKey, section.newItem)}
                removeSectionItem={(index) => removeSectionItem(section.sectionKey, index)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Skills Sections */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {[
            {
              title: "Languages",
              icon: "🌐",
              sectionKey: "languages",
              fields: [{ name: "name", label: "Language" }],
              newItem: { name: "" }
            },
            {
              title: "Interests",
              icon: "❤️",
              sectionKey: "interests",
              fields: [{ name: "name", label: "Interest/Hobby" }],
              newItem: { name: "" }
            },
            {
              title: "Technical Skills",
              icon: "🛠️",
              sectionKey: "skills",
              fields: [{ name: "name", label: "Skill" }],
              newItem: { name: "" }
            },
            {
              title: "Top Skills",
              icon: "⭐",
              sectionKey: "featuredSkills",
              fields: [{ name: "name", label: "Featured Skill" }],
              newItem: { name: "" }
            }
          ].map((section, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <SkillSection
                title={section.title}
                icon={section.icon}
                sectionKey={section.sectionKey}
                items={formData[section.sectionKey]}
                fields={section.fields}
                handleArrayChange={handleArrayChange}
                addSectionItem={() => addSectionItem(section.sectionKey, section.newItem)}
                removeSectionItem={(index) => removeSectionItem(section.sectionKey, index)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Submit Button */}
        <motion.div 
          className="flex justify-center mt-12"
          variants={itemVariants}
          data-aos="fade-up"
        >
          <motion.button
            type="submit"
            className="relative px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-semibold overflow-hidden group"
            disabled={loader}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="relative z-10 flex items-center">
              {!loader ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Generate My Resume
                </>
              ) : (
                <Loader />
              )}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default ResumeBuilder;