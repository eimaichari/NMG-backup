import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // We are querying the main 'orders' collection to get all orders
    const ordersCollectionRef = collection(db, 'orders');
    // We can order by orderDate to show the most recent orders first
    const q = query(ordersCollectionRef, orderBy('orderDate', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));
        setOrders(fetchedOrders);
        setLoading(false);
      },
      (err) => {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders.');
        setLoading(false);
      }
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return { orders, loading, error };
};
