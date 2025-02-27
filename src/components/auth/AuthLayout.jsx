import PropTypes from 'prop-types';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/80">
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-600 p-3 rounded-xl shadow-blue-200 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Expense Tracker</h2>
            <p className="text-gray-500">Manage your finances wisely</p>
          </div>

          {/* Auth Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100/50">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600">{subtitle}</p>
            </div>
            <div className="space-y-6">
              {children}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired
};
