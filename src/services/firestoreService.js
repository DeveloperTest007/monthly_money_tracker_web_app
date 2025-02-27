import { db } from '../config/firebase';
import { 
  doc, setDoc, getDoc, collection, query, 
  where, orderBy, getDocs, addDoc, serverTimestamp, deleteDoc, updateDoc, writeBatch 
} from 'firebase/firestore';

// Helper function to convert Firestore timestamps
const convertTimestamps = (data) => {
  const result = { ...data };
  ['createdAt', 'updatedAt', 'date', 'dueDate'].forEach(field => {
    if (result[field]?.toDate) {
      result[field] = result[field].toDate();
    }
  });
  return result;
};

// User Profile Operations
export const createUserProfile = async (userId, profileData) => {
  try {
    // Create a batch to ensure atomic operations
    const batch = writeBatch(db);
    
    // Reference to user profile document
    const profileRef = doc(db, 'users', userId);
    
    // Create initial profile data
    const initialProfile = {
      ...profileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      settings: {
        currency: 'USD',
        language: 'en',
        theme: 'light'
      }
    };

    // Add profile creation to batch
    batch.set(profileRef, initialProfile, { merge: true });

    // Create default categories collection
    const defaultCategories = [
      { name: 'Food', type: 'expense', icon: 'food' },
      { name: 'Transport', type: 'expense', icon: 'transport' },
      { name: 'Salary', type: 'income', icon: 'salary' }
    ];

    // Add default categories
    const categoriesRef = collection(profileRef, 'categories');
    defaultCategories.forEach(category => {
      const newCategoryRef = doc(categoriesRef);
      batch.set(newCategoryRef, {
        ...category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active'
      });
    });

    // Commit the batch
    await batch.commit();
    
    return { userId, ...profileData };
  } catch (error) {
    console.error('Profile creation error:', error);
    throw new Error(
      error.code === 'permission-denied' 
        ? 'Permission denied: Unable to create profile'
        : 'Failed to create profile: ' + error.message
    );
  }
};

// Category Operations
export const addCategory = async (userId, categoryData) => {
  const categoriesRef = collection(db, `users/${userId}/categories`);
  
  // Check for duplicate names
  const duplicateQuery = query(
    categoriesRef,
    where('name', '==', categoryData.name),
    where('status', '==', 'active')
  );
  
  const duplicates = await getDocs(duplicateQuery);
  if (!duplicates.empty) {
    throw new Error('Category with this name already exists');
  }

  return addDoc(categoriesRef, {
    ...categoryData,
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const deleteCategory = async (userId, categoryId) => {
  const categoryRef = doc(db, `users/${userId}/categories/${categoryId}`);
  await deleteDoc(categoryRef);
};

export const updateCategory = async (userId, categoryId, data) => {
  const categoryRef = doc(db, `users/${userId}/categories/${categoryId}`);
  await updateDoc(categoryRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

// Transaction Operations
export const addTransaction = async (userId, transactionData) => {
  const transactionsRef = collection(db, `users/${userId}/transactions`);
  
  // Verify category exists
  const categoryRef = doc(db, `users/${userId}/categories/${transactionData.categoryId}`);
  const categoryDoc = await getDoc(categoryRef);
  
  if (!categoryDoc.exists()) {
    throw new Error('Invalid category');
  }

  return addDoc(transactionsRef, {
    ...transactionData,
    amount: Number(transactionData.amount),
    date: new Date(transactionData.date),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const getUserCategories = async (userId) => {
  try {
    const categoriesRef = collection(db, `users/${userId}/categories`);
    const snapshot = await getDocs(categoriesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Get categories error:', error);
    throw new Error(
      error.code === 'permission-denied'
        ? 'Permission denied: Unable to access categories'
        : 'Failed to load categories: ' + error.message
    );
  }
};

export const getUserTransactions = async (userId) => {
  const transactionsRef = collection(db, `users/${userId}/transactions`);
  const snapshot = await getDocs(transactionsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...convertTimestamps(doc.data()) }));
};

export const deleteTransaction = async (userId, transactionId) => {
  const transactionRef = doc(db, `users/${userId}/transactions/${transactionId}`);
  await deleteDoc(transactionRef);
};

export const addTodo = async (userId, todoData) => {
  const todoRef = collection(db, 'users', userId, 'todos');
  const newTodo = {
    ...todoData,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  try {
    const docRef = await addDoc(todoRef, newTodo);
    return {
      id: docRef.id,
      ...newTodo
    };
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const getUserTodos = async (userId) => {
  try {
    const todosRef = collection(db, `users/${userId}/todos`);
    const q = query(todosRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    }));
  } catch (error) {
    console.error('Get todos error:', error);
    throw new Error('Failed to load todos: ' + error.message);
  }
};
