import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction, TransactionType } from '../types';

interface Props {
  transactions: Transaction[];
}

// Updated Vibrant Multi-Color Palette
const COLORS = [
  '#00629B', // IEEE Blue
  '#EF4444', // Red
  '#10B981', // Emerald Green
  '#F59E0B', // Amber/Orange
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1'  // Indigo
];

export const ExpenseBreakdown: React.FC<Props> = React.memo(({ transactions }) => {
  const expenseData = transactions
    .filter(t => t.type === TransactionType.DEBIT)
    .reduce((acc: any, curr) => {
      const existing = acc.find((item: any) => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, [])
    .sort((a: any, b: any) => b.value - a.value);

  if (expenseData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 dark:text-gray-500 reveal">
        No expense data available yet.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-4 border border-gray-100 dark:border-slate-700 shadow-xl rounded-2xl">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{payload[0].name}</p>
          <p className="text-lg font-bold text-[#00629B] dark:text-blue-400 font-mono">
            {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const totalExpenses = expenseData.reduce((a: any, b: any) => a + b.value, 0);

  return (
    <div id="breakdown" className="py-24 transition-colors duration-500 bg-white dark:bg-[#020617] relative overflow-hidden">
       {/* Subtle background element */}
       <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50/50 dark:bg-slate-900/30 -skew-x-12 transform translate-x-20 pointer-events-none"></div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight font-heading">Funds Utilization</h2>
              <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Transparent breakdown of every rupee spent.</p>
            </div>
            <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Total Disbursed</p>
                <p className="text-2xl font-bold text-[#00629B] dark:text-blue-400 font-mono">
                    {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(totalExpenses)}
                </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
             {/* Chart Section */}
             <div className="lg:col-span-7 h-96 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={100}
                      outerRadius={150}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {expenseData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="stroke-white dark:stroke-[#020617] stroke-2 outline-none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             
             {/* Category Breakdown List */}
             <div className="lg:col-span-5 space-y-4">
                {expenseData.map((entry: any, index: number) => {
                    const percentage = ((entry.value / totalExpenses) * 100).toFixed(1);
                    return (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-12 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{entry.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{percentage}%</p>
                                </div>
                            </div>
                            <p className="font-mono font-bold text-gray-700 dark:text-gray-300 text-sm">
                                {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(entry.value)}
                            </p>
                        </div>
                    );
                })}
             </div>
          </div>
       </div>
    </div>
  );
});