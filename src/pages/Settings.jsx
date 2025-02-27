import { Outlet, useLocation } from 'react-router-dom';

function Settings() {
  const location = useLocation();
  const isSettingsRoot = location.pathname === '/settings';

  return (
    <div className="space-y-6">
      {isSettingsRoot ? (
        <>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <div className="bg-white rounded-lg shadow p-6">
            {/* Add settings root content here */}
            <p className="text-gray-600">Select a settings category from the sidebar.</p>
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
}

export default Settings;
