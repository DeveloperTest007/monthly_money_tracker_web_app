import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs,
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

export const addTransaction = async (userId, transactionData) => {
  try {
    const transactionsRef = collection(db, 'transactions');
    const newTransaction = {
      ...transactionData,
      amount: Number(transactionData.amount),
      userId,
      createdAt: serverTimestamp()
    };
    
    await addDoc(transactionsRef, newTransaction);
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const getTransactions = async (userId) => {
  try {
    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};
