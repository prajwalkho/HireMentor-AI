import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../component/Loader";
import { axiosInstance, endPoints } from "../api/axios";

const OtpScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(180);
  const [loader, setLoader] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setOtpExpired(true);
      setErrorMessage("OTP has expired. Please resend the OTP.");
    }
  }, [timer]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < 5) inputRefs.current[index + 1].focus();
      if (value === "" && index > 0) inputRefs.current[index - 1].focus();
      if (errorMessage) setErrorMessage("");
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoader(true);
      const response = await axiosInstance.post(
        location.state.email ? endPoints.auth.sendCode : endPoints.auth.sendOtp,
        {
          email: location.state.email
            ? location.state.email
            : location.state.emailOrPhone,
        }
      );
      if (response.status === 200) {
        setOtp(["", "", "", "", "", ""]);
        setTimer(180);
        setOtpExpired(false);
        toast.success("OTP has been resent successfully!");
        setErrorMessage("");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to resend OTP.";
      toast.error(message);
      setErrorMessage(message);
    } finally {
      setLoader(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setErrorMessage("Please enter the complete OTP.");
      return;
    }
    if (otpExpired) {
      setErrorMessage("OTP has expired. Please resend the OTP.");
      return;
    }
    try {
      setLoader(true);
      const response = await axiosInstance.post(
        location.state.email ? endPoints.auth.verifyCode : endPoints.auth.verify,
        {
          otp: otpValue,
          email: location.state.email
            ? location.state.email
            : location.state.emailOrPhone,
        }
      );

      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        setErrorMessage("");
        setOtp(["", "", "", "", "", ""]);

        if (location.state.email) {
          const { data } = await axiosInstance.post(
            endPoints.auth.register,
            location.state.user
          );
          toast.success(data?.message);
          navigate("/");
        } else {
          navigate("/auth/reset-password", {
            state: { email: location.state?.emailOrPhone },
          });
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      setErrorMessage(message);
    } finally {
      setLoader(false);
    }
  };

  const isOtpValid = otp.every((digit) => digit.length === 1);

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 py-10">
      <div className="w-full max-w-lg p-10 bg-white shadow-2xl rounded-xl border border-gray-100">
        <h2 className="text-4xl font-extrabold mb-4 text-center bg-gradient-to-r from-red-500 via-orange-400 to-blue-500 bg-clip-text text-transparent drop-shadow">
          Enter OTP
        </h2>

        <p className="text-sm text-center text-gray-800 mb-6 font-medium">
          A 6-digit code was sent to{" "}
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent font-bold">
            {location.state?.email || location.state?.emailOrPhone}
          </span>
        </p>

        <div className="flex justify-center gap-3 mb-5">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              placeholder="0"
              className={`w-14 h-14 text-center text-xl font-bold rounded-lg border transition duration-200 shadow-sm focus:outline-none ${
                errorMessage
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-2 focus:ring-[#4DC3AB]"
              }`}
              onChange={(e) => handleOtpChange(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {errorMessage && (
          <p className="text-red-500 text-center text-sm mb-4 font-medium">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-between items-center mb-6 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            
            <span className="font-semibold text-[#FF8C00]">
              {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
            </span>
          </div>
          <button
            disabled={loader || (otpExpired === false && isResendDisabled)}
            onClick={handleResendOtp}
            className={`font-semibold ${
              loader || (otpExpired === false && isResendDisabled)
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#3B82F6] hover:underline"
            }`}
          >
            {loader ? "Resending..." : "Resend OTP"}
          </button>
        </div>

        <button
          disabled={!isOtpValid || loader || otpExpired}
          onClick={handleVerifyOtp}
          className={`w-full py-3 rounded-lg font-semibold text-lg shadow-md transition duration-200 ${
            isOtpValid && !otpExpired
              ? "bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white hover:opacity-90"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loader ? <Loader /> : "Verify"}
        </button>
      </div>
    </div>
  );
};

export default OtpScreen;
