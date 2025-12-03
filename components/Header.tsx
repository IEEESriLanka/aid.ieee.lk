import React, { useState } from 'react';
import { Menu, X, ArrowRight, Heart, Sun, Moon } from 'lucide-react';

interface Props {
  isDark: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<Props> = React.memo(({ isDark, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
    <header className="fixed top-4 left-0 right-0 z-50 transition-all duration-300 px-4">
      <div className={`max-w-7xl mx-auto backdrop-blur-xl border shadow-xl rounded-full px-6 sm:px-8 py-3 flex justify-between items-center relative transition-colors duration-300 ${
        isDark 
          ? 'bg-[#0f172a]/90 border-slate-700 shadow-black/20' 
          : 'bg-white/90 border-white/20 shadow-blue-900/5'
      }`}>
          
          <div className="flex items-center gap-4">
             <a href="https://ieee.lk" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity flex items-center gap-3 group">
                <img src="./logo.png" alt="IEEE Sri Lanka Section" className="h-10 w-auto object-contain" />
             </a>
          </div>
          
          <nav className="hidden md:flex gap-1 items-center">
            {['Summary', 'Breakdown', 'Ledger', 'Impact'].map((item) => (
                <a 
                    key={item} 
                    href={`#${item.toLowerCase()}`} 
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                        isDark 
                          ? 'text-gray-300 hover:text-white hover:bg-slate-800' 
                          : 'text-gray-600 hover:text-[#00629B] hover:bg-blue-50/50'
                    }`}
                >
                    {item}
                </a>
            ))}
            
            <div className={`w-px h-6 mx-2 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
            
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'text-yellow-400 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-100 hover:text-[#00629B]'
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <a 
              href="#donate"
              className="ml-2 inline-flex items-center px-6 py-2.5 text-sm font-bold rounded-full shadow-lg text-white bg-red-600 hover:bg-red-700 hover:shadow-red-500/20 transition-all transform hover:-translate-y-0.5 animate-heartbeat"
            >
              Donate Now
              <Heart className="w-4 h-4 ml-2 fill-current" />
            </a>
          </nav>

          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'text-yellow-400' : 'text-gray-600'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-full focus:outline-none transition-colors ${
                  isDark ? 'text-gray-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className={`md:hidden absolute top-full left-4 right-4 mt-2 backdrop-blur-xl border rounded-2xl shadow-2xl animate-in slide-in-from-top-5 duration-200 overflow-hidden ${
            isDark ? 'bg-[#0f172a]/95 border-slate-700' : 'bg-white/95 border-gray-100'
        }`}>
           <div className="px-4 pt-4 pb-6 space-y-1">
             {['Summary', 'Breakdown', 'Ledger', 'Impact'].map((item) => (
                <a 
                    key={item}
                    href={`#${item.toLowerCase()}`} 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`block px-4 py-3 rounded-xl text-base font-medium ${
                        isDark 
                          ? 'text-gray-300 hover:text-white hover:bg-slate-800' 
                          : 'text-gray-700 hover:text-[#00629B] hover:bg-blue-50'
                    }`}
                >
                    {item}
                </a>
             ))}
             <div className={`pt-4 mt-2 border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
               <a 
                 href="#donate" 
                 onClick={() => setIsMenuOpen(false)}
                 className="flex items-center justify-center w-full px-5 py-3 text-base font-bold rounded-xl shadow-md text-white bg-red-600 hover:bg-red-700 animate-heartbeat"
               >
                 Donate Now
                 <Heart className="w-4 h-4 ml-2 fill-current" />
               </a>
             </div>
           </div>
        </div>
      )}
    </header>
    </>
  );
});

export const Hero: React.FC = React.memo(() => {
  return (
    <div className="relative overflow-hidden pt-40 pb-24 sm:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold ring-1 shadow-sm mb-8 reveal hover:shadow-md transition-all cursor-default backdrop-blur-sm bg-white/80 text-[#00629B] ring-[#00629B]/20 dark:bg-slate-800/80 dark:text-blue-400 dark:ring-blue-400/30">
          <span className="flex h-3 w-3 relative mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00629B] opacity-75 dark:bg-blue-400"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00629B] dark:bg-blue-400"></span>
          </span>
          Live Transparency Report
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 reveal delay-100 font-heading leading-tight whitespace-normal sm:whitespace-nowrap text-gray-900 dark:text-white">
          Rebuilding with <span className="text-[#00629B] dark:text-blue-400">Integrity</span>
        </h1>
        
        <p className="text-lg sm:text-xl font-normal leading-relaxed mb-10 max-w-3xl mx-auto reveal delay-200 text-gray-600 dark:text-gray-300">
          In response to Cyclone Ditwah, IEEE Sri Lanka Section is dedicated to full financial transparency. Every donation is tracked, every expense is verified, and every outcome is reported here.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-5 reveal delay-300">
           <a 
            href="#donate" 
            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-[#00629B] hover:bg-blue-800 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1"
           >
             Make a Donation
             <Heart className="w-5 h-5 ml-2 fill-current" />
           </a>
           <a 
            href="#transparency" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold transition-all duration-200 border rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 hover:shadow-lg hover:-translate-y-1 bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-[#00629B] dark:bg-slate-800 dark:text-gray-200 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-blue-400 dark:focus:ring-slate-700"
           >
             View Financial Ledger 
             <ArrowRight className="w-5 h-5 ml-2" />
           </a>
        </div>
      </div>
    </div>
  );
});