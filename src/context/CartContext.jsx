import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  doc, collection, setDoc, deleteDoc, onSnapshot, getDocs, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false); // cart drawer open state

  // Real-time cart listener
  useEffect(() => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    const cartRef = collection(db, 'users', user.uid, 'cart');
    const unsub = onSnapshot(cartRef, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const addItem = useCallback(async (product, qty = 1) => {
    if (!user) return;
    const ref  = doc(db, 'users', user.uid, 'cart', product.id);
    const existing = items.find(i => i.id === product.id);
    await setDoc(ref, {
      productId: product.id,
      name:      product.name,
      price:     product.price_rands,
      image:     product.image_urls?.[0] || '',
      quantity:  (existing?.quantity || 0) + qty,
      addedAt:   serverTimestamp(),
    }, { merge: true });
    setOpen(true); // open drawer on add
  }, [user, items]);

  const removeItem = useCallback(async (productId) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'cart', productId));
  }, [user]);

  const updateQty = useCallback(async (productId, qty) => {
    if (!user) return;
    if (qty < 1) { await removeItem(productId); return; }
    await setDoc(doc(db, 'users', user.uid, 'cart', productId), { quantity: qty }, { merge: true });
  }, [user, removeItem]);

  const clearCart = useCallback(async () => {
    if (!user) return;
    const cartRef = collection(db, 'users', user.uid, 'cart');
    const snap = await getDocs(cartRef);
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
  }, [user]);

  const total    = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count    = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, total, count, open, setOpen, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
