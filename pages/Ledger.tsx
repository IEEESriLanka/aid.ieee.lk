import React, { useEffect } from 'react';
import { StatsCards } from '@/components/StatsCards';
import { ExpenseBreakdown } from '@/components/Charts';
import { TransactionTable } from '@/components/TransactionTable';
import { Transaction, FinancialSummary } from '@/types';

interface LedgerProps {
  transactions: Transaction[];
  summary: FinancialSummary;
}

export const Ledger: React.FC<LedgerProps> = ({ transactions, summary }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 animate-appear">
        <div className="text-center max-w-3xl mx-auto">
           <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white font-heading mb-4">
             Financial Transparency
           </h1>
           <p className="text-lg text-gray-600 dark:text-gray-300">
             A live, auditable record of every rupee raised and disbursed. We believe in absolute integrity in our relief operations.
           </p>
        </div>
      </div>

      <StatsCards summary={summary} />
      <ExpenseBreakdown transactions={transactions} />
      <TransactionTable transactions={transactions} />
    </div>
  );
};