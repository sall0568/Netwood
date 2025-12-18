import React from "react";

const LoadingSpinner = ({ message = "Chargement..." }) => {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mb-4"></div>
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
