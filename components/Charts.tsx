import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, TransactionType } from '../types';

interface Props {
  transactions: Transaction[];
}

const COLORS = ['#00629B', '#0084d1', '#4dafe0', '#99d0ef', '#e6f2f9', '#FFBB28', '#FF8042'];

export const ExpenseBreakdown: React.FC<Props> = ({ transactions }) => {
  // Aggregate expenses by category
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
      <div className="flex justify-center items-center h-64 text-gray-400 reveal">
        No expense data available yet.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
          <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-[#00629B]">
            {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="breakdown" className="py-12 bg-white">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Utilization Breakdown</h2>
          
          {/* Increased gap from gap-4/md:gap-8 to gap-8/lg:gap-16 to fix clutter */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 items-center">
             <div className="lg:col-span-2 h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
             </div>
             
             <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
                <ul className="space-y-3">
                   {expenseData.map((item: any, idx: number) => (
                     <li key={idx} className="flex justify-between items-center text-sm">
                       <span className="flex items-center text-gray-600">
                         <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                         {item.name}
                       </span>
                       <span className="font-medium text-gray-900">
                          {new Intl.NumberFormat('en-LK', { notation: "compact", compactDisplay: "short" }).format(item.value)}
                       </span>
                     </li>
                   ))}
                </ul>
             </div>
          </div>
       </div>
    </div>
  );
};