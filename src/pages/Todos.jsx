import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserTodos, addTodo } from '../services/firestoreService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { RiAddLine, RiCheckLine, RiTimeLine, RiLoader4Line } from 'react-icons/ri';
import PageLoading from '../components/common/PageLoading';

const PRIORITY_BADGES = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const STATUS_BADGES = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: RiTimeLine },
  processing: { color: 'bg-blue-100 text-blue-800', icon: RiLoader4Line },
  finished: { color: 'bg-green-100 text-green-800', icon: RiCheckLine }
};

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { user } = useAuth();

  const [newTodo, setNewTodo] = useState({
    title: '',
    dueDate: '',
    priority: 'medium',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const todosData = await getUserTodos(user.uid);
      setTodos(todosData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTodo(user.uid, {
        ...newTodo,
        dueDate: new Date(newTodo.dueDate).toISOString(), // Ensure proper date format
        reminderAt: newTodo.dueDate ? new Date(newTodo.dueDate).toISOString() : null
      });
      setShowAddForm(false);
      setNewTodo({
        title: '',
        dueDate: '',
        priority: 'medium',
        notes: ''
      });
      await loadData();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const formatDate = (date) => {
    try {
      return format(date instanceof Date ? date : new Date(date), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  if (loading) {
    return <PageLoading message="Loading tasks..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RiAddLine className="w-5 h-5 mr-2" />
          Add Task
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={newTodo.title}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="datetime-local"
                  required
                  value={newTodo.dueDate}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, priority: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={newTodo.notes}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, notes: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        <div className="divide-y divide-gray-200">
          {todos.map((todo) => {
            const StatusIcon = STATUS_BADGES[todo.status]?.icon || STATUS_BADGES.pending.icon;
            return (
              <div key={todo.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-lg ${STATUS_BADGES[todo.status].color}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {todo.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Due {formatDate(todo.dueDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_BADGES[todo.priority]}`}>
                      {todo.priority}
                    </span>
                  </div>
                </div>
                {todo.notes && (
                  <p className="mt-2 text-sm text-gray-600 pl-11">
                    {todo.notes}
                  </p>
                )}
              </div>
            );
          })}
          {todos.length === 0 && (
            <p className="p-4 text-center text-gray-500">No tasks yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
