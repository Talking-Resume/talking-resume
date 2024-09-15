import React from "react";

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative overflow-hidden">
        <div className="flex justify-between items-center border-b pb-3 px-6 pt-4">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition duration-150"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto p-6 max-h-[70vh]">{children}</div>
        <div className="flex justify-end px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;