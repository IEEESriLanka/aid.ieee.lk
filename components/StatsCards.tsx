import React from 'react';
import { FinancialSummary } from '../types';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface Props {
  summary: FinancialSummary;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(amount);
};

export const StatsCards: React.FC<Props> = ({ summary }) => {
  return (
    // Removed -mt-10 and added proper vertical spacing (my-12)
    <div id="summary" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Total Collected */}
        <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow reveal">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Funds Raised</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(summary.totalCollected)}</p>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>100% Accounted For</span>
            </div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <Wallet className="w-6 h-6 text-green-600" />
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow reveal delay-100">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Disbursed</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(summary.totalSpent)}</p>
            <div className="mt-2 flex items-center text-sm text-blue-600">
               <span>Aid Delivered</span>
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <TrendingDown className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow reveal delay-200">
          <div>
            <p className="text-sm font-medium text-gray-500">Remaining Balance</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(summary.remainingBalance)}</p>
             <div className="mt-2 flex items-center text-sm text-orange-600">
               <span>Allocated for Long-term Rehab</span>
            </div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <Wallet className="w-6 h-6 text-orange-600" />
          </div>
        </div>

      </div>
    </div>
  );
};