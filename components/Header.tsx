import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Heart, ArrowRight } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Campaign', path: '/impact' },
    { label: 'Live Ledger', path: '/ledger' }, // Direct link to page
    { label: 'Framework', path: '/operational-framework' },
    { label: 'Volunteers', path: '/volunteers' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
      if (path === '/' && location.pathname === '/' && !location.hash) return true;
      if (path !== '/' && location.pathname.startsWith(path)) return true;
      return false;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // Only intercept hash links on the homepage
    if (path.startsWith('/#')) {
        const [pathname, hash] = path.split('#');
        if (location.pathname === pathname || (pathname === '/' && location.pathname === '/')) {
            e.preventDefault();
            const targetId = hash;
            const element = document.getElementById(targetId);
            if (element) {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                window.history.pushState(null, '', path);
            }
        }
    }
    setIsOpen(false);
  };

  return (
    <>
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'pt-4' : 'pt-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className={`
                    mx-auto rounded-full px-6 py-3 flex items-center justify-between relative transition-all duration-300
                    ${scrolled 
                        ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border border-white/20 dark:border-slate-800' 
                        : 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-transparent'}
                `}>
                    
                    <Link to="/" className="flex items-center gap-3 group relative z-10 shrink-0">
                        <img src="/logo.png" alt="IEEE Sri Lanka Section" className="h-8 md:h-10 w-auto object-contain" />
                    </Link>

                    <div className="hidden lg:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        {navItems.map((item) => (
                            <Link 
                                key={item.label} 
                                to={item.path}
                                onClick={(e) => handleNavClick(e, item.path)}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                    ${isActive(item.path) 
                                        ? 'text-[#00629B] bg-blue-50 dark:bg-blue-900/20' 
                                        : 'text-gray-600 dark:text-gray-300 hover:text-[#00629B] hover:bg-white/50 dark:hover:bg-slate-800/50'}
                                `}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 relative z-10 shrink-0">
                        <button 
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                            aria-label="Toggle Theme"
                        >
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        <Link 
                            to="/donate" 
                            className={`hidden sm:inline-flex items-center px-6 py-2.5 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-500 bg-red-600 text-white hover:bg-red-700 animate-heartbeat`}
                        >
                            Donate Now <Heart className="w-4 h-4 ml-2 fill-current" />
                        </Link>

                        <button 
                            className="lg:hidden p-2 text-gray-600 dark:text-gray-300"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </nav>
            </div>
        </div>

        {isOpen && (
            <div className="fixed inset-0 z-40 lg:hidden pt-24 px-4 pointer-events-none">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" onClick={() => setIsOpen(false)}></div>
                <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-2 border border-white/20 dark:border-slate-700 animate-in slide-in-from-top-4 fade-in pointer-events-auto max-w-lg mx-auto">
                    <div className="flex flex-col">
                        {navItems.map((item) => (
                            <Link 
                                key={item.label} 
                                to={item.path}
                                onClick={(e) => handleNavClick(e, item.path)}
                                className={`px-6 py-4 rounded-2xl text-center text-base font-medium transition-colors ${isActive(item.path) ? 'bg-blue-50 dark:bg-blue-900/30 text-[#00629B] dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="h-px bg-gray-100 dark:bg-slate-800 my-2"></div>
                        <Link 
                            to="/donate"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center px-6 py-4 rounded-2xl bg-red-600 text-white font-bold text-base shadow-md mx-2 mb-2 animate-heartbeat"
                        >
                            <Heart className="w-5 h-5 mr-2 fill-current" />
                            Donate Now
                        </Link>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};

export const Hero: React.FC = () => {
    return (
        <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-36 overflow-hidden">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                 <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-900/30 text-[#00629B] dark:text-blue-400 text-[10px] sm:text-xs font-extrabold mb-10 border border-blue-100 dark:border-blue-800 uppercase tracking-widest animate-appear backdrop-blur-sm">
                     <span className="relative flex h-2 w-2 mr-3">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00629B]"></span>
                     </span>
                     Live Transparency Report
                 </div>
                 
                 <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0B1120] dark:text-white tracking-tighter mb-8 font-heading animate-slide-up-fast leading-[1.1] max-w-5xl mx-auto">
                    Rebuilding with <span className="text-[#00629B]">Integrity</span>
                 </h1>
                 
                 <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12 animate-slide-up-fast delay-100">
                    In response to Cyclone Ditwah, IEEE Sri Lanka Section is dedicated to full financial transparency. Every donation is tracked, every expense is verified, and every outcome is reported here.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-slide-up-fast delay-200">
                    <Link 
                        to="/donate" 
                        className="px-10 py-4 bg-[#00629B] text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-[#00629B] w-full sm:w-auto flex items-center justify-center group"
                    >
                        Make a Donation <Heart className="w-5 h-5 ml-2 fill-current" />
                    </Link>
                    <Link to="/ledger" className="px-10 py-4 bg-white dark:bg-slate-800 text-[#0B1120] dark:text-white border border-gray-200 dark:border-slate-700 rounded-full font-bold text-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700">
                        View Financial Ledger <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                 </div>
             </div>
        </section>
    );
};
