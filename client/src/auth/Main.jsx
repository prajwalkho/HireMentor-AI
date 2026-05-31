import React from "react";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gradient-to-tr from-blue-400 via-blue-500 to-blue-700 font-body">
      {/* Left Side: Content Area (Outlet) */}
      <div className="flex items-center justify-center lg:w-1/2 w-full px-4 py-8 lg:py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Right Side: Branding Text */}
      <div className="hidden lg:flex flex-col justify-center items-center lg:w-1/2 p-12 text-center text-white space-y-8">
        <h1 className="text-6xl font-heading font-extrabold drop-shadow-lg">
           <span className="text-pink-400">HireMentor </span>AI
        </h1>
        <p className="text-xl max-w-md mx-auto font-medium drop-shadow-md">
          Elevate your interview skills with cutting-edge AI-powered practice,
          tailored feedback, and personalized coaching — all in one place.
        </p>
        <button
          type="button"
          className="mt-6 px-10 py-3 rounded-full bg-pink-400 text-white text-lg font-semibold hover:bg-pink-500 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Main;
