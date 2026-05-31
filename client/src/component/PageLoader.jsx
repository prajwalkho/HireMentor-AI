import React from "react";

const PageLoader = () => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: "-webkit-fill-available" }}
    >
      <div className="w-12 h-12 border-4 border-t-[#005151] border-gray-300 rounded-full animate-spin"></div>
    </div>
  );
};

export default PageLoader;
