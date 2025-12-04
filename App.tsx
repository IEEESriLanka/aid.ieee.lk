import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Home } from '@/pages/Home';
import { Donate } from '@/pages/Donate';
import { Ledger } from '@/pages/Ledger';
import { Campaign } from '@/pages/Campaign';
import { OperationalFramework } from '@/pages/OperationalFramework';
import { Volunteers } from '@/pages/Volunteers';
import { Transaction, ImpactStory, TransactionType } from '@/types';
import { fetchTransactions, fetchImpactStories } from '@/services/dataService';
import { Phone, ArrowUp, Globe, Facebook, Linkedin, Instagram } from 'lucide-react';
import { IEEE_BLUE } from '@/constants';

// RouteHandler to manage Scroll-to-Top and Reveal Animations on navigation
const RouteHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // Only scroll to top if there is NO hash. If there is a hash (anchors), browser handles it.
    if (!location.hash) {
      window.scrollTo(0, 0);
    }

    // Re-trigger animations
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      });

      const elements = document.querySelectorAll('.reveal');
      elements.forEach((el) => observer.observe(el));
      
      // Force check immediately
      elements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
              el.classList.add('active');
          }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);

  return null;
};

// Global Background Component - Dynamic Line Art
const GlobalBackground = React.memo(({ isDark }: { isDark: boolean }) => (
  <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#020617]' : 'bg-[#F8FAFC]'}`}>
    
    {/* Floating Orbs for depth */}
    <div className={`absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-3xl animate-float transition-colors duration-500 will-change-transform ${isDark ? 'bg-blue-900/10' : 'bg-blue-400/5'}`}></div>
    <div className={`absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-3xl animate-float transition-colors duration-500 will-change-transform ${isDark ? 'bg-[#00629B]/10' : 'bg-[#00629B]/5'}`} style={{ animationDelay: '2s' }}></div>

    {/* Moving Line Art - Topographic / Data Flow Style */}
    <svg className={`absolute w-[200%] h-full transition-opacity duration-500 ${isDark ? 'opacity-30' : 'opacity-60'}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={IEEE_BLUE} stopOpacity="0" />
                <stop offset="50%" stopColor={IEEE_BLUE} stopOpacity="0.8" />
                <stop offset="100%" stopColor={IEEE_BLUE} stopOpacity="0" />
            </linearGradient>
        </defs>
        
        {/* Slow drifting lines */}
        <path className="animate-drift-slow will-change-transform" fill="none" stroke="url(#lineGradient)" strokeWidth="2.5" 
              d="M0,200 Q400,100 800,250 T1600,150 T2400,250 T3200,150" />
        
        <path className="animate-drift-medium will-change-transform" fill="none" stroke="url(#lineGradient)" strokeWidth="2" 
              d="M0,400 Q300,450 600,350 T1200,450 T1800,350 T2400,450" style={{ opacity: 0.9 }} />
              
        <path className="animate-drift-slow will-change-transform" fill="none" stroke="url(#lineGradient)" strokeWidth="3" 
              d="M0,600 Q500,500 1000,650 T2000,550 T3000,650" style={{ animationDuration: '70s' }} />

        <path className="animate-drift-medium will-change-transform" fill="none" stroke="url(#lineGradient)" strokeWidth="2" 
              d="M0,800 Q400,750 800,850 T1600,750 T2400,850" style={{ animationDuration: '50s', opacity: 0.8 }} />
    </svg>
    
    {/* Gradient Overlay to fade lines at edges */}
    <div className={`absolute inset-0 bg-gradient-to-b transition-colors duration-500 ${isDark ? 'from-[#020617] via-transparent to-[#020617]/80' : 'from-white via-transparent to-white/60'}`}></div>
  </div>
));

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transData, impactData] = await Promise.all([
          fetchTransactions(),
          fetchImpactStories()
        ]);
        
        const sortedTrans = transData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTransactions(sortedTrans);
        setStories(impactData);
      } catch (error) {
        console.error("Error loading app data", error);
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };

    loadData();

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const summary = useMemo(() => {
    const totalCollected = transactions
      .filter(t => t.type === TransactionType.CREDIT)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalSpent = transactions
      .filter(t => t.type === TransactionType.DEBIT)
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      totalCollected,
      totalSpent,
      remainingBalance: totalCollected - totalSpent
    };
  }, [transactions]);

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#020617]' : 'bg-white'}`}>
         <GlobalBackground isDark={isDark} />
         <div className="relative z-10 flex flex-col items-center">
            {/* Futuristic Tech Loader */}
            <div className="relative w-32 h-32 mb-8">
               <div className="absolute inset-0 border-2 border-dashed border-[#00629B]/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
               <div className="absolute inset-2 border-2 border-transparent border-t-[#00629B] rounded-full animate-[spin_2s_linear_infinite]"></div>
               <div className="absolute inset-4 border-2 border-transparent border-b-[#00629B]/70 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#00629B] rounded-full shadow-[0_0_20px_#00629B] animate-pulse"></div>
                  <div className="absolute w-12 h-12 bg-[#00629B]/10 rounded-full animate-ping"></div>
               </div>
            </div>
            
            <h2 className="text-2xl font-bold text-[#00629B] font-heading mb-2 tracking-tight">IEEE Sri Lanka Section</h2>
            <p className="mt-2 text-xs font-bold tracking-[0.3em] uppercase text-gray-400 animate-pulse">Syncing Records...</p>
         </div>
      </div>
    );
  }

  return (
    <Router>
      <RouteHandler />
      <div className={`min-h-screen font-sans relative flex flex-col transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <GlobalBackground isDark={isDark} />
        
        {/* Content Container */}
        <div className="relative z-10 flex flex-col flex-grow w-full">
          <Header isDark={isDark} toggleTheme={toggleTheme} />
          
          <main className="flex-grow w-full">
            <Routes>
              {/* Main Homepage (Aggregate View) */}
              <Route path="/" element={<Home stories={stories} transactions={transactions} summary={summary} />} />
              
              {/* Specific Campaign Page (Detailed) */}
              <Route path="/2025-cyclone-ditwah" element={<Campaign stories={stories} />} />
              
              {/* Standalone Pages */}
              <Route path="/donate" element={<Donate />} />
              <Route path="/ledger" element={<Ledger transactions={transactions} summary={summary} />} />
              <Route path="/operational-framework" element={<OperationalFramework />} />
              <Route path="/volunteers" element={<Volunteers />} />
              
              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <footer className="bg-[#0B1120] text-gray-400 py-12 text-sm border-t border-gray-800 relative z-20 w-full mt-auto">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                   <div className="text-center md:text-left">
                      <p className="font-heading text-white text-lg mb-2">IEEE Sri Lanka Section</p>
                      <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
                      <p className="mt-2 text-gray-500">Transparency Report for Cyclone Ditwah Relief.</p>
                   </div>

                   <div className="flex flex-col items-center md:items-start">
                      <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-xs">For More Details Please Contact</h4>
                      <div className="space-y-2">
                         <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-blue-400"/>
                            <span>Kavinga Upul Ekanayaka: <a href="tel:+94716487689" className="text-gray-300 hover:text-white transition-colors">+94 71 648 7689</a></span>
                         </div>
                         <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-blue-400"/>
                            <span>Heshan Mallawaarachchi: <a href="tel:+94712462986" className="text-gray-300 hover:text-white transition-colors">+94 71 246 2986</a></span>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col items-center md:items-end gap-4">
                      <h4 className="text-white font-semibold uppercase tracking-wider text-xs">Connect With Us</h4>
                      <div className="flex gap-4">
                          <a href="https://www.facebook.com/IEEESriLanka/" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#00629B] text-gray-400 hover:text-white transition-all duration-300 group" aria-label="Facebook">
                              <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </a>
                          <a href="https://www.linkedin.com/company/ieee-sri-lanka-section/" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#0077b5] text-gray-400 hover:text-white transition-all duration-300 group" aria-label="LinkedIn">
                              <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </a>
                           <a href="https://www.instagram.com/ieeesrilanka/" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-pink-600 text-gray-400 hover:text-white transition-all duration-300 group" aria-label="Instagram">
                              <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </a>
                          <a href="https://ieee.lk" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-[#00629B] text-gray-400 hover:text-white transition-all duration-300 group" aria-label="Website">
                              <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </a>
                      </div>
                   </div>
                </div>
             </div>
          </footer>
        </div>

        {showScrollTop && (
          <button 
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-[#00629B] text-white rounded-full shadow-lg hover:bg-[#004e7a] transition-all duration-300 z-50 animate-in fade-in zoom-in hover:scale-110"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </Router>
  );
}

export default App;