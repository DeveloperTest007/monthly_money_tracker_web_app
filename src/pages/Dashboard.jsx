import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { RiAddLine } from 'react-icons/ri';
import TransactionForm from '../components/transactions/TransactionForm';
import { addTransaction, getTransactions } from '../services/transactionService';
import { getCategories } from '../services/categoryService';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Dashboard() {
  const { user } = useAuth();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, [user.uid]);

  const loadInitialData = async () => {
    try {
      setIsDashboardLoading(true);
      const [fetchedCategories, fetchedTransactions] = await Promise.all([
        getCategories(user.uid),
        getTransactions(user.uid)
      ]);
      setCategories(fetchedCategories);
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsDashboardLoading(false);
    }
  };

  const handleAddTransaction = async (transactionData) => {
    setIsLoading(true);
    try {
      await addTransaction(user.uid, transactionData);
      await loadInitialData(); // Refresh all data
      setShowTransactionForm(false);
    } catch (error) {
      setError('Failed to add transaction');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    return transactions.reduce((acc, transaction) => {
      const amount = Number(transaction.amount);
      switch (transaction.type) {
        case 'expense':
          acc.expenses += amount;
          acc.balance -= amount;
          break;
        case 'income':
          acc.income += amount;
          acc.balance += amount;
          break;
      }
      return acc;
    }, { expenses: 0, income: 0, balance: 0 });
  };

  const totals = calculateTotals();

  if (isDashboardLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative pb-20 sm:pb-0">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      <h1 className="text-3xl font-bold text-center">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-medium">Total Expenses</h3>
            <p className="text-2xl">${totals.expenses.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-medium">Total Income</h3>
            <p className="text-2xl">${totals.income.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <h3 className="font-medium">Balance</h3>
            <p className="text-2xl">${totals.balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setShowTransactionForm(true)}
        className="sm:hidden fixed right-4 bottom-4 z-10 w-14 h-14 rounded-full 
                 bg-blue-600 text-white shadow-lg hover:bg-blue-700 
                 flex items-center justify-center transition-transform 
                 active:scale-95"
        aria-label="Add Transaction"
      >
        <RiAddLine size={24} />
      </button>

      {/* Desktop Add Transaction Button */}
      <button
        onClick={() => setShowTransactionForm(true)}
        className="hidden sm:flex items-center gap-2 px-4 py-2 
                 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                 transition-colors ml-auto"
      >
        <RiAddLine size={20} />
        <span>Add Transaction</span>
      </button>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm
          categories={categories}
          onSubmit={handleAddTransaction}
          onClose={() => setShowTransactionForm(false)}
          isSubmitting={isLoading}
        />
      )}

      {/* Recent Transactions List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div className={`font-medium ${
                  transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {transaction.type === 'expense' ? '-' : '+'}${transaction.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
