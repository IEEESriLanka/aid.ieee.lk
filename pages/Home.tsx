import React, { useEffect } from 'react';
import { Hero } from '@/components/Header';
import { ImpactFeed } from '@/components/ImpactFeed';
import { DonationSection } from '@/components/DonationSection';
import { StatsCards } from '@/components/StatsCards';
import { ExpenseBreakdown } from '@/components/Charts';
import { TransactionTable } from '@/components/TransactionTable';
import { HomeNavigation } from '@/components/HomeNavigation';
import { ImpactStory, Transaction, FinancialSummary } from '@/types';

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
      
      {/* ImpactFeed has internal id="impact" */}
      <ImpactFeed stories={stories} />
      
      <div id="donate">
        <DonationSection />
      </div>
      
      {/* Financial Sections broken down for Navigation targets */}
      <div id="summary">
          <StatsCards summary={summary} />
      </div>

      <div id="breakdown">
          <ExpenseBreakdown transactions={transactions} />
      </div>

      <div id="transparency">
          <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
};