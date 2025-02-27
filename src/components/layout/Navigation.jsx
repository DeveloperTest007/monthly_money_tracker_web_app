import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navigation() {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/transactions', label: 'Transactions' },
    { path: '/todos', label: 'Todo' }
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <span className="text-xl font-semibold">Expense Tracker</span>
            <div className="hidden md:flex space-x-4">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium
                    ${location.pathname === item.path
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
