import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  RiDashboardLine,
  RiWalletLine,
  RiSettings4Line,
  RiArrowRightSLine,
  RiLogoutBoxRLine,
  RiFolder2Line,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiMenuLine,
  RiCloseLine
} from 'react-icons/ri';

const menuItems = [
  { path: '/', icon: <RiDashboardLine size={20} />, label: 'Dashboard' },
  { path: '/transactions', icon: <RiWalletLine size={20} />, label: 'Transactions' },
  { path: '/todos', icon: <RiWalletLine size={20} />, label: 'Todos' },
  { 
    path: '/settings', 
    icon: <RiSettings4Line size={20} />, 
    label: 'Settings',
    submenu: [
      { 
        path: '/settings/categories', 
        icon: <RiFolder2Line size={18} />, 
        label: 'Categories' 
      }
    ]
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const { user, logout } = useAuth();

  // Add scroll listener for floating button
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileMenu = () => setIsMobileOpen(false);

  const toggleSubmenu = (path) => {
    setOpenSubmenu(openSubmenu === path ? null : path);
  };

  return (
    <>
      {/* Floating Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className={`
          lg:hidden fixed z-40 rounded-full shadow-lg p-3
          transition-all duration-300 ease-in-out
          ${showFloatingButton ? 'bottom-6 right-6' : 'top-4 left-4'}
          ${isMobileOpen ? 'bg-gray-100' : 'bg-white'}
        `}
      >
        {isMobileOpen ? (
          <RiCloseLine size={24} className="text-gray-700" />
        ) : (
          <RiMenuLine size={24} className="text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay with improved touch feedback */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-800/40 backdrop-blur-sm z-40
                     active:bg-gray-800/50 transition-colors duration-300"
          onClick={closeMobileMenu}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col w-[280px] lg:w-auto
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 ease-in-out
        shadow-lg lg:shadow-none
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
      `}>
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Header with improved toggle button */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
          {!isCollapsed && (
            <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 
                         bg-clip-text text-transparent truncate">
              Expense Tracker
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg
                     hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <RiMenuUnfoldLine size={20} className="text-gray-600" />
            ) : (
              <RiMenuFoldLine size={20} className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Profile section with mobile optimization */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-blue-400
                           flex items-center justify-center text-white font-medium">
                {user?.email?.[0].toUpperCase()}
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation with touch-friendly targets */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.path}>
              {item.submenu ? (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleSubmenu(item.path)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm
                      transition-all duration-200
                      ${openSubmenu === item.path 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 flex-1 text-left">{item.label}</span>
                        <RiArrowRightSLine className={`w-5 h-5 transition-transform duration-200
                          ${openSubmenu === item.path ? 'rotate-90' : ''}`} />
                      </>
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {openSubmenu === item.path && !isCollapsed && (
                    <div className="ml-4 space-y-1">
                      {item.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          onClick={closeMobileMenu}
                          className={({ isActive }) => `
                            flex items-center px-3 py-2 rounded-lg text-sm
                            transition-all duration-200
                            ${isActive 
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}
                          `}
                        >
                          <span className="flex-shrink-0">{subItem.icon}</span>
                          <span className="ml-3">{subItem.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) => `
                    flex items-center px-3 py-3 rounded-lg text-sm
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}
                  `}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* Footer with larger touch targets */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => {
              closeMobileMenu();
              logout();
            }}
            className="w-full flex items-center px-3 py-3 rounded-lg text-sm
                     text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30
                     hover:text-red-600 dark:hover:text-red-400
                     transition-all duration-200"
          >
            <RiLogoutBoxRLine size={20} />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
