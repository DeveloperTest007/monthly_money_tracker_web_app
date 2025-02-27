import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserCategories, addCategory } from '../services/firestoreService';
import { RiAddLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri';
import * as Icons from 'react-icons/ri';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PageLoading from '../components/common/PageLoading';

const CATEGORY_TYPES = [
  { value: 'expense', label: 'Expense', icon: <Icons.RiWalletLine className="w-5 h-5" /> },
  { value: 'income', label: 'Income', icon: <Icons.RiMoneyDollarCircleLine className="w-5 h-5" /> },
  { value: 'investment', label: 'Investment', icon: <Icons.RiLineChartLine className="w-5 h-5" /> },
  { value: 'savings', label: 'Savings', icon: <Icons.RiSafeLine className="w-5 h-5" /> }
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense' });
  const { user } = useAuth();

  useEffect(() => {
    loadCategories();
  }, [user]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getUserCategories(user.uid);
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addCategory(user.uid, newCategory);
      setNewCategory({ name: '', type: 'expense' });
      setIsAddingNew(false);
      await loadCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 transition-colors"
        >
          <RiAddLine className="mr-2" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {isAddingNew && (
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                         focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                value={newCategory.type}
                onChange={(e) => setNewCategory(prev => ({ ...prev, type: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                         focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700
                         hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md
                         hover:bg-blue-700 transition-colors"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200
                     hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className={`text-sm ${
                  category.type === 'income' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  onClick={() => handleEdit(category)}
                >
                  <RiEditLine size={20} />
                </button>
                <button
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  onClick={() => handleDelete(category.id)}
                >
                  <RiDeleteBinLine size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
