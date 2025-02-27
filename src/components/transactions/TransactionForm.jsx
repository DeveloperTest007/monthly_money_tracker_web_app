import { useState, useMemo } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import LoadingSpinner from '../common/LoadingSpinner';

export default function TransactionForm({ onSubmit, onClose, categories, isSubmitting }) {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    categoryId: '',
    description: '',
    paymentMethod: 'cash',
    date: new Date().toISOString().split('T')[0]
  });

  // Filter categories based on transaction type with type safety
  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      const categoryType = category?.type?.toLowerCase() || 'expense';
      return categoryType === formData.type.toLowerCase() && category?.status !== 'inactive';
    });
  }, [categories, formData.type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryId && filteredCategories.length > 0) {
      setFormData(prev => ({ ...prev, categoryId: filteredCategories[0].id }));
    }
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  // Reset category when type changes
  const handleTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      type: e.target.value,
      categoryId: '' // Reset category selection
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-md">
            <div className="text-center space-y-3">
              <LoadingSpinner size="md" />
              <p className="text-sm text-gray-600">Processing transaction...</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add Transaction</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <RiCloseLine size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={formData.type}
              onChange={handleTypeChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="investment">Investment</option>
              <option value="savings">Savings</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select category</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name || 'Unnamed Category'}
                </option>
              ))}
            </select>
            {filteredCategories.length === 0 && (
              <p className="mt-1 text-sm text-red-500">
                No active categories found for {formData.type}. Please create a category first.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="block w-full pl-7 pr-12 rounded-md border border-gray-300 px-3 py-2"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || filteredCategories.length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Adding...</span>
                </div>
              ) : (
                'Add Transaction'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
