import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import eyeSlash from "../../public/assets/eye-slash.svg";
import eye from "../../public/assets/eye.svg";
import toast from "react-hot-toast";
import Loader from "../component/Loader";
import { axiosInstance, endPoints } from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const newErrors = { email: "", password: "" };
    if (!email) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    if (!newErrors.email && !newErrors.password) {
      try {
        setLoader(true);
        const { data } = await axiosInstance.post(
          endPoints.auth.login,
          { email, password },
          { withCredentials: true }
        );
        toast.success(data.message);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setLoader(false);
        const { role } = data.user;
        if (role === "admin") navigate("/admin");
        else navigate("/user"); // user, recruiter, hiringmanager all use /user
      } catch (error) {
        setLoader(false);
        toast.error(
          error.response?.data?.message || error.message || "Something went wrong."
        );
      }
    }
  };

  return (
    <form className="space-y-6 bg-white p-10 rounded-3xl shadow-glass max-w-md mx-auto font-body">
      <h2 className="text-3xl font-heading font-bold text-brand-dark mb-8 text-center">
        Sign in to <span className="text-brand-accent">HireMentor AI</span>
      </h2>

      <div>
        <label htmlFor="email" className="block text-brand-dark font-semibold mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-5 py-3 rounded-xl border-2 focus:outline-none transition 
            ${errors.email ? "border-red-500" : "border-brand-light"} 
            focus:ring-2 focus:ring-brand-accent`}
        />
        {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-brand-dark font-semibold mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-5 py-3 rounded-xl border-2 pr-12 focus:outline-none transition 
              ${errors.password ? "border-red-500" : "border-brand-light"} 
              focus:ring-2 focus:ring-brand-accent`}
          />
          <img
            src={showPassword ? eye : eyeSlash}
            alt="Toggle password visibility"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer"
          />
        </div>
        {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-brand-dark select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="form-checkbox rounded border-brand-accent text-brand-accent focus:ring-0"
          />
          <span>Remember me</span>
        </label>
        <Link to="/auth/send-otp" className="text-pink-500 hover:underline font-semibold">
          Forgot password?
        </Link>
      </div>

      <button
        type="button"
        onClick={handleLogin}
        disabled={loader}
        className="w-full py-3 bg-brand-accent hover:bg-pink-500 text-white font-semibold rounded-xl transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loader ? <Loader /> : "Login"}
      </button>
    </form>
  );
};

export default Login;
