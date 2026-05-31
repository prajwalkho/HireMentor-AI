import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../component/Loader";
import toast from "react-hot-toast";
import { axiosInstance, endPoints } from "../api/axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const validate = () => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters, with one uppercase letter, one number, and one special character.";
    }

    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords must match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoader(true);
        const response = await axiosInstance.post(
          endPoints.auth.resetPassword,
          { email, new_pass: password, confirm_pass: confirmPassword }
        );

        if (response.data.success) {
          toast.success("Password reset successfully! Please login again.");
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Error resetting password. Please try again.");
      } finally {
        setLoader(false);
      }
    }
  };

  const isFormValid =
    password && confirmPassword && Object.keys(errors).length === 0;

  return (
    <div className="max-w-lg w-full mx-auto mt-12 bg-white rounded-xl shadow-xl p-8 border border-gray-300">
      <h2 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
        Reset Password
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* New Password */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block font-semibold mb-2 bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent"
          >
            New Password <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) validate();
              }}
              className={`w-full px-4 py-3 rounded-lg border transition duration-200 outline-none pr-10 ${
                errors.password
                  ? "border-red-600"
                  : "border-gray-300 hover:border-teal-400 focus:border-teal-400 focus:ring focus:ring-teal-300"
              }`}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <img
                src={showPassword ? "/assets/eye.svg" : "/assets/eye-slash.svg"}
                alt=""
                width={20}
                height={20}
                className="pointer-events-none"
              />
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-8">
          <label
            htmlFor="confirmPassword"
            className="block font-semibold mb-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            Confirm Password <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) validate();
              }}
              className={`w-full px-4 py-3 rounded-lg border transition duration-200 outline-none pr-10 ${
                errors.confirmPassword
                  ? "border-red-600"
                  : "border-gray-300 hover:border-teal-400 focus:border-teal-400 focus:ring focus:ring-teal-300"
              }`}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              aria-label={
                showConfirmPassword ? "Hide confirm password" : "Show confirm password"
              }
            >
              <img
                src={
                  showConfirmPassword ? "/assets/eye.svg" : "/assets/eye-slash.svg"
                }
                alt=""
                width={20}
                height={20}
                className="pointer-events-none"
              />
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || loader}
          className={`w-full py-3 rounded-lg font-semibold transition duration-200 text-lg shadow-md ${
            isFormValid
              ? "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white hover:opacity-90"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loader ? <Loader /> : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
