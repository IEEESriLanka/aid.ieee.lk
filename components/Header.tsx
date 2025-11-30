import React, { useState } from 'react';
import { FileText, Heart, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
             {/* Logo Image - Clickable link to IEEE.lk */}
             <a href="https://ieee.lk" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
                {/* PLACEHOLDER: Replace 'logo.png' with your actual image path */}
                <img 
                  src="./logo.png" 
                  alt="IEEE Sri Lanka Section" 
                  className="h-10 w-auto md:h-12 object-contain"
                />
             </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#summary" className="text-sm font-medium text-gray-600 hover:text-[#00629B] transition-colors">Summary</a>
            <a href="#breakdown" className="text-sm font-medium text-gray-600 hover:text-[#00629B] transition-colors">Breakdown</a>
            <a href="#transparency" className="text-sm font-medium text-gray-600 hover:text-[#00629B] transition-colors">Ledger</a>
            <a href="#impact" className="text-sm font-medium text-gray-600 hover:text-[#00629B] transition-colors">Impact</a>
            <a 
              href="#donate"
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-full shadow-lg text-white bg-red-600 hover:bg-red-700 hover:shadow-red-500/30 transition-all transform hover:-translate-y-0.5 animate-pulse"
            >
              Donate Now
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-lg animate-in slide-in-from-top-5 duration-200">
           <div className="px-4 pt-4 pb-6 space-y-2">
             <a href="#summary" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#00629B] hover:bg-gray-50">Summary</a>
             <a href="#breakdown" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#00629B] hover:bg-gray-50">Breakdown</a>
             <a href="#transparency" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#00629B] hover:bg-gray-50">Ledger</a>
             <a href="#impact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#00629B] hover:bg-gray-50">Impact</a>
             <div className="pt-4 mt-2 border-t border-gray-100">
               <a 
                 href="#donate" 
                 onClick={() => setIsMenuOpen(false)}
                 className="block w-full text-center px-5 py-3 border border-transparent text-base font-bold rounded-lg shadow text-white bg-red-600 hover:bg-red-700"
               >
                 Donate Now
               </a>
             </div>
           </div>
        </div>
      )}
    </header>
  );
};

export const Hero: React.FC = () => {
  return (
    <div className="bg-[#f8fafc] relative overflow-hidden py-12 sm:py-20">
      {/* Background decoration - Topographic Line Art */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="h-full w-full text-[#00629B]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 50 Q 25 30 50 50 T 100 50" fill="none" stroke="currentColor" strokeWidth="0.2"/>
            <path d="M0 60 Q 25 40 50 60 T 100 60" fill="none" stroke="currentColor" strokeWidth="0.2"/>
            <path d="M0 40 Q 25 20 50 40 T 100 40" fill="none" stroke="currentColor" strokeWidth="0.2"/>
            <path d="M0 70 Q 25 50 50 70 T 100 70" fill="none" stroke="currentColor" strokeWidth="0.2"/>
            <path d="M0 30 Q 25 10 50 30 T 100 30" fill="none" stroke="currentColor" strokeWidth="0.2"/>
            <path d="M0 80 Q 25 60 50 80 T 100 80" fill="none" stroke="currentColor" strokeWidth="0.2"/>
            <path d="M0 20 Q 25 0 50 20 T 100 20" fill="none" stroke="currentColor" strokeWidth="0.2"/>
            <path d="M20 100 Q 40 50 60 100" fill="none" stroke="currentColor" strokeWidth="0.2"/>
            <path d="M10 100 Q 30 60 50 100" fill="none" stroke="currentColor" strokeWidth="0.2"/>
            <path d="M80 0 Q 60 50 40 0" fill="none" stroke="currentColor" strokeWidth="0.2"/>
            <path d="M90 0 Q 70 40 50 0" fill="none" stroke="currentColor" strokeWidth="0.2"/>
            <circle cx="80" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <circle cx="20" cy="80" r="15" fill="none" stroke="currentColor" strokeWidth="0.2" />
        </svg>
      </div>

      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#00629B] ring-1 ring-inset ring-blue-700/10 mb-6 reveal">
          <span className="flex h-2 w-2 relative mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00629B]"></span>
          </span>
          Live Transparency Report
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6 reveal delay-100">
          Rebuilding with <span className="text-[#00629B]">Integrity</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto reveal delay-200">
          In response to Cyclone Ditwah, IEEE Sri Lanka Section is dedicated to full financial transparency. 
          Every donation is tracked, every expense is verified, and every outcome is reported here.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 reveal delay-300">
           <a href="#donate" className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-lg text-white bg-[#00629B] hover:bg-[#004e7a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
             Make a Donation
             <Heart className="w-4 h-4 ml-2 fill-current" />
           </a>
           <a href="#transparency" className="inline-flex items-center justify-center px-8 py-3.5 border border-gray-200 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:-translate-y-0.5">
             View Financial Ledger 
             <FileText className="w-4 h-4 ml-2"/>
           </a>
        </div>
      </div>
    </div>
  );
};
