import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const getCategories = async (userId) => {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('userId', 'in', [userId, 'default']));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
