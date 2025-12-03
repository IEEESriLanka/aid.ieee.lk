import React from 'react';
import { FinancialSummary } from '../types';
import { TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react';

interface Props {
  summary: FinancialSummary;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(amount);
};

export const StatsCards: React.FC<Props> = React.memo(({ summary }) => {
  return (
    <div id="summary" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Collected */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-900/5 dark:hover:shadow-black/20 transition-all duration-300 reveal group">
          <div className="flex items-start justify-between mb-8">
             <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
             </div>
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-transparent dark:border-green-800">
                <Activity className="w-3 h-3 mr-1" /> Live
             </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Funds Raised</p>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight font-heading">{formatCurrency(summary.totalCollected)}</p>
            <p className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium font-mono tracking-tight">100% Accounted For</p>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 flex flex-col justify-between hover:shadow-xl hover:shadow-red-900/5 dark:hover:shadow-black/20 transition-all duration-300 reveal delay-100 group">
          <div className="flex items-start justify-between mb-8">
             <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
             </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Disbursed</p>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight font-heading">{formatCurrency(summary.totalSpent)}</p>
             <p className="mt-3 text-sm text-red-500 dark:text-red-400 font-medium flex items-center">
                 Verified Aid Delivered
             </p>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-900/5 dark:hover:shadow-black/20 transition-all duration-300 reveal delay-200 group">
           <div className="flex items-start justify-between mb-8">
             <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
             </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Remaining Balance</p>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight font-heading">{formatCurrency(summary.remainingBalance)}</p>
            <p className="mt-3 text-sm text-orange-500 dark:text-orange-400 font-medium">Allocated for Rehab</p>
          </div>
        </div>

      </div>
    </div>
  );
});