import React, { useState } from "react";
import eyeSlash from "../../public/assets/eye-slash.svg";
import eye from "../../public/assets/eye.svg";
import DatePicker from "react-datepicker";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../component/Loader";
import { useNavigate } from "react-router-dom";
import { axiosInstance, endPoints } from "../api/axios";

const Registration = ({ setIsLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = "First Name is required";
    if (!lastName) newErrors.lastName = "Last Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!termsAccepted)
      newErrors.terms = "You must accept the terms and conditions.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      setLoader(true);

      const response = await axiosInstance.post(endPoints.auth.sendCode, {
        email,
      });
      if (response.status === 200) {
        toast.success("OTP has been resent successfully!");
        navigate("/auth/verify-otp", {
          state: {
            email,
            user: {
              first_Name: firstName,
              last_Name: lastName,
              email,
              password,
              birth_Date: dateOfBirth,
              gender,
              termsAccepted,
              Cpassword: confirmPassword,
              role: "user",
            },
          },
        });
      }

      setLoader(false);
      setIsLogin(true);
    } catch (error) {
      setLoader(false);
      console.error("Error in login:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
    setErrors({});
  };

  return (
    <form className="space-y-6 p-6 bg-gradient-to-br from-teal-50 to-white rounded-xl shadow-xl max-w-lg mx-auto border border-teal-200">
      <h2 className="text-3xl font-extrabold mb-4 text-center bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create Account
      </h2>

      <div className="flex gap-4">
        <div className="flex flex-col flex-1">
          <label className="mb-2 text-teal-600 font-semibold">First Name</label>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition duration-300 focus:ring-2 focus:ring-teal-400 outline-none ${
              errors.firstName
                ? "border-red-500 focus:ring-red-400"
                : "border-teal-300 focus:border-teal-500"
            }`}
          />
          {errors.firstName && (
            <p className="text-red-600 mt-1 text-sm">{errors.firstName}</p>
          )}
        </div>
        <div className="flex flex-col flex-1">
          <label className="mb-2 text-teal-600 font-semibold">Last Name</label>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition duration-300 focus:ring-2 focus:ring-teal-400 outline-none ${
              errors.lastName
                ? "border-red-500 focus:ring-red-400"
                : "border-teal-300 focus:border-teal-500"
            }`}
          />
          {errors.lastName && (
            <p className="text-red-600 mt-1 text-sm">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <label className="mb-2 text-teal-600 font-semibold">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border transition duration-300 focus:ring-2 focus:ring-teal-400 outline-none ${
            errors.email
              ? "border-red-500 focus:ring-red-400"
              : "border-teal-300 focus:border-teal-500"
          }`}
        />
        {errors.email && (
          <p className="text-red-600 mt-1 text-sm">{errors.email}</p>
        )}
      </div>

      <div className="flex flex-col relative">
        <label className="mb-2 text-teal-600 font-semibold">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition duration-300 focus:ring-2 focus:ring-teal-400 outline-none ${
              errors.password
                ? "border-red-500 focus:ring-red-400"
                : "border-teal-300 focus:border-teal-500"
            } pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-teal-500 hover:text-teal-700 transition"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <img
              src={showPassword ? eye : eyeSlash}
              alt={showPassword ? "Hide password" : "Show password"}
              width="20"
              height="20"
              className="pointer-events-none"
            />
          </button>
        </div>
        {errors.password && (
          <p className="text-red-600 mt-1 text-sm">{errors.password}</p>
        )}
      </div>

      <div className="flex flex-col relative">
        <label className="mb-2 text-teal-600 font-semibold">Confirm Password</label>
        <div className="relative">
          <input
            type={showSecondPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition duration-300 focus:ring-2 focus:ring-teal-400 outline-none ${
              errors.confirmPassword
                ? "border-red-500 focus:ring-red-400"
                : "border-teal-300 focus:border-teal-500"
            } pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowSecondPassword(!showSecondPassword)}
            className="absolute right-3 top-3 text-teal-500 hover:text-teal-700 transition"
            aria-label={showSecondPassword ? "Hide password" : "Show password"}
          >
            <img
              src={showSecondPassword ? eye : eyeSlash}
              alt={showSecondPassword ? "Hide password" : "Show password"}
              width="20"
              height="20"
              className="pointer-events-none"
            />
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-600 mt-1 text-sm">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col flex-1">
          <label className="mb-2 text-teal-600 font-semibold">Date Of Birth</label>
          <DatePicker
            selected={dateOfBirth}
            onChange={(date) => setDateOfBirth(date)}
            maxDate={new Date()}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select Date"
            className={`w-full px-4 py-3 rounded-lg border transition duration-300 focus:ring-2 focus:ring-teal-400 outline-none ${
              errors.dateOfBirth ? "border-red-500" : "border-teal-300"
            }`}
            style={{ height: "48px" }}
          />
          {errors.dateOfBirth && (
            <p className="text-red-600 mt-1 text-sm">{errors.dateOfBirth}</p>
          )}
        </div>
        <div className="flex flex-col flex-1">
          <label className="mb-2 text-teal-600 font-semibold">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition duration-300 focus:ring-2 focus:ring-teal-400 outline-none ${
              errors.gender ? "border-red-500" : "border-teal-300"
            }`}
            style={{ height: "48px" }}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-600 mt-1 text-sm">{errors.gender}</p>
          )}
        </div>
      </div>

      <label className="inline-flex items-center space-x-2 cursor-pointer mt-3 select-none">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="form-checkbox h-5 w-5 text-teal-600 rounded border-gray-300 focus:ring-teal-400"
        />
        <span className="text-red-700">
  I accept the{" "}
  <a
    href="/terms"
    className="text-red-600 hover:underline font-semibold"
  >
    Terms and Conditions
  </a>
</span>
      </label>
      {errors.terms && <p className="text-red-600 mt-1 text-sm">{errors.terms}</p>}

      <button
        type="button"
        onClick={handleRegister}
        disabled={loader}
        className="w-full mt-6 py-3 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-bold rounded-lg shadow-lg hover:from-teal-500 hover:to-teal-700 transition disabled:opacity-50"
      >
        {loader ? <Loader /> : "Register"}
      </button>
    </form>
  );
};

export default Registration;
