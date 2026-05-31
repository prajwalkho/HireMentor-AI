import React from "react";

const DeleteModel = ({ closePopup, onDelete, message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded-xl shadow-lg z-10 w-full max-w-96 mx-auto">
        <h2 className="text-xl font-semibold mb-5">{message?.title}</h2>
        <p className="text-sm text-[#A7A7A7]">{message?.sms}</p>
        <div className="flex mt-4">
          <button
            className="border w-full hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg mr-4"
            onClick={closePopup}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 w-full hover:bg-red-700 text-white py-2 px-4 rounded-lg"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModel;
