import React from "react";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-20 shadow-lg rounded-lg">
        <h1 className="text-4xl font-semibold text-red-600">403</h1>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Forbidden</h2>
        <p className="mt-2 text-gray-500">
          You do not have permission to access this page.
        </p>
        <div className="mt-4">
          <a
            href="/"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
