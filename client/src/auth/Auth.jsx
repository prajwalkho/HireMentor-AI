import React, { useState } from "react";
import Registration from "./Registration";
import Login from "./Login";

const LoginOrRegistration = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-lg w-full mx-auto mt-12 bg-white rounded-xl shadow-xl p-8 border border-gray-300">
      <nav className="flex justify-center space-x-12 mb-10 border-b-2 border-gray-200">
        <button
          className={`pb-3 text-3xl font-extrabold transition-colors duration-300 ${
            isLogin
              ? "text-teal-600 border-b-4 border-teal-600"
              : "text-gray-400 border-b-4 border-transparent"
          } hover:text-teal-700 hover:border-teal-700`}
          onClick={() => setIsLogin(true)}
          aria-current={isLogin ? "page" : undefined}
          type="button"
        >
          Login
        </button>
        <button
          className={`pb-3 text-3xl font-extrabold transition-colors duration-300 ${
            !isLogin
              ? "text-teal-600 border-b-4 border-teal-600"
              : "text-gray-400 border-b-4 border-transparent"
          } hover:text-teal-700 hover:border-teal-700`}
          onClick={() => setIsLogin(false)}
          aria-current={!isLogin ? "page" : undefined}
          type="button"
        >
          Registration
        </button>
      </nav>

      <div>{isLogin ? <Login /> : <Registration setIsLogin={setIsLogin} />}</div>
    </div>
  );
};

export default LoginOrRegistration;
