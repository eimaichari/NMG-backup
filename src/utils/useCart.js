import { useState, useEffect } from 'react';
import {db}  from '../utils/firebase'
import {useAuth} from '../context/AuthContext'
import { collection, onSnapshot, getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export const useCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const cartCollectionRef = collection(db, 'users', user.uid, 'cart');
    const unsubscribe = onSnapshot(
      cartCollectionRef,
      (snapshot) => {
        const items = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));
        setCartItems(items);
        setLoading(false);
      },
      (err) => {
        console.error('Failed to fetch cart:', err);
        setError('Failed to load cart items.');
        setLoading(false);
      }
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [user]);

  // Function to remove an item from the cart
  const removeItem = async (productId) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid, 'cart', productId);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  // Function to increase item quantity
  const increaseQuantity = async (productId) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid, 'cart', productId);
      const snapshot = await getDoc(docRef);
      const newQuantity = snapshot.data().quantity + 1;
      await updateDoc(docRef, { quantity: newQuantity });
    } catch (err) {
      console.error('Error increasing quantity:', err);
    }
  };

  // Function to decrease item quantity
  const decreaseQuantity = async (productId) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid, 'cart', productId);
      const snapshot = await getDoc(docRef);
      const currentQuantity = snapshot.data().quantity;
      if (currentQuantity > 1) {
        const newQuantity = currentQuantity - 1;
        await updateDoc(docRef, { quantity: newQuantity });
      } else {
        // If quantity is 1, remove the item
        await deleteDoc(docRef);
      }
    } catch (err) {
      console.error('Error decreasing quantity:', err);
    }
  };

  return { cartItems, loading, error, removeItem, increaseQuantity, decreaseQuantity };
};