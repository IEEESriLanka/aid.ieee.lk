import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { Search, ExternalLink, Download, ArrowUpRight, ArrowDownLeft, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  transactions: Transaction[];
}

// Helper to assign consistent colors to categories
const getCategoryColor = (category: string) => {
  const normalized = category.toLowerCase().trim();
  if (normalized.includes('food') || normalized.includes('ration')) return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
  if (normalized.includes('med') || normalized.includes('health')) return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
  if (normalized.includes('transport') || normalized.includes('logistics')) return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
  if (normalized.includes('shelter') || normalized.includes('house')) return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
  if (normalized.includes('donation') || normalized.includes('fund')) return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
  return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600';
};

const ITEMS_PER_PAGE = 10;

export const TransactionTable: React.FC<Props> = React.memo(({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleTransactions = filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const downloadCSV = () => {
     const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
     const escapeCsvCell = (cell: string | number) => {
       const stringValue = String(cell);
       if (/^[=\+\-@]/.test(stringValue)) {
         return `"'${stringValue.replace(/"/g, '""')}"`;
       }
       if (stringValue.includes('"') || stringValue.includes(',')) {
         return `"${stringValue.replace(/"/g, '""')}"`;
       }
       return stringValue;
     };

     const rows = filteredTransactions.map(e => [
       escapeCsvCell(e.date),
       escapeCsvCell(e.description),
       escapeCsvCell(e.category),
       escapeCsvCell(e.amount),
       escapeCsvCell(e.type)
     ].join(","));

     const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
     const encodedUri = encodeURI(csvContent);
     const link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     link.setAttribute("download", "ieee_sl_relief_ledger.csv");
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
  };

  const getTabClass = (id: string) => {
    if (filterType !== id) {
        return 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300';
    }
    // Active states with specific colors
    if (id === TransactionType.CREDIT) return 'bg-green-600 text-white border-transparent shadow-md shadow-green-900/10';
    if (id === TransactionType.DEBIT) return 'bg-red-600 text-white border-transparent shadow-md shadow-red-900/10';
    return 'bg-[#00629B] text-white border-transparent shadow-md shadow-blue-900/10';
  };

  return (
    <div id="transparency" className="py-24 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight font-heading">Financial Ledger</h2>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">A real-time, auditable record of every transaction.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#00629B] dark:group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search ledger..."
                  className="block w-full sm:w-72 pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00629B]/20 dark:focus:ring-blue-500/30 focus:border-[#00629B] dark:focus:border-blue-500 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button 
                onClick={downloadCSV} 
                className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-200 dark:border-slate-700 shadow-sm text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:focus:ring-slate-700"
             >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
             </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {[
                { id: 'all', label: 'All Transactions' },
                { id: TransactionType.CREDIT, label: 'Incoming Funds' },
                { id: TransactionType.DEBIT, label: 'Outgoing Aid' }
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setFilterType(tab.id)} 
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap border ${getTabClass(tab.id)}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Ledger Table Container (Card Style) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-gray-200/40 dark:shadow-black/30 overflow-hidden border border-gray-100 dark:border-slate-700">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-700">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-900/50">
                  {/* Added fixed widths to columns to prevent jumping layout when filtering */}
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">Date</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[40%]">Description</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">Category</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[20%]">Amount (LKR)</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[10%]">Proof</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-50 dark:divide-slate-700">
                {visibleTransactions.length > 0 ? (
                    visibleTransactions.map((transaction) => {
                      const isCredit = transaction.type === TransactionType.CREDIT;
                      const badgeColor = getCategoryColor(transaction.category);
                      
                      return (
                      <tr key={transaction.id} className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group border-l-4 ${isCredit ? 'border-l-green-400' : 'border-l-red-400'}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400 font-mono">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                           <div className="flex items-center font-medium">
                              <div className={`p-1.5 rounded-full mr-3 ${
                                  isCredit ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {isCredit ? (
                                    <ArrowDownLeft className="w-3.5 h-3.5" />
                                ) : (
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                )}
                              </div>
                              {transaction.description}
                           </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wide border ${badgeColor}`}>
                            {transaction.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className={`text-sm font-bold font-mono tracking-tight ${
                                isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                                {isCredit ? '+' : '-'} {new Intl.NumberFormat('en-LK').format(transaction.amount)}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          {transaction.proofLink ? (
                            <a 
                                href={transaction.proofLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-700 text-[#00629B] dark:text-blue-400 border border-gray-200 dark:border-slate-600 hover:bg-[#00629B] hover:text-white hover:border-[#00629B] dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-200 shadow-sm"
                                title="View Receipt"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600">-</span>
                          )}
                        </td>
                      </tr>
                    )})
                ) : (
                    <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-gray-400 dark:text-gray-500 bg-gray-50/30 dark:bg-slate-900/30">
                            <div className="flex flex-col items-center justify-center">
                                <Filter className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-sm font-medium">No records found matching your criteria.</p>
                            </div>
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {filteredTransactions.length > 0 && (
              <div className="bg-gray-50 dark:bg-slate-800 px-6 py-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-medium text-gray-900 dark:text-white">{Math.min(filteredTransactions.length, startIndex + 1)}</span> to <span className="font-medium text-gray-900 dark:text-white">{Math.min(filteredTransactions.length, startIndex + ITEMS_PER_PAGE)}</span> of <span className="font-medium text-gray-900 dark:text-white">{filteredTransactions.length}</span> results
                  </span>
                  
                  <div className="flex items-center gap-2">
                      <button 
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous Page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 px-2">
                        Page {currentPage} of {Math.max(1, totalPages)}
                      </span>
                      
                      <button 
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages}
                        className="p-2 rounded-full border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next Page"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                  </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
});