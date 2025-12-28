import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '@/types';
import { Search, ExternalLink, Download, ArrowUpRight, ArrowDownLeft, Link as LinkIcon } from 'lucide-react';
import Papa from 'papaparse';

interface TransactionTableProps {
  transactions: Transaction[];
}

const CATEGORY_STYLES: Record<string, string> = {
  'MEDICAL': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
  'FOOD RELIEF': 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
  'LOGISTICS': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  'DONATION': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  'CLEANING': 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
  'DEFAULT': 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:border-slate-700'
};

const getCategoryStyle = (category: string) => {
  const upperCat = category.toUpperCase();
  // Simple keyword matching if exact match not found
  if (CATEGORY_STYLES[upperCat]) return CATEGORY_STYLES[upperCat];
  if (upperCat.includes('FOOD')) return CATEGORY_STYLES['FOOD RELIEF'];
  if (upperCat.includes('MED')) return CATEGORY_STYLES['MEDICAL'];
  if (upperCat.includes('LOGISTIC') || upperCat.includes('TRANSPORT')) return CATEGORY_STYLES['LOGISTICS'];
  if (upperCat.includes('DONAT')) return CATEGORY_STYLES['DONATION'];
  return CATEGORY_STYLES['DEFAULT'];
};

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const matchesFilter = filter === 'ALL' 
        ? true 
        : filter === 'CREDIT' ? t.type === TransactionType.CREDIT : t.type === TransactionType.DEBIT;
      
      const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) || 
                            t.category.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [transactions, filter, search]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    const csv = Papa.unparse(filteredData.map(t => ({
        Date: new Date(t.date).toLocaleDateString(),
        Description: t.description,
        Category: t.category,
        Type: t.type,
        Amount: t.amount,
        Proof: t.proofLink || ''
    })));
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'ieee_relief_ledger.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    // Section background is strictly transparent as requested
    // Added id="ledger" for anchor scrolling
    <section className="py-12 bg-transparent" id="ledger">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white font-heading tracking-tight mb-4">
                    Financial Ledger
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 font-normal">
                    A real-time, auditable record of every transaction.
                </p>
            </div>

            <div className="flex gap-3">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#00629B]" />
                    <input 
                        type="text" 
                        placeholder="Search ledger..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm w-full sm:w-64 focus:ring-2 focus:ring-[#00629B] focus:border-transparent outline-none transition-all shadow-sm"
                    />
                </div>
                <button 
                    onClick={handleExportCSV}
                    className="flex items-center px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                </button>
            </div>
        </div>

        {/* Filter Tabs - Specific Color Logic */}
        <div className="flex flex-wrap gap-2 mb-6">
            <button
                onClick={() => { setFilter('ALL'); setCurrentPage(1); }}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                    filter === 'ALL'
                    ? 'bg-[#00629B] text-white border-[#00629B] shadow-md'
                    : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
            >
                All Transactions
            </button>
            <button
                onClick={() => { setFilter('CREDIT'); setCurrentPage(1); }}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border flex items-center gap-2 ${
                    filter === 'CREDIT'
                    ? 'bg-green-600 text-white border-green-600 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-600'
                }`}
            >
                <ArrowDownLeft className="w-4 h-4" /> Incoming Funds
            </button>
            <button
                onClick={() => { setFilter('DEBIT'); setCurrentPage(1); }}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border flex items-center gap-2 ${
                    filter === 'DEBIT'
                    ? 'bg-red-600 text-white border-red-600 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600'
                }`}
            >
                <ArrowUpRight className="w-4 h-4" /> Outgoing Aid
            </button>
        </div>

        {/* Table Container - Filled White Background */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            {/* table-fixed and explicit percentage widths ensure stability when switching tabs */}
            <table className="w-full text-sm text-left table-fixed min-w-[800px]">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50/80 dark:bg-slate-800/80 border-b border-gray-100 dark:border-slate-800 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-5 font-bold tracking-wider w-[15%]">Date</th>
                  <th className="px-6 py-5 font-bold tracking-wider w-[40%]">Description</th>
                  <th className="px-6 py-5 font-bold tracking-wider w-[15%]">Category</th>
                  <th className="px-6 py-5 font-bold tracking-wider text-right w-[15%]">Amount (LKR)</th>
                  <th className="px-6 py-5 font-bold tracking-wider text-center w-[15%]">Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {paginatedData.map((t) => (
                  <tr key={t.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-5 text-gray-500 dark:text-gray-400 whitespace-nowrap font-mono text-xs truncate">
                      {new Date(t.date).toISOString().split('T')[0]}
                    </td>
                    
                    <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                            <div className={`mt-0.5 p-1.5 rounded-full flex-shrink-0 ${
                                t.type === TransactionType.CREDIT 
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                                {t.type === TransactionType.CREDIT 
                                    ? <ArrowDownLeft className="w-3 h-3" /> 
                                    : <ArrowUpRight className="w-3 h-3" />
                                }
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white leading-relaxed line-clamp-2" title={t.description}>
                                {t.description}
                            </span>
                        </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap ${getCategoryStyle(t.category)}`}>
                        {t.category}
                      </span>
                    </td>

                    <td className={`px-6 py-5 text-right font-mono font-bold whitespace-nowrap ${
                      t.type === TransactionType.CREDIT ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {t.type === TransactionType.CREDIT ? '+' : '-'} {t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="px-6 py-5 text-center">
                      {t.proofLink ? (
                        <a 
                          href={t.proofLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#00629B] dark:text-blue-400 hover:bg-[#00629B] hover:text-white dark:hover:bg-blue-400 dark:hover:text-slate-900 transition-all shadow-sm"
                          title="View Proof"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-gray-300 dark:text-slate-700">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                            <Search className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">No transactions found</p>
                            <p className="text-sm">Try adjusting your filters or search terms</p>
                        </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {filteredData.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/50">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-bold text-gray-900 dark:text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-bold text-gray-900 dark:text-white">{filteredData.length}</span> results
                </p>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    >
                        &lt;
                    </button>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    >
                        &gt;
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};