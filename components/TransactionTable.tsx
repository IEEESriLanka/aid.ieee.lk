import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { Search, ExternalLink, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Props {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<Props> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  const downloadCSV = () => {
     // Simple client-side CSV export
     const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
     const csvContent = "data:text/csv;charset=utf-8," 
         + headers.join(",") + "\n"
         + filteredTransactions.map(e => `${e.date},"${e.description}",${e.category},${e.amount},${e.type}`).join("\n");
     
     const encodedUri = encodeURI(csvContent);
     const link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     link.setAttribute("download", "ieee_sl_relief_data.csv");
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
  };

  return (
    <div id="transparency" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Financial Ledger</h2>
            <p className="text-gray-500 text-sm mt-1">Full detailed history of all inputs and outputs.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
             <button onClick={downloadCSV} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
             </button>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search description..."
                  className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#00629B] focus:border-[#00629B] sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button 
                onClick={() => setFilterType('all')} 
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterType === 'all' ? 'bg-[#00629B] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
                All
            </button>
            <button 
                onClick={() => setFilterType(TransactionType.CREDIT)} 
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterType === TransactionType.CREDIT ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
                Received
            </button>
            <button 
                onClick={() => setFilterType(TransactionType.DEBIT)} 
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterType === TransactionType.DEBIT ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
                Spent
            </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (LKR)</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                         <div className="flex items-center">
                            {transaction.type === TransactionType.CREDIT ? (
                                <ArrowDownLeft className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            ) : (
                                <ArrowUpRight className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                            )}
                            {transaction.description}
                         </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.type === TransactionType.CREDIT ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.category}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                          transaction.type === TransactionType.CREDIT ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {transaction.type === TransactionType.CREDIT ? '+' : '-'} {new Intl.NumberFormat('en-LK').format(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        {transaction.proofLink ? (
                          <a href={transaction.proofLink} target="_blank" rel="noopener noreferrer" className="text-[#00629B] hover:text-[#004e7a]">
                            <ExternalLink className="w-4 h-4 mx-auto" />
                          </a>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))
              ) : (
                  <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                          No records found matching your criteria.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};