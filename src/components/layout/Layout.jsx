import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
