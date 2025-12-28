import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartsProps {
  transactions: Transaction[];
}

// Vibrant Palette matching the screenshot vibe
const COLORS = [
  '#00629B', // IEEE Blue (Food/Main)
  '#EF4444', // Red (Cleaning)
  '#10B981', // Emerald (Sanitation)
  '#F59E0B', // Amber (Stationery)
  '#8B5CF6', // Violet (Medical)
  '#EC4899', // Pink (Logistics)
  '#6366F1', // Indigo
  '#14B8A6'  // Teal
];

export const ExpenseBreakdown: React.FC<ChartsProps> = ({ transactions }) => {
  const { data, totalDebits } = useMemo(() => {
    const expenses = transactions.filter(t => t.type === TransactionType.DEBIT);
    const total = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    const categoryTotals: Record<string, number> = {};

    expenses.forEach(t => {
      // Normalize category names to Title Case for better display
      const catRaw = t.category.trim();
      const cat = catRaw.charAt(0).toUpperCase() + catRaw.slice(1).toLowerCase();
      categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
    });

    const chartData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ 
        name, 
        value,
        percentage: total > 0 ? (value / total) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value);

    return { data: chartData, totalDebits: total };
  }, [transactions]);

  if (data.length === 0) return null;

  return (
    <section className="py-12 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 p-8 md:p-12">
                
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white font-heading tracking-tight mb-4">Funds Utilization</h2>
                        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed font-normal">Transparent breakdown of every rupee spent.</p>
                    </div>
                    <div className="mt-6 md:mt-0 text-left md:text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Disbursed</p>
                        <p className="text-3xl font-mono font-bold text-[#00629B] dark:text-blue-400">
                            LKR {totalDebits.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Col: Donut Chart */}
                    <div className="h-[350px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={90} 
                                    outerRadius={140}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={COLORS[index % COLORS.length]} 
                                            className="hover:opacity-80 transition-opacity duration-300 cursor-pointer outline-none"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value: number) => `LKR ${value.toLocaleString()}`}
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                        borderRadius: '16px', 
                                        border: 'none', 
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                        padding: '12px 16px',
                                        color: '#1e293b'
                                    }}
                                    itemStyle={{ color: '#0f172a', fontWeight: '600' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Right Col: Detailed List */}
                    <div className="space-y-4">
                        {data.map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 hover:scale-[1.02] transition-transform duration-200">
                                <div className="flex items-center gap-4">
                                    {/* Color Indicator Bar */}
                                    <div 
                                        className="w-2 h-10 rounded-full" 
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></div>
                                    
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-base">
                                            {item.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                            {item.percentage.toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <p className="font-mono font-bold text-gray-900 dark:text-white">
                                        LKR {item.value.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};