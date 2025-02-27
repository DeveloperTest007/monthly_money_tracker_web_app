import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getTodoHistory } from '../../services/firestoreService';
import { 
  RiTimeLine, 
  RiCheckLine, 
  RiLoader4Line, 
  RiCloseCircleLine 
} from 'react-icons/ri';

export default function TodoHistory({ userId, todoId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [todoId]);

  const loadHistory = async () => {
    try {
      const data = await getTodoHistory(userId, todoId);
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <RiTimeLine className="text-yellow-500" />;
      case 'processing': return <RiLoader4Line className="text-blue-500" />;
      case 'finished': return <RiCheckLine className="text-green-500" />;
      default: return <RiCloseCircleLine className="text-gray-400" />;
    }
  };

  if (loading) {
    return <div className="loading-spinner" />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Status History</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {history.map((item, index) => (
            <li key={item.id}>
              <div className="relative pb-8">
                {index < history.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    {getStatusIcon(item.toStatus)}
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        Changed from <span className="font-medium">{item.fromStatus || 'creation'}</span>
                        {' '}to{' '}
                        <span className="font-medium">{item.toStatus}</span>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {format(item.changedAt.toDate(), 'MMM d, yyyy HH:mm')}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
