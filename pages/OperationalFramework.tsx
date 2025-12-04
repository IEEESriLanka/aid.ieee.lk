import React from 'react';

export const OperationalFramework: React.FC = () => {
  return (
    <div className="pt-40 pb-20 min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="bg-blue-50 dark:bg-slate-800 p-6 rounded-full mb-6 animate-bounce">
        <svg className="w-12 h-12 text-[#00629B] dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-heading">Operational Framework</h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        The detailed operational guidelines and standard operating procedures (SOPs) for the Disaster Relief Fund will be published here soon.
      </p>
    </div>
  );
};