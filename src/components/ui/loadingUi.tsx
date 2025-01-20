import React from "react";

const LoadingUi = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 text-lg font-medium">
          Processing Payment...
        </p>
        <p className="text-gray-500 text-sm">Please do not close this window</p>
      </div>
    </div>
  );
};

export default LoadingUi;
