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
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div>
      <div id="hero">
        <Hero />
      </div>
      <HomeNavigation />
      
      {/* Sections with IDs for scrolling */}
      <ImpactFeed stories={stories} />
      <DonationSection />
      <StatsCards summary={summary} />
      <ExpenseBreakdown transactions={transactions} />
      <TransactionTable transactions={transactions} />
    </div>
  );
};