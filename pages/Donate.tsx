import React, { useEffect } from 'react';
import { DonationSection } from '@/components/DonationSection';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Donate: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 md:pt-36 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 animate-appear">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#00629B] transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        
        <div className="text-center max-w-3xl mx-auto mb-12">
           <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white font-heading mb-4 leading-tight">
             Support Our Relief Mission
           </h1>
           <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
             Your contribution directly impacts the lives of those affected by Cyclone Ditwah. 
             Please use the official bank details below to make your transfer, and remember to upload your proof of payment so we can maintain full transparency.
           </p>
        </div>
      </div>
      
      <DonationSection />
    </div>
  );
};