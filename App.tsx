import React, { useEffect, useState, useMemo } from 'react';
import { Header, Hero } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { DonationSection } from './components/DonationSection';
import { ExpenseBreakdown } from './components/Charts';
import { TransactionTable } from './components/TransactionTable';
import { ImpactFeed } from './components/ImpactFeed';
import { Transaction, ImpactStory, TransactionType } from './types';
import { fetchTransactions, fetchImpactStories } from './services/dataService';
import { Loader2, Phone, ArrowUp } from 'lucide-react';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transData, impactData] = await Promise.all([
          fetchTransactions(),
          fetchImpactStories()
        ]);
        
        // Sort transactions by date descending
        const sortedTrans = transData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTransactions(sortedTrans);
        setStories(impactData);
      } catch (error) {
        console.error("Error loading app data", error);
      } finally {
        setLoading(false);
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize Scroll Reveal Observer
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px" // Trigger slightly before element comes fully into view
    });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate Summary Stats from the raw data for integrity
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
         <Loader2 className="w-10 h-10 text-[#00629B] animate-spin mb-4" />
         <p className="text-gray-500 font-medium">Loading Transparency Report...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans relative">
      <Header />
      <main>
        <Hero />
        <DonationSection />
        <StatsCards summary={summary} />
        <ExpenseBreakdown transactions={transactions} />
        <TransactionTable transactions={transactions} />
        <ImpactFeed stories={stories} />
      </main>
      
      <footer className="bg-gray-900 text-gray-400 py-12 text-sm reveal">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
               {/* Column 1: Copyright */}
               <div className="text-center md:text-left">
                  <p>&copy; {new Date().getFullYear()} IEEE Sri Lanka Section. All rights reserved.</p>
                  <p className="mt-2 text-gray-500">Transparency Report for Cyclone Ditwah Relief.</p>
               </div>

               {/* Column 2: Emergency Contacts */}
               <div className="flex flex-col items-center md:items-start">
                  <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-xs">Emergency Contacts</h4>
                  <div className="space-y-2">
                     <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-blue-400"/>
                        <span>Upul: <a href="tel:+94716487689" className="text-gray-300 hover:text-white transition-colors">+94 71 648 7689</a></span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-blue-400"/>
                        <span>Heshan: <a href="tel:+94712462986" className="text-gray-300 hover:text-white transition-colors">+94 71 246 2986</a></span>
                     </div>
                  </div>
               </div>

               {/* Column 3: Links */}
               <div className="flex justify-center md:justify-end">
                  <a href="https://ieee.lk" target="_blank" rel="noreferrer" className="text-lg font-bold text-gray-300 hover:text-white transition-colors">
                     ieee.lk
                  </a>
               </div>
            </div>
         </div>
      </footer>

      {/* Go To Top Button */}
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
  );
}

export default App;