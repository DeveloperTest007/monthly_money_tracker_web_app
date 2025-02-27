import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from './AuthLayout';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add validation for name
    if (formData.name.trim().length < 2) {
      return setError('Name must be at least 2 characters long');
    }
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }
    
    setError('');
    setLoading(true);

    try {
      const result = await signup(
        formData.email, 
        formData.password,
        formData.name.trim() // Ensure name is trimmed
      );
      
      if (!result?.profile?.userId) {
        throw new Error('Profile creation failed. Please try again.');
      }
      
      setUserId(result.profile.userId);
      
      // Show success message before redirecting
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err);
      setError(
        err.message === 'Failed to create profile: Missing or insufficient permissions'
          ? 'Unable to create account. Please try again later.'
          : err.message || 'Failed to create account'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to get started"
    >
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded animate-fade-in">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {userId && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4 rounded">
          <div className="flex flex-col space-y-1">
            <p className="text-green-700">Account created successfully!</p>
            <p className="text-green-700 font-mono">
              Your ID: <span className="font-bold">{userId}</span>
            </p>
            <p className="text-sm text-green-600">Redirecting to dashboard...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="loading-spinner mr-2" />
              <span>Setting up your account...</span>
            </div>
          ) : (
            'Sign Up'
          )}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default SignUp;
