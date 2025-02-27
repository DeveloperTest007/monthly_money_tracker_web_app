import { useState } from 'react';
import { format } from 'date-fns';
import { updateTodoStatus } from '../../services/firestoreService';
import TodoHistory from './TodoHistory';

export default function TodoItem({ todo, userId }) {
  const [showHistory, setShowHistory] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await updateTodoStatus(userId, todo.id, todo.status, newStatus);
      // Trigger parent refresh if needed
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{todo.title}</h3>
          <p className="text-sm text-gray-500">{todo.notes}</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={todo.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className="rounded-md border-gray-300 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="finished">Finished</option>
          </select>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </div>
      </div>

      {showHistory && (
        <TodoHistory userId={userId} todoId={todo.id} />
      )}
    </div>
  );
}
