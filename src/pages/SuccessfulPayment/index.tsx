import React from "react";

const SuccessfulPayment: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Payment Successful 🎉</h1>
      <p className="text-lg mb-6">
        Your crypto payment was confirmed successfully.
      </p>
      <a
        href="/dashboard"
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Go to Dashboard
      </a>
    </div>
  );
};

export default SuccessfulPayment;