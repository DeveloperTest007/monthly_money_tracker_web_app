import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import PrivateRoute from './components/auth/PrivateRoute';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import Todos from './pages/Todos';



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected routes with sidebar layout */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/todos" element={<Todos />} />
              <Route path="/settings/*" element={<Settings />}>
                <Route path="categories" element={<Categories />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
