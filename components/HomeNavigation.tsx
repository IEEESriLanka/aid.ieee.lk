import React, { useEffect, useState } from 'react';
import { Home, Heart, Activity, PieChart, FileText } from 'lucide-react';

export const HomeNavigation = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show dock after scrolling down past the initial Hero view (e.g., 300px)
      // Hide dock when near the bottom (footer/ledger area) to prevent overlapping
      // Using 600px threshold to clear the footer comfortably
      const isPastHero = scrollY > 300;
      const isNearBottom = (scrollY + windowHeight) >= (documentHeight - 600);

      setIsVisible(isPastHero && !isNearBottom);

      // Detect active section for highlighting buttons
      // Included 'breakdown' (Charts) in the check list to map it to 'summary' button
      const sections = ['hero', 'impact', 'donate', 'summary', 'breakdown', 'transparency'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if element is roughly in the middle of the viewport
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            // Map breakdown (charts) to summary (stats) for UI simplicity
            if (section === 'breakdown') {
                setActiveSection('summary');
            } else {
                setActiveSection(section);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const NavButton = ({ id, active, onClick, icon, label }: any) => (
    <button
      onClick={onClick}
      className={`relative group p-3 rounded-full transition-all duration-300 ${
        active 
          ? 'bg-[#00629B] text-white shadow-lg shadow-blue-500/30 scale-110 -translate-y-1' 
          : 'text-gray-500 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-[#00629B] dark:text-gray-400 dark:hover:text-blue-400'
      }`}
      aria-label={label}
    >
      {icon}
      
      {/* Tooltip - Positioned above for horizontal dock */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900/90 backdrop-blur text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl">
        {label}
      </span>
    </button>
  );

  return (
    <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
      <div className="flex flex-row items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 rounded-full shadow-2xl ring-1 ring-black/5 hover:scale-[1.02] transition-transform duration-300">
        
        <NavButton 
          id="hero" 
          active={activeSection === 'hero'} 
          onClick={() => scrollTo('hero')} 
          icon={<Home className="w-5 h-5" />} 
          label="Top"
        />
        
        <div className="w-px h-6 bg-gray-300 dark:bg-slate-700 mx-1"></div>

        <NavButton 
          id="impact" 
          active={activeSection === 'impact'} 
          onClick={() => scrollTo('impact')} 
          icon={<Activity className="w-5 h-5" />} 
          label="Impact"
        />

        <NavButton 
          id="donate" 
          active={activeSection === 'donate'} 
          onClick={() => scrollTo('donate')} 
          icon={<Heart className="w-5 h-5" />} 
          label="Donate"
        />

        <NavButton 
          id="summary" 
          active={activeSection === 'summary'} 
          onClick={() => scrollTo('summary')} 
          icon={<PieChart className="w-5 h-5" />} 
          label="Stats"
        />

        <NavButton 
          id="transparency" 
          active={activeSection === 'transparency'} 
          onClick={() => scrollTo('transparency')} 
          icon={<FileText className="w-5 h-5" />} 
          label="Ledger"
        />
      </div>
    </div>
  );
};