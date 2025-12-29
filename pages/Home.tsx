import React, { useEffect } from 'react';
import { Hero } from '@/components/Header';
import { ImpactFeed } from '@/components/ImpactFeed';
import { DonationSection } from '@/components/DonationSection';
import { StatsCards } from '@/components/StatsCards';
import { ExpenseBreakdown } from '@/components/Charts';
import { TransactionTable } from '@/components/TransactionTable';
import { HomeNavigation } from '@/components/HomeNavigation';
import { ImpactMap } from '@/components/ImpactMap';
import { ImpactStory, Transaction, FinancialSummary } from '@/types';
import { MapPin, Activity } from 'lucide-react';

interface HomeProps {
  stories: ImpactStory[];
  transactions: Transaction[];
  summary: FinancialSummary;
}

export const Home: React.FC<HomeProps> = ({ stories, transactions, summary }) => {
  useEffect(() => {
    // Check if there is a hash to scroll to on load (e.g. from redirect)
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div>
      <HomeNavigation />
      
      <div id="hero">
        <Hero />
      </div>

      {/* Interactive Map Section - Blended & Visible */}
      <section className="py-12 md:py-20 relative z-10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Text Content - Aligned Left */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#00629B] dark:text-blue-300 text-xs font-bold uppercase tracking-widest mb-8 w-fit border border-blue-100 dark:border-blue-800/50">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00629B]"></span>
                        </span>
                        Live Operations
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white font-heading leading-tight mb-6">
                        Impact Across the Island
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-10 font-light">
                        We believe in radical transparency. Explore our interactive operations map to see exactly where aid is being delivered, from coastal relief centers to inland distribution points.
                    </p>

                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                                <MapPin className="w-5 h-5 text-[#00629B] dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{stories.length}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Locations</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700">
                            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-full">
                                <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">Active</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Status</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Visualization - Blended directly into background */}
                <div className="lg:col-span-7 relative w-full flex items-center justify-center">
                     <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center overflow-visible">
                        <ImpactMap stories={stories} />
                     </div>
                </div>
            </div>
         </div>
      </section>
      
      {/* ImpactFeed has internal id="impact" */}
      <ImpactFeed stories={stories} />
      
      {/* DonationSection has internal id="donate" */}
      <DonationSection />
      
      {/* StatsCards has internal id="summary" */}
      <StatsCards summary={summary} />

      <div id="breakdown">
          <ExpenseBreakdown transactions={transactions} />
      </div>

      <div id="transparency">
          <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
};
