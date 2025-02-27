import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { createUserProfile } from '../services/firestoreService';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const signup = async (email, password, name) => {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create initial profile
      try {
        const profile = await createUserProfile(user.uid, {
          name,
          email,
          role: 'user',
          authId: user.uid, // Add auth ID to profile
          status: 'active'
        });

        return { user, profile };
      } catch (profileError) {
        console.error('Profile creation error:', profileError);
        // Delete the auth user if profile creation fails
        await user.delete();
        throw new Error('Failed to create user profile. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  async function login(email, password) {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function logout() {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await createUserProfile(currentUser.uid, {
          name: currentUser.displayName || '',
          email: currentUser.email,
          avatarUrl: currentUser.photoURL || ''
        });
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
