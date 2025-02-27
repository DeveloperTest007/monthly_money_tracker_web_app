import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { getUserTransactions, addTransaction, getUserCategories } from '../services/firestoreService';
import TransactionForm from '../components/transactions/TransactionForm';
import PageLoading from '../components/common/PageLoading';
import { RiAddLine } from 'react-icons/ri';

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (user) {
          const [transactionsData, categoriesData] = await Promise.all([
            getUserTransactions(user.uid),
            getUserCategories(user.uid)
          ]);

          // Create a category lookup map
          const categoryMap = Object.fromEntries(
            categoriesData.map(cat => [cat.id, cat])
          );

          // Format transactions with category names and formatted dates
          const formattedTransactions = transactionsData.map(transaction => ({
            ...transaction,
            category: categoryMap[transaction.categoryId]?.name || 'Uncategorized',
            formattedDate: format(transaction.date, 'MMM dd, yyyy'),
            formattedAmount: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(transaction.amount)
          }));

          setTransactions(formattedTransactions);
          setCategories(categoriesData);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handleAddTransaction = async (transactionData) => {
    try {
      await addTransaction(user.uid, transactionData);
      const updatedTransactions = await getUserTransactions(user.uid);
      setTransactions(updatedTransactions);
      setShowForm(false);
    } catch (err) {
      setError('Failed to add transaction');
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 relative pb-20 sm:pb-0">
      {/* Header - Hide button on mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setShowForm(true)}
          className="hidden sm:block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </div>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setShowForm(true)}
        className="sm:hidden fixed right-4 bottom-4 z-10 w-14 h-14 rounded-full bg-blue-600 
                 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center
                 transition-transform active:scale-95"
        aria-label="Add Transaction"
      >
        <RiAddLine size={24} />
      </button>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          onSubmit={handleAddTransaction}
          onClose={() => setShowForm(false)}
          categories={categories}
        />
      )}

      {/* Main Content */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4">{transaction.formattedDate}</td>
                    <td className="px-6 py-4">{transaction.description}</td>
                    <td className="px-6 py-4">{transaction.category}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium
                      ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                      {transaction.type === 'expense' ? '- ' : '+ '}
                      {transaction.formattedAmount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-4">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="bg-gray-50 p-4 rounded-lg space-y-2 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{transaction.formattedDate}</span>
                    </div>
                  </div>
                  <p className={`font-medium whitespace-nowrap ${
                    transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'expense' ? '- ' : '+ '}
                    {transaction.formattedAmount}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              No transactions yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
