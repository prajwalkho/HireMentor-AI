import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../component/Loader";
import { axiosInstance, endPoints } from "../api/axios";

const ForgetPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!emailOrPhone) {
      newErrors.emailOrPhone = "Email or phone is required.";
    } else if (
      !/^\S+@\S+\.\S+$/.test(emailOrPhone) &&
      !/^\d{7,15}$/.test(emailOrPhone)
    ) {
      newErrors.emailOrPhone = "Enter a valid email or phone number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoader(true);
      try {
        const { data } = await axiosInstance.post(endPoints.auth.sendOtp, {
          email: emailOrPhone,
        });
        toast.success(data.message);
        setEmailOrPhone("");
        navigate("/auth/verify-otp", { state: { emailOrPhone } });
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage);
      } finally {
        setLoader(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-10 rounded-xl shadow-lg bg-white relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-xl"></div>

      {/* Content above overlay */}
      <h2 className="relative text-4xl font-extrabold mb-4 drop-shadow-lg text-center">
        <span className="text-red-500">Forget</span>{" "}
        <span className="text-blue-500">Password</span>
      </h2>
      <p className="relative mb-8 text-gray-700 text-center">
        Enter your email or phone number and we’ll send you an OTP to reset your password.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-6 relative">
          <label
            htmlFor="emailOrPhone"
            className="block mb-2 font-semibold text-gray-800"
          >
            Email or Phone <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="emailOrPhone"
            className={`w-full px-5 py-3 rounded-lg border-2 transition duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 ${
              errors.emailOrPhone
                ? "border-red-400 bg-red-50 text-red-700 placeholder-red-400"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
            }`}
            placeholder="Enter your email or phone"
            value={emailOrPhone}
            onChange={(e) => {
              setEmailOrPhone(e.target.value);
              if (errors.emailOrPhone) validate();
            }}
            autoComplete="email"
          />
          {errors.emailOrPhone && (
            <p className="mt-1 text-sm font-medium text-red-400">{errors.emailOrPhone}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loader}
          className={`w-full py-3 rounded-lg font-bold transition-colors duration-300 shadow-md ${
            loader
              ? "bg-green-600 text-white cursor-not-allowed opacity-70"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {loader ? <Loader /> : "Get OTP"}
        </button>
      </form>

      <p className="mt-8 relative text-center text-gray-600">
        Remembered?{" "}
        <Link to="/" className="underline font-semibold hover:text-gray-900">
          Back to Login
        </Link>
      </p>
    </div>
  );
};

export default ForgetPassword;
